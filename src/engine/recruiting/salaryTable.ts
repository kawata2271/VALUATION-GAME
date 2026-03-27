// ===== 給与テーブル & 交渉ロジック =====

import type {
  CandidateRank,
  CandidateProfile,
  SalaryOffer,
  SalaryNegotiation,
  NegotiationResponse,
  BenefitType,
} from './types';
import { BENEFIT_INTEREST_BONUS } from './types';
import {
  SALARY_TABLE,
  NEGOTIATION_RULES,
} from './constants';

// --- 市場相場の取得 ---

export function getMarketSalaryRange(rank: CandidateRank): {
  min: number;
  max: number;
  minAcceptable: number;
  ideal: number;
} {
  return SALARY_TABLE[rank];
}

// --- 給与交渉の作成 ---

export function createNegotiation(candidate: CandidateProfile): SalaryNegotiation {
  return {
    candidateId: candidate.id,
    round: 0,
    maxRounds: NEGOTIATION_RULES.maxRounds,
    candidateExpectation: candidate.salaryExpectation,
    offers: [],
    candidateResponses: [],
    status: 'ongoing',
  };
}

// --- オファーに対する候補者の反応を判定 ---

export function evaluateOffer(
  candidate: CandidateProfile,
  negotiation: SalaryNegotiation,
  offer: SalaryOffer,
): {
  response: NegotiationResponse;
  message: string;
  interestDelta: number;
  newExpectation: number;
} {
  const { rank, interestLevel, salaryExpectation, salaryFlexibility } = candidate;
  const salaryRange = SALARY_TABLE[rank];
  const round = negotiation.round + 1;

  // ラウンドオーバーチェック
  if (round > NEGOTIATION_RULES.maxRounds) {
    return {
      response: 'reject',
      message: '交渉が長引きすぎました。「決断を急がされている感じがして…」候補者が辞退しました。',
      interestDelta: NEGOTIATION_RULES.overMaxRoundsPenalty,
      newExpectation: salaryExpectation,
    };
  }

  // トータルコンペンセーション計算
  const soValue = offer.stockOptionPercent * salaryRange.ideal * 0.01 *
    NEGOTIATION_RULES.stockOptionEffectiveness[rank];
  const benefitValue = offer.benefits.reduce((sum, b) => {
    return sum + (BENEFIT_INTEREST_BONUS[b as BenefitType] ?? 0) * 5; // 興味度ボーナスを万円換算
  }, 0);
  const totalComp = offer.baseSalary + offer.signingBonus * 0.3 + soValue + benefitValue;

  // 最低許容額チェック
  const minAcceptable = salaryExpectation * (1 - salaryFlexibility / 100);
  if (offer.baseSalary < salaryRange.minAcceptable) {
    return {
      response: 'reject',
      message: `提示額が市場相場を大幅に下回っています。「さすがにこの金額では…」候補者が辞退しました。`,
      interestDelta: NEGOTIATION_RULES.lowOfferPenalty,
      newExpectation: salaryExpectation,
    };
  }

  // 満足度スコアの計算
  const satisfactionRatio = totalComp / salaryExpectation;

  // 判定
  if (satisfactionRatio >= 1.0) {
    // 期待を上回る → 承諾
    return {
      response: 'accept',
      message: '「素晴らしい条件をありがとうございます。ぜひ入社させてください！」',
      interestDelta: 10,
      newExpectation: salaryExpectation,
    };
  }

  if (satisfactionRatio >= 0.90) {
    // ほぼ期待通り → 興味度次第
    if (interestLevel >= 70) {
      return {
        response: 'accept',
        message: '「年収は希望より少し低いですが、それ以外の魅力を考えて決めました！」',
        interestDelta: 5,
        newExpectation: salaryExpectation,
      };
    }
    return {
      response: 'counter',
      message: '「あと少しだけ…基本年収を上げていただくことは可能ですか？」',
      interestDelta: -2,
      newExpectation: Math.round(salaryExpectation * 0.95),
    };
  }

  if (satisfactionRatio >= 0.80) {
    // やや不足 → カウンター
    const gap = salaryExpectation - totalComp;
    return {
      response: 'counter',
      message: `「希望との差が${Math.round(gap)}万円ほどあります。もう少し検討いただけませんか？」`,
      interestDelta: -5,
      newExpectation: Math.round(salaryExpectation * 0.97),
    };
  }

  // 大幅に不足 → 拒否リスク高
  if (interestLevel >= 80) {
    // 興味度が非常に高ければカウンター
    return {
      response: 'counter',
      message: '「御社で働きたい気持ちは強いのですが、この年収では生活が…」',
      interestDelta: -8,
      newExpectation: Math.round(salaryExpectation * 0.95),
    };
  }

  return {
    response: 'reject',
    message: '「申し訳ありませんが、条件面で折り合いがつきませんでした。」',
    interestDelta: -15,
    newExpectation: salaryExpectation,
  };
}

// --- 年間人件費のインパクト計算 ---

export function calculateAnnualCost(offer: SalaryOffer): {
  annualCost: number;     // 万円
  monthlyCost: number;    // 万円
  signingCost: number;    // 一時金（万円）
} {
  // 社会保険料等で給与の約1.15倍
  const loadedSalary = offer.baseSalary * 1.15;
  return {
    annualCost: Math.round(loadedSalary),
    monthlyCost: Math.round(loadedSalary / 12),
    signingCost: offer.signingBonus,
  };
}

// --- バーンレートへの影響計算（ゲーム内通貨: ドル） ---

export function salaryToGameCurrency(annualSalaryJpy: number): number {
  // ゲーム内は年収万円 × 100 = ドル換算（概算）
  // 例: 800万円 → 年間80,000ドル → 月6,667ドル
  return Math.round(annualSalaryJpy * 100);
}

export function monthlyBurnImpact(annualSalaryJpy: number): number {
  return Math.round(salaryToGameCurrency(annualSalaryJpy) / 12);
}
