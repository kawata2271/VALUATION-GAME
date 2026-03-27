// ===== Recruiting System — Zustand Store =====
// 採用プロセス全体のステート管理

import { create } from 'zustand';
import type { GameState } from '../types';
import type {
  CandidateProfile,
  CandidatePool,
  InterviewStage,
  InterviewEvent,
  InterviewChoiceEffect,
  SalaryOffer,
  SalaryNegotiation,
  NegotiationResponse,
  RecruitingChannel,
  JobType,
  HiringRecord,
  TurnRecruitingReport,
  AbilityKey,
} from './types';
import { INTERVIEW_STAGE_ORDER } from './types';
import {
  INTERVIEW_SLOTS,
  STAGE_REVEAL_CONFIG,
  TURN_INTEREST_DECAY,
  S_RANK_RULES,
  MIN_INTEREST_FOR_OFFER,
  REAPPLY_RULES,
  SNS_BRANDING_EFFECT,
  CHANNEL_CONFIGS,
} from './constants';
import {
  generateCandidates as genCandidates,
  generateCandidate,
  calculateCompanyInterestBonus,
  revealAbilities,
  evaluateOfferAcceptance,
} from './candidateGenerator';
import {
  getEventsForStage,
  filterEvents,
} from './interviewEvents';
import {
  createNegotiation,
  evaluateOffer,
  calculateAnnualCost,
  salaryToGameCurrency,
  monthlyBurnImpact,
} from './salaryTable';

// --- Store Interface ---

export interface RecruitingState {
  // 候補者プール
  candidatePool: CandidatePool;

  // 進行中の給与交渉
  ongoingNegotiations: SalaryNegotiation[];

  // 採用ブランドスコア
  employerBrandScore: number;

  // SNSブランディングのスタック数
  snsBrandingStacks: number;

  // 採用履歴
  hiringHistory: HiringRecord[];

  // 現在表示中の面談イベント
  pendingInterviewEvent: {
    candidateId: string;
    event: InterviewEvent;
  } | null;

  // 最新のターンレポート
  lastTurnReport: TurnRecruitingReport | null;
}

export interface RecruitingActions {
  // 初期化
  initRecruitingState: () => void;

  // 候補者獲得
  searchCandidates: (channel: RecruitingChannel, gameState: GameState, preferredJobType?: JobType) => CandidateProfile[];

  // 面談進行
  startInterview: (candidateId: string) => InterviewEvent | null;
  advanceInterview: (candidateId: string, choiceIndex: number) => InterviewChoiceEffect | null;
  skipSecondInterview: (candidateId: string) => boolean;
  moveToOffer: (candidateId: string) => boolean;

  // オファー & 交渉
  makeOffer: (candidateId: string, offer: SalaryOffer, gameState: GameState) => {
    accepted: boolean;
    reason: string;
    negotiation?: SalaryNegotiation;
  };
  counterOffer: (candidateId: string, newOffer: SalaryOffer, gameState: GameState) => {
    response: NegotiationResponse;
    message: string;
  };
  withdrawOffer: (candidateId: string) => void;

  // 候補者管理
  rejectCandidate: (candidateId: string) => void;
  holdCandidate: (candidateId: string) => void;

  // ターン処理
  processRecruitingTurn: (gameState: GameState) => TurnRecruitingReport;

  // イベント関連
  dismissInterviewEvent: () => void;

  // ユーティリティ
  getVisibleAbilities: (candidateId: string) => Partial<Record<AbilityKey, { value: number; isEstimate: boolean; range?: [number, number] }>>;
  estimateHiringProbability: (candidateId: string, gameState: GameState) => number;
  getCandidateById: (candidateId: string) => CandidateProfile | undefined;
  getActiveCandidateCount: () => number;
  getMaxActiveInterviews: (gameState: GameState) => number;
}

export type RecruitingStore = RecruitingState & RecruitingActions;

// --- Helper Functions ---

function clampInterest(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function getNextStage(current: InterviewStage): InterviewStage | null {
  const idx = INTERVIEW_STAGE_ORDER.indexOf(current);
  if (idx < 0 || idx >= INTERVIEW_STAGE_ORDER.length - 1) return null;
  return INTERVIEW_STAGE_ORDER[idx + 1];
}

function pickRandomEvent(events: InterviewEvent[]): InterviewEvent | null {
  if (events.length === 0) return null;
  return events[Math.floor(Math.random() * events.length)];
}

// --- Store ---

export const useRecruitingStore = create<RecruitingStore>((set, get) => ({
  // Initial state
  candidatePool: {
    activeCandidates: [],
    availableCandidates: [],
    archivedCandidates: [],
    maxActiveInterviews: INTERVIEW_SLOTS.base,
  },
  ongoingNegotiations: [],
  employerBrandScore: 10,
  snsBrandingStacks: 0,
  hiringHistory: [],
  pendingInterviewEvent: null,
  lastTurnReport: null,

  // === 初期化 ===
  initRecruitingState: () => {
    set({
      candidatePool: {
        activeCandidates: [],
        availableCandidates: [],
        archivedCandidates: [],
        maxActiveInterviews: INTERVIEW_SLOTS.base,
      },
      ongoingNegotiations: [],
      employerBrandScore: 10,
      snsBrandingStacks: 0,
      hiringHistory: [],
      pendingInterviewEvent: null,
      lastTurnReport: null,
    });
  },

  // === 候補者獲得 ===
  searchCandidates: (channel, gameState, preferredJobType) => {
    const state = get();

    // SNSブランディングの場合は候補者を直接生成しない
    if (channel === 'sns_branding') {
      const newStacks = Math.min(state.snsBrandingStacks + 1, SNS_BRANDING_EFFECT.maxStack);
      set({
        snsBrandingStacks: newStacks,
        employerBrandScore: Math.min(100, state.employerBrandScore + SNS_BRANDING_EFFECT.employerBrandBoost),
      });
      return [];
    }

    // 企業ステータスによる興味度ボーナスを計算
    const companyBonus = calculateCompanyInterestBonus(
      gameState.valuation,
      gameState.history.length >= 2
        ? ((gameState.mrr - (gameState.history[gameState.history.length - 2]?.mrr ?? 0)) /
           Math.max(1, gameState.history[gameState.history.length - 2]?.mrr ?? 1)) * 100
        : 0,
      gameState.brand,
    );

    // 候補者生成
    const candidates = genCandidates(channel, preferredJobType);

    // 企業ボーナスを適用
    const adjustedCandidates = candidates.map(c => ({
      ...c,
      interestLevel: clampInterest(c.interestLevel + companyBonus + Math.floor(state.employerBrandScore * 0.1)),
    }));

    // プールに追加
    set(s => ({
      candidatePool: {
        ...s.candidatePool,
        availableCandidates: [...s.candidatePool.availableCandidates, ...adjustedCandidates],
      },
    }));

    return adjustedCandidates;
  },

  // === 面談開始 ===
  startInterview: (candidateId) => {
    const state = get();
    const { candidatePool } = state;

    // 候補者を見つける
    const availIdx = candidatePool.availableCandidates.findIndex(c => c.id === candidateId);
    const activeIdx = candidatePool.activeCandidates.findIndex(c => c.id === candidateId);

    let candidate: CandidateProfile | undefined;

    if (availIdx >= 0) {
      // 新規面談開始: available → active
      candidate = candidatePool.availableCandidates[availIdx];
      if (candidatePool.activeCandidates.length >= candidatePool.maxActiveInterviews) {
        return null; // 面談枠が満杯
      }
      const newAvailable = [...candidatePool.availableCandidates];
      newAvailable.splice(availIdx, 1);
      const updatedCandidate = { ...candidate, interviewStage: 'casual_talk' as InterviewStage };

      // 能力開示
      const stageConfig = STAGE_REVEAL_CONFIG['casual_talk'];
      updatedCandidate.revealedAbility = revealAbilities(
        updatedCandidate, 'casual_talk',
        stageConfig.noiseRange, stageConfig.revealCount,
      );

      set(s => ({
        candidatePool: {
          ...s.candidatePool,
          availableCandidates: newAvailable,
          activeCandidates: [...s.candidatePool.activeCandidates, updatedCandidate],
        },
      }));
      candidate = updatedCandidate;
    } else if (activeIdx >= 0) {
      // 既存面談を次のステージへ
      candidate = candidatePool.activeCandidates[activeIdx];
      const nextStage = getNextStage(candidate.interviewStage);
      if (!nextStage || nextStage === 'offer') return null;

      const stageConfig = STAGE_REVEAL_CONFIG[nextStage];
      const updatedCandidate = {
        ...candidate,
        interviewStage: nextStage,
        revealedAbility: revealAbilities(
          candidate, nextStage,
          stageConfig.noiseRange, stageConfig.revealCount,
        ),
      };

      // 特殊属性ヒント
      if (stageConfig.canRevealTrait && candidate.specialTrait && !candidate.traitHintRevealed) {
        if (Math.random() < stageConfig.traitRevealRate) {
          updatedCandidate.traitHintRevealed = true;
        }
      }

      // 隠し適職ヒント
      if (stageConfig.canRevealBestFit && candidate.hiddenBestFitJob !== candidate.currentJobType && !candidate.bestFitHintRevealed) {
        if (Math.random() < stageConfig.bestFitHintRate) {
          updatedCandidate.bestFitHintRevealed = true;
        }
      }

      const newActive = [...candidatePool.activeCandidates];
      newActive[activeIdx] = updatedCandidate;

      set(s => ({
        candidatePool: {
          ...s.candidatePool,
          activeCandidates: newActive,
        },
      }));
      candidate = updatedCandidate;
    } else {
      return null;
    }

    // イベント生成
    const stageEvents = getEventsForStage(candidate.interviewStage);
    const filteredEvents = filterEvents(
      stageEvents,
      candidate.rank,
      candidate.currentJobType,
      candidate.interestLevel,
      !!candidate.specialTrait,
      candidate.isSpecialist,
    );

    const event = pickRandomEvent(filteredEvents);
    if (event) {
      set({ pendingInterviewEvent: { candidateId: candidate.id, event } });
    }
    return event;
  },

  // === 面談イベントの選択肢を処理 ===
  advanceInterview: (candidateId, choiceIndex) => {
    const state = get();
    const { pendingInterviewEvent, candidatePool } = state;

    if (!pendingInterviewEvent || pendingInterviewEvent.candidateId !== candidateId) {
      return null;
    }

    const event = pendingInterviewEvent.event;
    if (choiceIndex < 0 || choiceIndex >= event.choices.length) return null;

    const choice = event.choices[choiceIndex];
    const effects = choice.effects;

    // 候補者を更新
    const activeIdx = candidatePool.activeCandidates.findIndex(c => c.id === candidateId);
    if (activeIdx < 0) return null;

    const candidate = { ...candidatePool.activeCandidates[activeIdx] };

    // 興味度変動
    candidate.interestLevel = clampInterest(candidate.interestLevel + effects.interestDelta);

    // 能力開示
    if (effects.revealAbility) {
      const stageConfig = STAGE_REVEAL_CONFIG[candidate.interviewStage] ?? STAGE_REVEAL_CONFIG['casual_talk'];
      candidate.revealedAbility = revealAbilities(
        candidate, candidate.interviewStage,
        stageConfig.noiseRange,
        Object.keys(candidate.revealedAbility).length + 1,
        effects.revealAbility,
      );
    }

    // ボーナス開示
    if (effects.bonusRevealCount) {
      const stageConfig = STAGE_REVEAL_CONFIG[candidate.interviewStage] ?? STAGE_REVEAL_CONFIG['casual_talk'];
      candidate.revealedAbility = revealAbilities(
        candidate, candidate.interviewStage,
        stageConfig.noiseRange,
        Object.keys(candidate.revealedAbility).length + effects.bonusRevealCount,
      );
    }

    // 特殊属性開示
    if (effects.revealTrait) {
      candidate.traitHintRevealed = true;
    }

    // 隠し適職開示
    if (effects.revealBestFit) {
      candidate.bestFitHintRevealed = true;
    }

    // 給与期待変動
    if (effects.salaryExpectationDelta) {
      candidate.salaryExpectation = Math.max(100, candidate.salaryExpectation + effects.salaryExpectationDelta);
    }

    // 採用ブランドスコア変動
    if (effects.companyReputationDelta) {
      set(s => ({
        employerBrandScore: Math.max(0, Math.min(100,
          s.employerBrandScore + (effects.companyReputationDelta ?? 0)
        )),
      }));
    }

    // 興味度が0以下 → 離脱
    if (candidate.interestLevel <= 0) {
      candidate.interviewStage = 'withdrawn';
      const newActive = candidatePool.activeCandidates.filter(c => c.id !== candidateId);
      set(s => ({
        candidatePool: {
          ...s.candidatePool,
          activeCandidates: newActive,
          archivedCandidates: [...s.candidatePool.archivedCandidates, candidate],
        },
        pendingInterviewEvent: null,
      }));
      return effects;
    }

    // 候補者を更新
    const newActive = [...candidatePool.activeCandidates];
    newActive[activeIdx] = candidate;

    set({
      candidatePool: {
        ...state.candidatePool,
        activeCandidates: newActive,
      },
      pendingInterviewEvent: null,
    });

    return effects;
  },

  // === 二次面接スキップ（C以下のみ） ===
  skipSecondInterview: (candidateId) => {
    const state = get();
    const idx = state.candidatePool.activeCandidates.findIndex(c => c.id === candidateId);
    if (idx < 0) return false;

    const candidate = state.candidatePool.activeCandidates[idx];
    if (candidate.interviewStage !== 'first_interview') return false;

    const rankOrder = ['D', 'C', 'B', 'A', 'S'];
    const rankIdx = rankOrder.indexOf(candidate.rank);
    if (rankIdx > 1) return false; // B以上はスキップ不可

    // 二次面接を飛ばして最終面接へ
    const stageConfig = STAGE_REVEAL_CONFIG['final_interview'];
    const updated = {
      ...candidate,
      interviewStage: 'final_interview' as InterviewStage,
      revealedAbility: revealAbilities(
        candidate, 'final_interview',
        stageConfig.noiseRange, stageConfig.revealCount,
      ),
    };

    const newActive = [...state.candidatePool.activeCandidates];
    newActive[idx] = updated;
    set(s => ({ candidatePool: { ...s.candidatePool, activeCandidates: newActive } }));
    return true;
  },

  // === オファーステージへ移動 ===
  moveToOffer: (candidateId) => {
    const state = get();
    const idx = state.candidatePool.activeCandidates.findIndex(c => c.id === candidateId);
    if (idx < 0) return false;

    const candidate = state.candidatePool.activeCandidates[idx];
    if (candidate.interviewStage !== 'final_interview') return false;

    // 全能力値を確定開示
    const stageConfig = STAGE_REVEAL_CONFIG['offer'];
    const updated = {
      ...candidate,
      interviewStage: 'offer' as InterviewStage,
      revealedAbility: revealAbilities(
        candidate, 'offer',
        stageConfig.noiseRange, stageConfig.revealCount,
      ),
      traitHintRevealed: !!candidate.specialTrait, // オファー時は特殊属性確定
      bestFitHintRevealed: candidate.hiddenBestFitJob !== candidate.currentJobType,
    };

    const newActive = [...state.candidatePool.activeCandidates];
    newActive[idx] = updated;

    // 交渉オブジェクトを作成
    const negotiation = createNegotiation(updated);

    set(s => ({
      candidatePool: { ...s.candidatePool, activeCandidates: newActive },
      ongoingNegotiations: [...s.ongoingNegotiations, negotiation],
    }));
    return true;
  },

  // === オファー ===
  makeOffer: (candidateId, offer, gameState) => {
    const state = get();
    const idx = state.candidatePool.activeCandidates.findIndex(c => c.id === candidateId);
    if (idx < 0) return { accepted: false, reason: '候補者が見つかりません' };

    const candidate = state.candidatePool.activeCandidates[idx];
    if (candidate.interviewStage !== 'offer') {
      return { accepted: false, reason: 'オファーステージではありません' };
    }

    // 交渉を更新
    const negIdx = state.ongoingNegotiations.findIndex(n => n.candidateId === candidateId);
    const negotiation = negIdx >= 0
      ? { ...state.ongoingNegotiations[negIdx] }
      : createNegotiation(candidate);

    negotiation.round += 1;
    negotiation.offers.push(offer);

    // 評価
    const companyBonus = calculateCompanyInterestBonus(
      gameState.valuation,
      0,
      gameState.brand,
    );

    const result = evaluateOfferAcceptance(candidate, {
      baseSalary: offer.baseSalary,
      stockOptionPercent: offer.stockOptionPercent,
      signingBonus: offer.signingBonus,
      benefits: offer.benefits,
    }, companyBonus);

    if (result.accepted) {
      // 採用成功
      const updatedCandidate = {
        ...candidate,
        interviewStage: 'offer_accepted' as InterviewStage,
      };

      const hiringRecord: HiringRecord = {
        candidateId: candidate.id,
        name: candidate.name,
        rank: candidate.rank,
        jobType: candidate.currentJobType,
        finalSalary: offer.baseSalary,
        stockOption: offer.stockOptionPercent,
        signingBonus: offer.signingBonus,
        hiredMonth: gameState.month,
        interviewRounds: INTERVIEW_STAGE_ORDER.indexOf(candidate.interviewStage),
        channel: candidate.sourceChannel,
      };

      negotiation.status = 'accepted';
      negotiation.candidateResponses.push('accept');

      const newActive = state.candidatePool.activeCandidates.filter(c => c.id !== candidateId);
      const newNegotiations = state.ongoingNegotiations.filter(n => n.candidateId !== candidateId);

      set(s => ({
        candidatePool: {
          ...s.candidatePool,
          activeCandidates: newActive,
          archivedCandidates: [...s.candidatePool.archivedCandidates, updatedCandidate],
        },
        ongoingNegotiations: newNegotiations,
        hiringHistory: [...s.hiringHistory, hiringRecord],
      }));

      return { accepted: true, reason: result.reason, negotiation };
    }

    // Sランク初回拒否処理
    if (candidate.rank === 'S' && !candidate.firstOfferRejected) {
      const updatedCandidate = { ...candidate, firstOfferRejected: true };
      const newActive = [...state.candidatePool.activeCandidates];
      newActive[idx] = updatedCandidate;

      negotiation.candidateResponses.push('thinking');
      const newNegotiations = [...state.ongoingNegotiations];
      if (negIdx >= 0) {
        newNegotiations[negIdx] = negotiation;
      } else {
        newNegotiations.push(negotiation);
      }

      set(s => ({
        candidatePool: { ...s.candidatePool, activeCandidates: newActive },
        ongoingNegotiations: newNegotiations,
      }));

      return { accepted: false, reason: result.reason, negotiation };
    }

    // 通常の拒否 or カウンター
    negotiation.candidateResponses.push('counter');
    const newNegotiations = [...state.ongoingNegotiations];
    if (negIdx >= 0) {
      newNegotiations[negIdx] = negotiation;
    } else {
      newNegotiations.push(negotiation);
    }

    set({ ongoingNegotiations: newNegotiations });
    return { accepted: false, reason: result.reason, negotiation };
  },

  // === カウンターオファー ===
  counterOffer: (candidateId, newOffer, gameState) => {
    const state = get();
    const negIdx = state.ongoingNegotiations.findIndex(n => n.candidateId === candidateId);
    if (negIdx < 0) return { response: 'reject' as NegotiationResponse, message: '交渉が見つかりません' };

    const candidate = state.candidatePool.activeCandidates.find(c => c.id === candidateId);
    if (!candidate) return { response: 'reject' as NegotiationResponse, message: '候補者が見つかりません' };

    const negotiation = { ...state.ongoingNegotiations[negIdx] };
    const evalResult = evaluateOffer(candidate, negotiation, newOffer);

    negotiation.round += 1;
    negotiation.offers.push(newOffer);
    negotiation.candidateResponses.push(evalResult.response);

    // 興味度変動
    const idx = state.candidatePool.activeCandidates.findIndex(c => c.id === candidateId);
    if (idx >= 0) {
      const updatedCandidate = {
        ...candidate,
        interestLevel: clampInterest(candidate.interestLevel + evalResult.interestDelta),
        salaryExpectation: evalResult.newExpectation,
      };

      const newActive = [...state.candidatePool.activeCandidates];
      newActive[idx] = updatedCandidate;

      if (evalResult.response === 'accept') {
        // 承諾
        const accepted = { ...updatedCandidate, interviewStage: 'offer_accepted' as InterviewStage };
        negotiation.status = 'accepted';

        const hiringRecord: HiringRecord = {
          candidateId: candidate.id,
          name: candidate.name,
          rank: candidate.rank,
          jobType: candidate.currentJobType,
          finalSalary: newOffer.baseSalary,
          stockOption: newOffer.stockOptionPercent,
          signingBonus: newOffer.signingBonus,
          hiredMonth: gameState.month,
          interviewRounds: INTERVIEW_STAGE_ORDER.indexOf(candidate.interviewStage),
          channel: candidate.sourceChannel,
        };

        set(s => ({
          candidatePool: {
            ...s.candidatePool,
            activeCandidates: s.candidatePool.activeCandidates.filter(c => c.id !== candidateId),
            archivedCandidates: [...s.candidatePool.archivedCandidates, accepted],
          },
          ongoingNegotiations: s.ongoingNegotiations.map((n, i) => i === negIdx ? negotiation : n),
          hiringHistory: [...s.hiringHistory, hiringRecord],
        }));
      } else if (evalResult.response === 'reject') {
        // 拒否
        const rejected = { ...updatedCandidate, interviewStage: 'offer_rejected' as InterviewStage };
        negotiation.status = 'rejected';

        set(s => ({
          candidatePool: {
            ...s.candidatePool,
            activeCandidates: s.candidatePool.activeCandidates.filter(c => c.id !== candidateId),
            archivedCandidates: [...s.candidatePool.archivedCandidates, rejected],
          },
          ongoingNegotiations: s.ongoingNegotiations.map((n, i) => i === negIdx ? negotiation : n),
        }));
      } else {
        // カウンター: 継続
        set(s => ({
          candidatePool: { ...s.candidatePool, activeCandidates: newActive },
          ongoingNegotiations: s.ongoingNegotiations.map((n, i) => i === negIdx ? negotiation : n),
        }));
      }
    }

    return { response: evalResult.response, message: evalResult.message };
  },

  // === オファー取り下げ ===
  withdrawOffer: (candidateId) => {
    const state = get();
    const candidate = state.candidatePool.activeCandidates.find(c => c.id === candidateId);
    if (!candidate) return;

    const withdrawn = { ...candidate, interviewStage: 'withdrawn' as InterviewStage };

    set(s => ({
      candidatePool: {
        ...s.candidatePool,
        activeCandidates: s.candidatePool.activeCandidates.filter(c => c.id !== candidateId),
        archivedCandidates: [...s.candidatePool.archivedCandidates, withdrawn],
      },
      ongoingNegotiations: s.ongoingNegotiations.filter(n => n.candidateId !== candidateId),
    }));
  },

  // === 候補者を見送り ===
  rejectCandidate: (candidateId) => {
    const state = get();
    const available = state.candidatePool.availableCandidates.find(c => c.id === candidateId);
    const active = state.candidatePool.activeCandidates.find(c => c.id === candidateId);
    const candidate = available || active;
    if (!candidate) return;

    const rejected = { ...candidate, interviewStage: 'withdrawn' as InterviewStage };

    set(s => ({
      candidatePool: {
        ...s.candidatePool,
        availableCandidates: s.candidatePool.availableCandidates.filter(c => c.id !== candidateId),
        activeCandidates: s.candidatePool.activeCandidates.filter(c => c.id !== candidateId),
        archivedCandidates: [...s.candidatePool.archivedCandidates, rejected],
      },
      ongoingNegotiations: s.ongoingNegotiations.filter(n => n.candidateId !== candidateId),
    }));
  },

  // === 候補者を保留 ===
  holdCandidate: (_candidateId) => {
    // 保留は特に何もしない（ターン消費で賞味期限が減るだけ）
  },

  // === ターン処理 ===
  processRecruitingTurn: (gameState) => {
    const state = get();
    const report: TurnRecruitingReport = {
      candidatesLost: [],
      interestChanges: [],
      newApplications: [],
    };

    // 1. 賞味期限の処理
    const newAvailable: CandidateProfile[] = [];
    const newArchived: CandidateProfile[] = [...state.candidatePool.archivedCandidates];

    for (const candidate of state.candidatePool.availableCandidates) {
      const updated = { ...candidate, availableTurns: candidate.availableTurns - 1 };
      if (updated.availableTurns <= 0) {
        updated.interviewStage = 'withdrawn';
        newArchived.push(updated);
        report.candidatesLost.push(updated);
      } else {
        newAvailable.push(updated);
      }
    }

    // 2. アクティブ候補者の興味度減衰 & 賞味期限
    const newActive: CandidateProfile[] = [];

    for (const candidate of state.candidatePool.activeCandidates) {
      const updated = { ...candidate, availableTurns: candidate.availableTurns - 1 };

      // 興味度自然減衰
      let decay = TURN_INTEREST_DECAY.perTurnDecay;

      // 面談が進んでいない場合の追加ペナルティ
      const stageIdx = INTERVIEW_STAGE_ORDER.indexOf(updated.interviewStage);
      if (stageIdx <= 1) {
        decay += TURN_INTEREST_DECAY.waitingPenalty;
      }

      // 他社競合中のペナルティ
      if (updated.isExclusive) {
        decay += TURN_INTEREST_DECAY.exclusiveCompetitorDelta;
      }

      updated.interestLevel = clampInterest(updated.interestLevel + decay);

      report.interestChanges.push({
        candidateId: updated.id,
        delta: decay,
        reason: updated.isExclusive ? '他社と競合中' : '自然減衰',
      });

      // 賞味期限切れ or 興味度0
      if (updated.availableTurns <= 0 || updated.interestLevel <= 0) {
        updated.interviewStage = 'withdrawn';
        newArchived.push(updated);
        report.candidatesLost.push(updated);
      } else {
        newActive.push(updated);
      }
    }

    // 3. 自然応募（ブランド力に応じて）
    if (gameState.brand >= 30 && Math.random() < 0.2 + state.employerBrandScore * 0.003) {
      const naturalCandidate = generateCandidate('job_board', undefined);
      const companyBonus = calculateCompanyInterestBonus(gameState.valuation, 0, gameState.brand);
      naturalCandidate.interestLevel = clampInterest(naturalCandidate.interestLevel + companyBonus);
      newAvailable.push(naturalCandidate);
      report.newApplications.push(naturalCandidate);
    }

    // 4. 再応募チェック
    const reapplyCandidates: CandidateProfile[] = [];
    const remainingArchived: CandidateProfile[] = [];

    for (const archived of newArchived) {
      // 離脱後一定ターンが経過した候補者の再応募判定
      // availableTurnsが負の値で経過ターン数を近似
      if (archived.availableTurns <= -REAPPLY_RULES.turnsBeforeReapply && Math.random() < REAPPLY_RULES.reapplyRate) {
        const reapplied: CandidateProfile = {
          ...archived,
          interviewStage: 'discovered',
          interestLevel: Math.floor(Math.random() * (REAPPLY_RULES.reapplyInterestRange.max - REAPPLY_RULES.reapplyInterestRange.min) + REAPPLY_RULES.reapplyInterestRange.min),
          availableTurns: 5,
          firstOfferRejected: false,
          traitHintRevealed: false,
          bestFitHintRevealed: false,
          revealedAbility: {},
        };
        reapplyCandidates.push(reapplied);
        report.newApplications.push(reapplied);
      } else {
        remainingArchived.push(archived);
      }
    }

    // 5. 面談枠の更新
    const hrCount = gameState.employees.filter(e => e.role === 'coo').length; // COOをHR代替
    const maxInterviews = INTERVIEW_SLOTS.base + hrCount * INTERVIEW_SLOTS.perHrEmployee;

    set({
      candidatePool: {
        availableCandidates: [...newAvailable, ...reapplyCandidates],
        activeCandidates: newActive,
        archivedCandidates: remainingArchived,
        maxActiveInterviews: maxInterviews,
      },
      lastTurnReport: report,
    });

    return report;
  },

  // === イベント非表示 ===
  dismissInterviewEvent: () => {
    set({ pendingInterviewEvent: null });
  },

  // === ユーティリティ ===

  getVisibleAbilities: (candidateId) => {
    const state = get();
    const candidate =
      state.candidatePool.activeCandidates.find(c => c.id === candidateId) ??
      state.candidatePool.availableCandidates.find(c => c.id === candidateId);

    if (!candidate) return {};

    const stageConfig = STAGE_REVEAL_CONFIG[candidate.interviewStage] ?? STAGE_REVEAL_CONFIG['discovered'];
    const result: Partial<Record<AbilityKey, { value: number; isEstimate: boolean; range?: [number, number] }>> = {};

    const revealed = candidate.revealedAbility;
    const estimated = candidate.estimatedAbility;

    for (const key of ['coding', 'communication', 'leadership', 'analytics', 'creativity', 'domainKnowledge', 'stamina', 'growth'] as AbilityKey[]) {
      if (key in revealed) {
        const val = revealed[key]!;
        if (stageConfig.noiseRange === 0) {
          // 確定値
          result[key] = { value: val, isEstimate: false };
        } else {
          // レンジ表示
          const lo = Math.max(0, val - stageConfig.noiseRange);
          const hi = Math.min(100, val + stageConfig.noiseRange);
          result[key] = { value: val, isEstimate: true, range: [lo, hi] };
        }
      }
      // 未開示は含めない（UIで ??? 表示）
    }

    return result;
  },

  estimateHiringProbability: (candidateId, gameState) => {
    const state = get();
    const candidate =
      state.candidatePool.activeCandidates.find(c => c.id === candidateId) ??
      state.candidatePool.availableCandidates.find(c => c.id === candidateId);

    if (!candidate) return 0;

    const companyBonus = calculateCompanyInterestBonus(gameState.valuation, 0, gameState.brand);
    const effectiveInterest = candidate.interestLevel + companyBonus;
    const minRequired = MIN_INTEREST_FOR_OFFER[candidate.rank];

    if (effectiveInterest < minRequired * 0.5) return 0.05;
    if (effectiveInterest < minRequired) return 0.20;
    if (effectiveInterest < minRequired + 10) return 0.50;
    if (effectiveInterest < minRequired + 20) return 0.70;
    return 0.85;
  },

  getCandidateById: (candidateId) => {
    const state = get();
    return (
      state.candidatePool.activeCandidates.find(c => c.id === candidateId) ??
      state.candidatePool.availableCandidates.find(c => c.id === candidateId) ??
      state.candidatePool.archivedCandidates.find(c => c.id === candidateId)
    );
  },

  getActiveCandidateCount: () => {
    return get().candidatePool.activeCandidates.length;
  },

  getMaxActiveInterviews: (gameState) => {
    const hrCount = gameState.employees.filter(e => e.role === 'coo').length;
    return INTERVIEW_SLOTS.base + hrCount * INTERVIEW_SLOTS.perHrEmployee;
  },
}));
