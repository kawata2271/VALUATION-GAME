// ===== Recruiting System Types =====

// --- Candidate Rank & Job Types ---

export type CandidateRank = 'S' | 'A' | 'B' | 'C' | 'D';

export type JobType =
  | 'engineer'
  | 'sales'
  | 'marketing'
  | 'cs'
  | 'product'
  | 'design'
  | 'hr'
  | 'finance';

// --- Candidate Ability ---

export interface CandidateAbility {
  coding: number;           // 0-100
  communication: number;    // 0-100
  leadership: number;       // 0-100
  analytics: number;        // 0-100
  creativity: number;       // 0-100
  domainKnowledge: number;  // 0-100
  stamina: number;          // 0-100 離職耐性・メンタル耐性
  growth: number;           // 0-100 成長ポテンシャル
}

export type AbilityKey = keyof CandidateAbility;

export const ABILITY_KEYS: AbilityKey[] = [
  'coding',
  'communication',
  'leadership',
  'analytics',
  'creativity',
  'domainKnowledge',
  'stamina',
  'growth',
];

export const ABILITY_LABELS: Record<AbilityKey, string> = {
  coding: 'コーディング',
  communication: 'コミュニケーション',
  leadership: 'リーダーシップ',
  analytics: '分析力',
  creativity: '創造力',
  domainKnowledge: '業界知識',
  stamina: 'スタミナ',
  growth: '成長性',
};

// --- Special Traits ---

export type CandidateSpecialTrait =
  | 'mentor'          // チームメンバーの成長速度+20%
  | 'lone_wolf'       // 単独時200%だがチーム時80%
  | 'connector'       // 部署間シナジー+15%
  | 'perfectionist'   // 品質+30%だが速度-20%
  | 'serial_learner'  // 半年ごとに新スキル獲得
  | 'flight_risk'     // 能力は高いが離職率2倍
  | 'culture_builder' // チーム全体のモチベ+10%
  | 'dark_horse'      // 入社後3ターンで能力が急成長
  | 'negotiator'      // 営業/BizDev系タスクで1.5倍
  | 'burnout_prone';  // 連続高負荷で能力が一時低下

export interface SpecialTraitInfo {
  id: CandidateSpecialTrait;
  name: string;
  description: string;
  effect: string;
}

// --- Interview Stages ---

export type InterviewStage =
  | 'discovered'       // 候補者を発見
  | 'casual_talk'      // カジュアル面談
  | 'first_interview'  // 一次面接
  | 'second_interview' // 二次面接
  | 'final_interview'  // 最終面接
  | 'offer'            // オファー提示
  | 'offer_accepted'   // 内定承諾
  | 'offer_rejected'   // 辞退
  | 'withdrawn';       // 候補者離脱

export const INTERVIEW_STAGE_ORDER: InterviewStage[] = [
  'discovered',
  'casual_talk',
  'first_interview',
  'second_interview',
  'final_interview',
  'offer',
];

export const INTERVIEW_STAGE_LABELS: Record<InterviewStage, string> = {
  discovered: '発見',
  casual_talk: 'カジュアル面談',
  first_interview: '一次面接',
  second_interview: '二次面接',
  final_interview: '最終面接',
  offer: 'オファー',
  offer_accepted: '内定承諾',
  offer_rejected: '辞退',
  withdrawn: '離脱',
};

// --- Candidate Profile ---

export interface CandidateProfile {
  id: string;
  name: string;
  rank: CandidateRank;
  currentJobType: JobType;
  hiddenBestFitJob: JobType;

  // 能力値
  trueAbility: CandidateAbility;
  revealedAbility: Partial<CandidateAbility>;
  estimatedAbility: CandidateAbility;

  // 特殊属性
  specialTrait: CandidateSpecialTrait | null;
  isSpecialist: boolean;
  specialistAbilities: AbilityKey[];  // スペシャリストの突出能力

  // 採用プロセス状態
  interviewStage: InterviewStage;
  interestLevel: number;        // 0-100
  salaryExpectation: number;    // 万円
  salaryFlexibility: number;    // 0-100
  firstOfferRejected: boolean;  // Sランク: 初回拒否フラグ

  // メタ情報
  availableTurns: number;
  isExclusive: boolean;         // 他社と競合中か
  sourceChannel: RecruitingChannel;

  // 面談で開示された特殊属性ヒント
  traitHintRevealed: boolean;
  bestFitHintRevealed: boolean;
}

// --- Recruiting Channels ---

export type RecruitingChannel =
  | 'job_board'       // 求人媒体
  | 'referral'        // 社員紹介
  | 'headhunter'      // ヘッドハンター
  | 'tech_event'      // テックイベント
  | 'direct_scout'    // ダイレクトスカウト
  | 'sns_branding';   // SNS採用ブランディング

export interface ChannelConfig {
  id: RecruitingChannel;
  name: string;
  description: string;
  cost: number;                // 万円
  candidateCount: [number, number]; // [min, max]
  rankDistribution: Record<CandidateRank, number>; // 確率 (0-1 合計1.0)
  interestBonus: number;       // 初期興味度補正
  specialBonus?: {
    jobType?: JobType;
    bonusInterest: number;
  };
}

// --- Interview Events ---

export interface InterviewEvent {
  id: string;
  stage: InterviewStage;
  title: string;
  description: string;
  choices: InterviewChoice[];
  triggerCondition?: InterviewEventCondition;
}

export interface InterviewEventCondition {
  minRank?: CandidateRank;
  maxRank?: CandidateRank;
  jobTypes?: JobType[];
  minInterest?: number;
  maxInterest?: number;
  hasSpecialTrait?: boolean;
  isSpecialist?: boolean;
}

export interface InterviewChoice {
  label: string;
  description: string;
  effects: InterviewChoiceEffect;
}

export interface InterviewChoiceEffect {
  interestDelta: number;
  revealAbility?: AbilityKey;
  revealTrait?: boolean;
  revealBestFit?: boolean;
  salaryExpectationDelta?: number;   // 万円
  companyReputationDelta?: number;
  bonusRevealCount?: number;         // 追加で開示する能力数
  message: string;
}

// --- Salary Negotiation ---

export interface SalaryOffer {
  baseSalary: number;          // 万円
  stockOptionPercent: number;  // %
  signingBonus: number;        // 万円
  benefits: BenefitType[];
}

export type BenefitType =
  | 'remote_work'
  | 'learning_budget'
  | 'housing_allowance'
  | 'health_premium'
  | 'flexible_hours'
  | 'sabbatical';

export const BENEFIT_LABELS: Record<BenefitType, string> = {
  remote_work: 'リモートワーク制度',
  learning_budget: '学習支援制度（年30万円）',
  housing_allowance: '住宅手当',
  health_premium: 'プレミアム健康保険',
  flexible_hours: 'フルフレックス',
  sabbatical: 'サバティカル休暇',
};

export const BENEFIT_INTEREST_BONUS: Record<BenefitType, number> = {
  remote_work: 5,
  learning_budget: 3,
  housing_allowance: 4,
  health_premium: 2,
  flexible_hours: 3,
  sabbatical: 2,
};

export interface SalaryNegotiation {
  candidateId: string;
  round: number;               // 現在のラウンド (1-3)
  maxRounds: number;
  candidateExpectation: number; // 万円
  offers: SalaryOffer[];       // 過去の提示
  candidateResponses: NegotiationResponse[];
  status: 'ongoing' | 'accepted' | 'rejected' | 'timeout';
}

export type NegotiationResponse =
  | 'accept'
  | 'counter'    // カウンターオファー要求
  | 'reject'
  | 'thinking';  // 検討中

// --- Candidate Pool ---

export interface CandidatePool {
  activeCandidates: CandidateProfile[];     // 面談進行中
  availableCandidates: CandidateProfile[];  // 発見済み・未アプローチ
  archivedCandidates: CandidateProfile[];   // 過去の辞退/不採用
  maxActiveInterviews: number;              // 同時面談可能数
}

// --- Results & Reports ---

export interface InterviewResult {
  candidateId: string;
  stage: InterviewStage;
  eventId: string;
  choiceIndex: number;
  effects: InterviewChoiceEffect;
}

export interface HiringRecord {
  candidateId: string;
  name: string;
  rank: CandidateRank;
  jobType: JobType;
  finalSalary: number;
  stockOption: number;
  signingBonus: number;
  hiredMonth: number;
  interviewRounds: number;
  channel: RecruitingChannel;
}

export interface TurnRecruitingReport {
  candidatesLost: CandidateProfile[];   // タイムアウトで離脱
  interestChanges: Array<{
    candidateId: string;
    delta: number;
    reason: string;
  }>;
  newApplications: CandidateProfile[];  // 自然応募
}
