// ===== Candidate Generator =====
// 候補者をランク・能力値・特殊属性付きで生成する純粋関数群

import type {
  CandidateRank,
  CandidateAbility,
  AbilityKey,
  CandidateSpecialTrait,
  CandidateProfile,
  JobType,
  RecruitingChannel,
  InterviewStage,
} from './types';
import { ABILITY_KEYS } from './types';
import {
  RANK_ABILITY_RANGES,
  RANK_WEIGHTS,
  SPECIALIST_RATES,
  SPECIALIST_RANK_BOOST,
  HIDDEN_JOB_MATCH_RATES,
  ADJACENT_JOBS,
  INITIAL_INTEREST_RANGES,
  CANDIDATE_AVAILABLE_TURNS,
  SALARY_TABLE,
  TRAIT_GRANT_RATES,
  SPECIAL_TRAITS,
  CHANNEL_CONFIGS,
  S_RANK_RULES,
  COMPANY_INTEREST_FACTORS,
} from './constants';

// --- 乱数ユーティリティ ---

let _seed: number | null = null;

/** シード付き乱数を設定（デバッグ・リプレイ用） */
export function setRandomSeed(seed: number): void {
  _seed = seed;
}

/** シードをクリア（通常のMath.randomに戻す） */
export function clearRandomSeed(): void {
  _seed = null;
}

/** 乱数生成（シード対応） */
function random(): number {
  if (_seed !== null) {
    // Mulberry32 PRNG
    _seed |= 0;
    _seed = (_seed + 0x6d2b79f5) | 0;
    let t = Math.imul(_seed ^ (_seed >>> 15), 1 | _seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  return Math.random();
}

function randomInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number): number {
  return random() * (max - min) + min;
}

function weightedRandom<T extends string>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = random() * total;
  for (const [key, weight] of entries) {
    r -= weight;
    if (r <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickRandom<T>(arr: readonly T[]): T {
  return arr[Math.floor(random() * arr.length)];
}

// --- ランク生成 ---

function generateRank(channelDistribution?: Record<CandidateRank, number>): CandidateRank {
  const dist = channelDistribution ?? RANK_WEIGHTS;
  return weightedRandom(dist);
}

// --- 能力値生成 ---

function generateAbility(rank: CandidateRank, isSpecialist: boolean): {
  ability: CandidateAbility;
  specialistAbilities: AbilityKey[];
} {
  const range = RANK_ABILITY_RANGES[rank];
  const specialistAbilities: AbilityKey[] = [];

  // 全能力をランク範囲内でランダム生成
  const ability: CandidateAbility = {} as CandidateAbility;
  for (const key of ABILITY_KEYS) {
    ability[key] = randomInt(range.min, range.max);
  }

  // スペシャリスト処理: 1-2つの能力を上振れさせる
  if (isSpecialist) {
    const boostCount = randomInt(1, 2);
    const shuffled = shuffleArray([...ABILITY_KEYS]);
    const boostedKeys = shuffled.slice(0, boostCount);

    // 上振れ先のランクを算出
    const rankOrder: CandidateRank[] = ['D', 'C', 'B', 'A', 'S'];
    const currentIdx = rankOrder.indexOf(rank);
    const boostIdx = Math.min(currentIdx + SPECIALIST_RANK_BOOST, rankOrder.length - 1);
    const boostRange = RANK_ABILITY_RANGES[rankOrder[boostIdx]];

    for (const key of boostedKeys) {
      ability[key] = randomInt(boostRange.min, boostRange.max);
      specialistAbilities.push(key);
    }
  }

  return { ability, specialistAbilities };
}

// --- 推定能力値（ノイズ入り）を生成 ---

function generateEstimatedAbility(trueAbility: CandidateAbility, noiseRange: number): CandidateAbility {
  const estimated: CandidateAbility = {} as CandidateAbility;
  for (const key of ABILITY_KEYS) {
    const noise = randomInt(-noiseRange, noiseRange);
    estimated[key] = Math.max(0, Math.min(100, trueAbility[key] + noise));
  }
  return estimated;
}

// --- 隠し適職の決定 ---

function determineHiddenBestFitJob(currentJob: JobType): JobType {
  const roll = random();

  if (roll < HIDDEN_JOB_MATCH_RATES.same) {
    return currentJob;
  }

  if (roll < HIDDEN_JOB_MATCH_RATES.same + HIDDEN_JOB_MATCH_RATES.adjacent) {
    const adjacentJobs = ADJACENT_JOBS[currentJob];
    return pickRandom(adjacentJobs);
  }

  // 全く異なる職種
  const allJobs: JobType[] = ['engineer', 'sales', 'marketing', 'cs', 'product', 'design', 'hr', 'finance'];
  const adjacentJobs = ADJACENT_JOBS[currentJob];
  const differentJobs = allJobs.filter(j => j !== currentJob && !adjacentJobs.includes(j));
  return pickRandom(differentJobs);
}

// --- 特殊属性の付与 ---

function rollSpecialTrait(rank: CandidateRank): CandidateSpecialTrait | null {
  const grantRate = TRAIT_GRANT_RATES[rank];
  if (random() > grantRate) return null;

  const trait = pickRandom(SPECIAL_TRAITS);
  return trait.id;
}

// --- 給与期待値の生成 ---

function generateSalaryExpectation(rank: CandidateRank): { salary: number; flexibility: number } {
  const table = SALARY_TABLE[rank];
  const salary = randomInt(table.marketMin, table.marketMax);
  // 柔軟度: 低ランクほど柔軟、高ランクほど強気
  const flexMap: Record<CandidateRank, [number, number]> = {
    S: [10, 25],
    A: [15, 35],
    B: [20, 45],
    C: [30, 60],
    D: [40, 70],
  };
  const [fMin, fMax] = flexMap[rank];
  const flexibility = randomInt(fMin, fMax);

  return { salary, flexibility };
}

// --- 名前生成 ---

const FIRST_NAMES = [
  '太郎', '花子', '健一', '美咲', '大輝', '結衣', '翔太', '愛',
  '陸', '杏', '蓮', '葵', '悠真', 'さくら', '陽菜', '拓海',
  '智也', '真由', '直樹', '千尋', '一郎', '涼子', '和也', '恵',
  '隼人', '凛', '颯太', '桜', '遥', '光',
];

const LAST_NAMES = [
  '佐藤', '鈴木', '田中', '渡辺', '伊藤', '山本', '中村', '小林',
  '加藤', '吉田', '山田', '松本', '井上', '木村', '林', '清水',
  '森', '阿部', '高橋', '藤田', '石井', '前田', '西田', '岡田',
  '長谷川', '中島', '大野', '藤原', '近藤', '上田',
];

function generateCandidateName(): string {
  const first = pickRandom(FIRST_NAMES);
  const last = pickRandom(LAST_NAMES);
  return `${last} ${first}`;
}

// --- メイン: 候補者1名を生成 ---

let _nextCandidateId = 1;

export function resetCandidateIdCounter(startId: number = 1): void {
  _nextCandidateId = startId;
}

export function generateCandidate(
  channel: RecruitingChannel,
  preferredJobType?: JobType,
  channelRankOverride?: Record<CandidateRank, number>,
): CandidateProfile {
  const channelConfig = CHANNEL_CONFIGS[channel];
  const rankDist = channelRankOverride ?? channelConfig.rankDistribution;

  // ランク決定
  const rank = generateRank(rankDist);

  // 職種決定
  const allJobTypes: JobType[] = ['engineer', 'sales', 'marketing', 'cs', 'product', 'design', 'hr', 'finance'];
  const currentJobType = preferredJobType ?? pickRandom(allJobTypes);

  // スペシャリスト判定
  const isSpecialist = random() < SPECIALIST_RATES[rank];

  // 能力値生成
  const { ability, specialistAbilities } = generateAbility(rank, isSpecialist);

  // 推定能力値（初期ノイズ=25）
  const estimatedAbility = generateEstimatedAbility(ability, 25);

  // 隠し適職
  const hiddenBestFitJob = determineHiddenBestFitJob(currentJobType);

  // 特殊属性
  const specialTrait = rollSpecialTrait(rank);

  // 興味度
  const interestRange = INITIAL_INTEREST_RANGES[rank];
  let interestLevel = randomInt(interestRange.min, interestRange.max);

  // チャネル補正
  interestLevel += channelConfig.interestBonus;
  if (channelConfig.specialBonus && currentJobType === channelConfig.specialBonus.jobType) {
    interestLevel += channelConfig.specialBonus.bonusInterest;
  }
  interestLevel = Math.max(0, Math.min(100, interestLevel));

  // 給与
  const { salary, flexibility } = generateSalaryExpectation(rank);

  // 賞味期限
  const turnRange = CANDIDATE_AVAILABLE_TURNS[rank];
  const availableTurns = randomInt(turnRange.min, turnRange.max);

  // Sランクは他社競合中
  const isExclusive = rank === 'S' ? random() < 0.7 : random() < 0.2;

  const id = `cand_${_nextCandidateId++}`;

  return {
    id,
    name: generateCandidateName(),
    rank,
    currentJobType,
    hiddenBestFitJob,
    trueAbility: ability,
    revealedAbility: {},
    estimatedAbility,
    specialTrait,
    isSpecialist,
    specialistAbilities,
    interviewStage: 'discovered',
    interestLevel,
    salaryExpectation: salary,
    salaryFlexibility: flexibility,
    firstOfferRejected: false,
    availableTurns,
    isExclusive,
    sourceChannel: channel,
    traitHintRevealed: false,
    bestFitHintRevealed: false,
  };
}

// --- 複数候補者を生成 ---

export function generateCandidates(
  channel: RecruitingChannel,
  preferredJobType?: JobType,
  countOverride?: number,
): CandidateProfile[] {
  const config = CHANNEL_CONFIGS[channel];
  const count = countOverride ?? randomInt(config.candidateCount[0], config.candidateCount[1]);

  return Array.from({ length: count }, () =>
    generateCandidate(channel, preferredJobType)
  );
}

// --- 企業ステータスによる興味度ボーナス計算 ---

export function calculateCompanyInterestBonus(
  valuation: number,
  mrrGrowthRate: number,
  brandScore: number,
): number {
  let bonus = 0;

  // 評価額ボーナス
  for (const threshold of COMPANY_INTEREST_FACTORS.valuationBonusThresholds) {
    if (valuation >= threshold.valuation) {
      bonus += threshold.bonus;
      break;
    }
  }

  // 成長率ボーナス
  bonus += Math.floor(mrrGrowthRate * COMPANY_INTEREST_FACTORS.growthRateBonus);

  // ブランドボーナス
  bonus += Math.floor(brandScore * COMPANY_INTEREST_FACTORS.brandScoreBonus);

  return bonus;
}

// --- 能力開示処理 ---

export function revealAbilities(
  candidate: CandidateProfile,
  stage: InterviewStage,
  noiseRange: number,
  revealCount: number,
  specificAbility?: AbilityKey,
): Partial<CandidateAbility> {
  const revealed = { ...candidate.revealedAbility };
  const alreadyRevealed = new Set(Object.keys(revealed));

  // 特定の能力が指定された場合、それを優先開示
  if (specificAbility && !alreadyRevealed.has(specificAbility)) {
    const noise = randomInt(-noiseRange, noiseRange);
    revealed[specificAbility] = Math.max(0, Math.min(100,
      candidate.trueAbility[specificAbility] + noise
    ));
    alreadyRevealed.add(specificAbility);
  }

  // 残りをランダムに開示
  const unrevealed = ABILITY_KEYS.filter(k => !alreadyRevealed.has(k));
  const toReveal = shuffleArray(unrevealed).slice(0, Math.max(0, revealCount - alreadyRevealed.size));

  for (const key of toReveal) {
    const noise = randomInt(-noiseRange, noiseRange);
    revealed[key] = Math.max(0, Math.min(100,
      candidate.trueAbility[key] + noise
    ));
  }

  return revealed;
}

// --- オファー承諾判定 ---

export function evaluateOfferAcceptance(
  candidate: CandidateProfile,
  offer: { baseSalary: number; stockOptionPercent: number; signingBonus: number; benefits: string[] },
  companyInterestBonus: number,
): { accepted: boolean; reason: string } {
  const { rank, interestLevel, salaryExpectation, salaryFlexibility, firstOfferRejected } = candidate;
  const minInterest = {
    S: 85, A: 75, B: 60, C: 45, D: 30,
  }[rank];

  // Sランク初回拒否
  if (rank === 'S' && !firstOfferRejected) {
    return { accepted: false, reason: 'もう少し考えさせてください…（Sランク人材は初回オファーを必ず保留します）' };
  }

  // 興味度チェック
  const effectiveInterest = interestLevel + companyInterestBonus;
  if (effectiveInterest < minInterest) {
    return { accepted: false, reason: `興味度が不足しています（現在: ${effectiveInterest}, 必要: ${minInterest}）` };
  }

  // 給与チェック
  const minAcceptable = salaryExpectation * (1 - salaryFlexibility / 100);
  const totalCompensation = offer.baseSalary + offer.signingBonus * 0.3; // サインオンは30%換算

  if (totalCompensation < minAcceptable) {
    return { accepted: false, reason: `提示額が希望に届いていません（最低: ${Math.round(minAcceptable)}万円）` };
  }

  // 確率判定
  let acceptProb = 0.5;
  // 興味度ボーナス
  acceptProb += (effectiveInterest - 50) * 0.01;
  // 給与ボーナス
  const salaryRatio = totalCompensation / salaryExpectation;
  acceptProb += (salaryRatio - 1.0) * 0.5;
  // SO/福利厚生ボーナス
  acceptProb += offer.stockOptionPercent * 0.05;
  acceptProb += offer.benefits.length * 0.03;

  acceptProb = Math.max(0.05, Math.min(0.95, acceptProb));

  const accepted = random() < acceptProb;
  return {
    accepted,
    reason: accepted
      ? 'オファーを承諾しました！'
      : '他社のオファーと比較検討した結果、今回は辞退させていただきます。',
  };
}
