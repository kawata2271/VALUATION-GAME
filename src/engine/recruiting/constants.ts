// ===== Recruiting System Balance Constants =====
// バランス調整はこのファイルを編集するだけでOK

import type {
  CandidateRank,
  CandidateSpecialTrait,
  SpecialTraitInfo,
  RecruitingChannel,
  ChannelConfig,
  JobType,
  BenefitType,
} from './types';

// --- ランク別能力値レンジ ---

export const RANK_ABILITY_RANGES: Record<CandidateRank, { min: number; max: number }> = {
  S: { min: 80, max: 100 },
  A: { min: 65, max: 90 },
  B: { min: 45, max: 75 },
  C: { min: 25, max: 55 },
  D: { min: 10, max: 40 },
};

// --- ランク別出現率 ---

export const RANK_WEIGHTS: Record<CandidateRank, number> = {
  S: 0.03,
  A: 0.10,
  B: 0.25,
  C: 0.35,
  D: 0.27,
};

// --- スペシャリスト率 ---

export const SPECIALIST_RATES: Record<CandidateRank, number> = {
  S: 0.00,
  A: 0.10,
  B: 0.20,
  C: 0.30,
  D: 0.25,
};

// スペシャリストの能力上振れ: 自身のランク + N段階分の上限
export const SPECIALIST_RANK_BOOST = 2;

// --- 隠し適職の確率 ---

export const HIDDEN_JOB_MATCH_RATES = {
  same: 0.70,       // 応募職と同じ
  adjacent: 0.20,   // 近隣職種
  different: 0.10,  // 全く異なる職種
};

// 近隣職種マッピング
export const ADJACENT_JOBS: Record<JobType, JobType[]> = {
  engineer: ['product', 'design'],
  sales: ['marketing', 'cs'],
  marketing: ['sales', 'product'],
  cs: ['sales', 'product'],
  product: ['engineer', 'design'],
  design: ['product', 'engineer'],
  hr: ['cs', 'marketing'],
  finance: ['hr', 'product'],
};

// 隠し適職ボーナス倍率
export const HIDDEN_JOB_BONUS_RANGE: [number, number] = [1.3, 1.5];

// --- 初期興味度（ランク別） ---

export const INITIAL_INTEREST_RANGES: Record<CandidateRank, { min: number; max: number }> = {
  S: { min: 15, max: 30 },
  A: { min: 25, max: 40 },
  B: { min: 40, max: 55 },
  C: { min: 50, max: 70 },
  D: { min: 60, max: 80 },
};

// --- オファー承諾に必要な最低興味度 ---

export const MIN_INTEREST_FOR_OFFER: Record<CandidateRank, number> = {
  S: 85,
  A: 75,
  B: 60,
  C: 45,
  D: 30,
};

// --- Sランク特殊ルール ---

export const S_RANK_RULES = {
  firstOfferAlwaysReject: true,       // 初回オファーは必ず拒否
  maxConcurrentCompetitors: 2,        // 他社面談数
  competitorEventRate: 0.40,          // 「他社オファー」イベント発生率
  highValuationThreshold: 10_000_000_000, // 100億円: この評価額以上で興味度+20
  highValuationInterestBonus: 20,
};

// --- 面談ステージ別・能力開示ルール ---

export interface StageRevealConfig {
  revealCount: number;       // 開示する能力数
  noiseRange: number;        // ±ノイズ幅
  canRevealTrait: boolean;   // 特殊属性開示可能か
  traitRevealRate: number;   // 特殊属性開示確率
  canRevealBestFit: boolean; // 隠し適職ヒント可能か
  bestFitHintRate: number;   // ヒント発生率
  canSkip: boolean;          // スキップ可能か
}

export const STAGE_REVEAL_CONFIG: Record<string, StageRevealConfig> = {
  discovered: {
    revealCount: 0,
    noiseRange: 25,
    canRevealTrait: false,
    traitRevealRate: 0,
    canRevealBestFit: false,
    bestFitHintRate: 0,
    canSkip: false,
  },
  casual_talk: {
    revealCount: 2,
    noiseRange: 20,
    canRevealTrait: false,
    traitRevealRate: 0,
    canRevealBestFit: false,
    bestFitHintRate: 0,
    canSkip: false,
  },
  first_interview: {
    revealCount: 4,
    noiseRange: 15,
    canRevealTrait: false,
    traitRevealRate: 0,
    canRevealBestFit: false,
    bestFitHintRate: 0,
    canSkip: false,
  },
  second_interview: {
    revealCount: 6,
    noiseRange: 8,
    canRevealTrait: false,
    traitRevealRate: 0,
    canRevealBestFit: false,
    bestFitHintRate: 0.15,
    canSkip: true, // Cランク以下はスキップ可
  },
  final_interview: {
    revealCount: 8,  // 全項目
    noiseRange: 3,
    canRevealTrait: true,
    traitRevealRate: 0.50,
    canRevealBestFit: true,
    bestFitHintRate: 0.60,
    canSkip: false,
  },
  offer: {
    revealCount: 8,  // 全項目確定
    noiseRange: 0,
    canRevealTrait: true,
    traitRevealRate: 1.0,
    canRevealBestFit: true,
    bestFitHintRate: 1.0,
    canSkip: false,
  },
};

// --- 給与テーブル（万円） ---

export const SALARY_TABLE: Record<CandidateRank, {
  marketMin: number;
  marketMax: number;
  minAcceptable: number;
  ideal: number;
}> = {
  S: { marketMin: 1200, marketMax: 1800, minAcceptable: 1000, ideal: 2000 },
  A: { marketMin: 800,  marketMax: 1200, minAcceptable: 700,  ideal: 1400 },
  B: { marketMin: 500,  marketMax: 800,  minAcceptable: 450,  ideal: 900 },
  C: { marketMin: 350,  marketMax: 550,  minAcceptable: 300,  ideal: 650 },
  D: { marketMin: 250,  marketMax: 400,  minAcceptable: 220,  ideal: 500 },
};

// --- 給与交渉ルール ---

export const NEGOTIATION_RULES = {
  maxRounds: 3,
  overMaxRoundsPenalty: -20,          // 興味度ペナルティ
  stockOptionEffectiveness: {         // ランク別SO効果
    S: 0.30,  // SO提示で年収ギャップの30%を埋められる
    A: 0.25,
    B: 0.20,
    C: 0.15,
    D: 0.10,
  } as Record<CandidateRank, number>,
  lowOfferPenalty: -30,               // 市場相場より大幅に低い場合の興味度ペナルティ
  lowOfferThreshold: 0.75,            // 市場相場の75%以下で発動
  signingBonusMaxEffect: 15,          // サインオンボーナスの最大興味度効果
};

// --- 候補者の賞味期限（ランク別・ターン数） ---

export const CANDIDATE_AVAILABLE_TURNS: Record<CandidateRank, { min: number; max: number }> = {
  S: { min: 2, max: 3 },
  A: { min: 3, max: 4 },
  B: { min: 4, max: 6 },
  C: { min: 5, max: 8 },
  D: { min: 6, max: 10 },
};

// --- 再応募ルール ---

export const REAPPLY_RULES = {
  turnsBeforeReapply: 5,
  reapplyInterestRange: { min: 20, max: 40 }, // リセット後の興味度
  reapplyRate: 0.30,
};

// --- 同時面談枠 ---

export const INTERVIEW_SLOTS = {
  base: 3,
  perHrEmployee: 2,  // HR1名につき+2枠
};

// --- 採用チャネル設定 ---

export const CHANNEL_CONFIGS: Record<RecruitingChannel, ChannelConfig> = {
  job_board: {
    id: 'job_board',
    name: '求人媒体',
    description: 'Wantedly / Green等の求人媒体に掲載',
    cost: 50,
    candidateCount: [3, 5],
    rankDistribution: { S: 0.02, A: 0.08, B: 0.20, C: 0.30, D: 0.40 },
    interestBonus: 0,
  },
  referral: {
    id: 'referral',
    name: '社員紹介',
    description: '既存メンバーのネットワークからの紹介',
    cost: 30,
    candidateCount: [1, 2],
    rankDistribution: { S: 0.05, A: 0.25, B: 0.35, C: 0.25, D: 0.10 },
    interestBonus: 15,
  },
  headhunter: {
    id: 'headhunter',
    name: 'ヘッドハンター',
    description: '採用エージェントに依頼。高ランク人材に強い',
    cost: 200,
    candidateCount: [1, 3],
    rankDistribution: { S: 0.15, A: 0.35, B: 0.30, C: 0.15, D: 0.05 },
    interestBonus: 10,
  },
  tech_event: {
    id: 'tech_event',
    name: 'テックイベント',
    description: 'カンファレンスやハッカソンで出会う',
    cost: 100,
    candidateCount: [2, 4],
    rankDistribution: { S: 0.10, A: 0.20, B: 0.30, C: 0.25, D: 0.15 },
    interestBonus: 5,
    specialBonus: { jobType: 'engineer', bonusInterest: 10 },
  },
  direct_scout: {
    id: 'direct_scout',
    name: 'ダイレクトスカウト',
    description: 'LinkedIn等で直接アプローチ',
    cost: 80,
    candidateCount: [1, 2],
    rankDistribution: { S: 0.08, A: 0.22, B: 0.35, C: 0.25, D: 0.10 },
    interestBonus: -15,
  },
  sns_branding: {
    id: 'sns_branding',
    name: 'SNS採用ブランディング',
    description: '技術ブログ・SNS発信で採用力UP（効果は次ターン以降）',
    cost: 150,
    candidateCount: [0, 0],  // 直接の候補者は出ない
    rankDistribution: { S: 0, A: 0, B: 0, C: 0, D: 0 },
    interestBonus: 10, // 全体への恒久バフ
  },
};

// --- SNSブランディングの効果 ---

export const SNS_BRANDING_EFFECT = {
  employerBrandBoost: 5,           // ブランドスコア+5/回
  allChannelRankBoostRate: 0.05,   // 全チャネルのランク分布を5%上方シフト
  maxStack: 5,                     // 最大5回までスタック
};

// --- 特殊属性の詳細 ---

export const SPECIAL_TRAITS: SpecialTraitInfo[] = [
  {
    id: 'mentor',
    name: 'メンター気質',
    description: '後輩の面倒見がよく、チーム全体の成長を促す',
    effect: 'チームメンバーの成長速度+20%',
  },
  {
    id: 'lone_wolf',
    name: '一匹狼',
    description: '独りで黙々と作業するのが得意だがチームワークは苦手',
    effect: '単独タスク200% / チームタスク80%',
  },
  {
    id: 'connector',
    name: 'コネクター',
    description: '部署を跨いだコミュニケーションが得意',
    effect: '部署間シナジー+15%',
  },
  {
    id: 'perfectionist',
    name: '完璧主義者',
    description: '品質には妥協しないが、スピードは犠牲になりがち',
    effect: '品質+30% / 速度-20%',
  },
  {
    id: 'serial_learner',
    name: '連続学習者',
    description: '常に新しいスキルを身につけ続ける',
    effect: '半年ごとに新スキル獲得',
  },
  {
    id: 'flight_risk',
    name: '転職志向',
    description: '能力は高いが、より良い条件があればすぐ転職を考える',
    effect: '離職率2倍',
  },
  {
    id: 'culture_builder',
    name: 'カルチャービルダー',
    description: 'チームの雰囲気を明るくし、文化を作る人',
    effect: 'チーム全体のモチベ+10%',
  },
  {
    id: 'dark_horse',
    name: 'ダークホース',
    description: '最初は目立たないが、入社後に急成長する',
    effect: '入社後3ターンで能力が急成長',
  },
  {
    id: 'negotiator',
    name: 'ネゴシエーター',
    description: '交渉ごとに天賦の才を持つ',
    effect: '営業/BizDev系タスクで1.5倍',
  },
  {
    id: 'burnout_prone',
    name: 'バーンアウト体質',
    description: '短期間で高いパフォーマンスを出すが、燃え尽きやすい',
    effect: '連続高負荷で能力が一時低下',
  },
];

// 特殊属性の付与率（ランク別）
export const TRAIT_GRANT_RATES: Record<CandidateRank, number> = {
  S: 0.80,
  A: 0.50,
  B: 0.30,
  C: 0.15,
  D: 0.10,
};

// --- 興味度からオファー承諾率へのマッピング ---

export const INTEREST_TO_ACCEPTANCE: Array<{ minInterest: number; maxInterest: number; acceptRate: number }> = [
  { minInterest: 80, maxInterest: 100, acceptRate: 0.90 },
  { minInterest: 60, maxInterest: 79,  acceptRate: 0.70 },
  { minInterest: 40, maxInterest: 59,  acceptRate: 0.50 },
  { minInterest: 20, maxInterest: 39,  acceptRate: 0.20 },
  { minInterest: 0,  maxInterest: 19,  acceptRate: 0.05 },
];

// --- ターン毎の自然減衰 ---

export const TURN_INTEREST_DECAY = {
  perTurnDecay: -3,            // 毎ターン興味度が自然減少
  waitingPenalty: -5,          // 面談が進まない場合の追加ペナルティ
  exclusiveCompetitorDelta: -8, // 他社競合中の場合のペナルティ
};

// --- 企業ステータスによる興味度ボーナス ---

export const COMPANY_INTEREST_FACTORS = {
  valuationBonusThresholds: [
    { valuation: 10_000_000_000, bonus: 20 },  // 100億円以上
    { valuation: 5_000_000_000,  bonus: 12 },  // 50億円以上
    { valuation: 1_000_000_000,  bonus: 5 },   // 10億円以上
  ],
  growthRateBonus: 0.1,           // MRR成長率1%につき興味度+0.1
  brandScoreBonus: 0.15,          // brandスコア1ポイントにつき興味度+0.15
};

// --- JobType → EmployeeRole マッピング ---

export const JOB_TYPE_TO_ROLES: Record<JobType, string[]> = {
  engineer: ['engineer_backend', 'engineer_frontend', 'engineer_sre', 'engineer_data'],
  sales: ['sales_sdr', 'sales_ae', 'sales_se'],
  marketing: ['marketing_content', 'marketing_growth', 'marketing_brand', 'marketing_event'],
  cs: ['cs_support', 'cs_csm', 'cs_onboarding'],
  product: ['pm'],
  design: ['engineer_frontend'],  // デザイナーロールがないのでフロントエンドで代替
  hr: ['coo'],                    // HRロールがないのでCOOで代替
  finance: ['cfo'],
};
