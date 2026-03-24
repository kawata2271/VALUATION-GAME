// ===== Core Types for VALUATION GAME =====

export type VerticalId = 'crm' | 'hrtech' | 'fintech' | 'devtools' | 'healthtech' | 'edtech' | 'spacetech' | 'web3' | 'cleantech';
export type FounderType = 'engineer' | 'sales' | 'designer' | 'serial' | 'domain_expert' | 'student' | 'corporate';
export type TechStack = 'monolith' | 'microservices' | 'serverless' | 'nocode';
export type Phase = 0 | 1 | 2 | 3 | 4;
export type CustomerSegment = 'smb' | 'midmarket' | 'enterprise' | 'strategic';
export type ExitType = 'ipo' | 'mna' | 'continue' | 'bankrupt';

export interface VerticalData {
  id: VerticalId;
  name: string;
  nameJa: string;
  tam: number;
  maxCustomers: number;
  difficulty: number;
  baseChurn: number;
  baseCac: number;
  regulatoryRisk: number;
  enterpriseTendency: number;
  plgAffinity: number;
  description: string;
}

export interface FounderData {
  type: FounderType;
  name: string;
  nameJa: string;
  emoji: string;
  devSpeedBonus: number;
  qualityBonus: number;
  salesBonus: number;
  fundingBonus: number;
  description: string;
  specialAbility: string;
}

export interface Feature {
  id: string;
  name: string;
  category: 'core' | 'differentiation' | 'infrastructure' | 'experience';
  months: number;
  npsBonus: number;
  churnReduction: number;
  arpuBonus: number;
  description: string;
  verticals?: VerticalId[];
  requiresFeature?: string;
  enterpriseRequired?: boolean;
}

export interface FeatureInProgress {
  featureId: string;
  monthsRemaining: number;
  totalMonths: number;
}

export interface CompletedFeature {
  featureId: string;
  completedMonth: number;
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  salary: number;
  trait?: EmployeeTrait;
  hiredMonth: number;
  stockOptions: number;
}

export type EmployeeRole =
  | 'engineer_backend'
  | 'engineer_frontend'
  | 'engineer_sre'
  | 'engineer_data'
  | 'sales_sdr'
  | 'sales_ae'
  | 'sales_se'
  | 'cs_support'
  | 'cs_csm'
  | 'cs_onboarding'
  | 'marketing_content'
  | 'marketing_growth'
  | 'marketing_brand'
  | 'marketing_event'
  | 'pm'
  | 'cto'
  | 'cfo'
  | 'coo'
  | 'vp_sales';

export type EmployeeTrait =
  | '10x_engineer'
  | 'closer'
  | 'mood_maker'
  | 'mentor'
  | 'problem_solver'
  | 'toxic_genius'
  | 'job_hopper'
  | 'underperformer'
  | 'politician'
  | 'burnout_risk'
  | null;

export interface FundingRound {
  type: 'preseed' | 'seed' | 'seriesA' | 'seriesB' | 'seriesC';
  amount: number;
  valuation: number;
  dilution: number;
  month: number;
  investorName: string;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  category: 'market' | 'competitor' | 'internal' | 'product' | 'customer' | 'external';
  severity: 'positive' | 'neutral' | 'negative' | 'critical';
  choices?: EventChoice[];
  autoEffect?: EventEffect;
  conditions?: EventCondition;
}

export interface EventChoice {
  label: string;
  description: string;
  effect: EventEffect;
}

export interface EventEffect {
  cash?: number;
  mrrMultiplier?: number;
  churnDelta?: number;
  npsDelta?: number;
  moraleDelta?: number;
  techDebtDelta?: number;
  brandDelta?: number;
  cacMultiplier?: number;
  customersDelta?: number;
  message?: string;
}

export interface EventCondition {
  minMonth?: number;
  maxMonth?: number;
  minMrr?: number;
  maxMrr?: number;
  minCustomers?: number;
  minTeamSize?: number;
  verticals?: VerticalId[];
  phase?: Phase[];
  requiresFeature?: string;
  probability?: number;
}

export interface MonthlySnapshot {
  month: number;
  mrr: number;
  arr: number;
  customers: number;
  cash: number;
  burn: number;
  nps: number;
  morale: number;
  techDebt: number;
  brand: number;
  valuation: number;
  founderEquity: number;
  teamSize: number;
  churnRate: number;
  cac: number;
  arpu: number;
  ltv: number;
  ndr: number;
}

export interface GameState {
  // Meta
  companyName: string;
  vertical: VerticalId;
  founderType: FounderType;
  techStack: TechStack;
  month: number;
  phase: Phase;
  gameOver: boolean;
  exitType: ExitType | null;
  finalScore: number;

  // Finance
  cash: number;
  mrr: number;
  burn: number;
  arpu: number;

  // Customers
  customers: number;
  customersSmb: number;
  customersMidmarket: number;
  customersEnterprise: number;
  customersStrategic: number;
  churnRate: number;
  cac: number;
  ndr: number;

  // Product
  nps: number;
  techDebt: number;
  productSpeed: number;
  featuresInProgress: FeatureInProgress[];
  completedFeatures: CompletedFeature[];

  // Team
  employees: Employee[];
  morale: number;
  nextEmployeeId: number;

  // Brand & Market
  brand: number;
  competitorPressure: number;
  economyCycle: number;

  // Funding
  fundingRounds: FundingRound[];
  founderEquity: number;
  valuation: number;
  optionPool: number;

  // History
  history: MonthlySnapshot[];
  eventLog: { month: number; title: string; effect: string }[];

  // Pending
  pendingEvent: (GameEvent & { instanceId: string }) | null;
  pmfAchieved: boolean;
  profitableMonth: boolean;
  highNpsStreak: number;
  highMoraleStreak: number;
  pivotCount: number;
  layoffDone: boolean;
  securityBreachIgnored: boolean;
  downRound: boolean;

  // Phase 2
  gameMode: GameMode;
  scenarioId: string | null;
  cofounder: CofounderType;
  cofounderTroubleCount: number;
  investors: InvestorCharacter[];
  pricingTiers: PricingTier[];
  founderSkills: FounderSkills;
  orgWallsResolved: OrgWallType[];
  boardMeetingDue: boolean;
  achievements: string[];  // unlocked achievement IDs

  // Phase 3
  globalRegions: GlobalRegion[];
  acquisitions: Acquisition[];
  multiProductCount: number;
  rivals: RivalCompany[];
  newsFeed: string[];
}

export interface RoleInfo {
  role: EmployeeRole;
  nameJa: string;
  category: string;
  baseSalary: number;
  unlockCondition?: string;
}

export type Grade = 'SSS' | 'SS' | 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

// ===== Phase 2 Types =====

export type CofounderType = 'tech' | 'business' | 'domain' | null;

export interface CofounderData {
  type: 'tech' | 'business' | 'domain';
  nameJa: string;
  emoji: string;
  description: string;
  effect: string;
}

export interface TechStackData {
  id: TechStack;
  nameJa: string;
  description: string;
  devSpeedEarly: number;   // multiplier months 1-18
  devSpeedLate: number;    // multiplier months 19+
  techDebtRate: number;    // multiplier on tech debt accumulation
  infraCostExtra: number;  // monthly extra cost
  scalingLimit: number;    // customer count where perf issues start (0=no limit)
  migrationCost: number;   // cost to migrate away
  migrationMonths: number; // months to migrate
}

export interface InvestorCharacter {
  id: string;
  name: string;
  archetype: 'visionary' | 'metrics' | 'operator' | 'strategic' | 'angel';
  emoji: string;
  description: string;
  satisfaction: number;   // 0-100
  boardSeat: boolean;
}

export interface PricingTier {
  name: string;
  price: number;
  enabled: boolean;
}

export interface FounderSkills {
  leadership: number;
  fundraising: number;
  product: number;
  sales: number;
  crisis: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (state: GameState) => boolean;
  unlocked?: boolean;
  unlockedMonth?: number;
}

export type OrgWallType = 'wall_5' | 'wall_15' | 'wall_30' | 'wall_50' | 'wall_100';

export interface RivalCompany {
  name: string;
  vertical: VerticalId;
  mrr: number;
  customers: number;
  funding: number;
  founded: number;
  aggression: number;
  status: 'active' | 'acquired' | 'dead';
}

// ===== Phase 3 Types =====

export type GameMode = 'normal' | 'hard' | 'sandbox';

export interface GameScenario {
  id: string;
  nameJa: string;
  description: string;
  icon: string;
  difficulty: number;
  initialOverrides: Partial<GameState>;
  verticalLock?: VerticalId;
  founderLock?: FounderType;
  techStackLock?: TechStack;
  specialRules?: string[];
  victoryCondition?: string;
}

export interface Acquisition {
  id: string;
  targetName: string;
  cost: number;
  monthlyRevenue: number;
  teamSize: number;
  techDebtAdded: number;
  synergy: string;
}

export interface GlobalRegion {
  id: string;
  nameJa: string;
  marketMultiplier: number;
  cacMultiplier: number;
  regulatoryBarrier: number;
  setupCost: number;
  setupMonths: number;
  unlocked: boolean;
  expanding: boolean;
  expandingMonthsLeft: number;
}

