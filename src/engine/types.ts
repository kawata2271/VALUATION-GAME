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

// ===== Employee Grade & Stats System =====
export type EmployeeGrade = 'S' | 'A' | 'B' | 'C' | 'D';

export interface EmployeeStats {
  sales: number;       // 営業力 (0-100)
  tech: number;        // 技術力 (0-100)
  management: number;  // 管理力 (0-100)
  creativity: number;  // 創造力 (0-100)
  loyalty: number;     // 忠誠度 (0-100)
}

export interface SpecialAbilityDef {
  id: string;
  name: string;
  description: string;
  category: 'sales' | 'tech' | 'management' | 'creativity' | 'special';
  minGrade: EmployeeGrade;
}

export interface SalaryInfo {
  base: number;
  current: number;
  raiseHistory: Array<{
    month: number;
    before: number;
    after: number;
    type: 'approved' | 'negotiated' | 'rejected';
  }>;
}

export interface RaiseRequest {
  employeeId: string;
  employeeName: string;
  grade: EmployeeGrade;
  currentSalary: number;
  requestedSalary: number;
  raiseRate: number;
  contributionScore: number;
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  salary: number;           // 後方互換: SalaryInfo.currentと同期
  trait?: EmployeeTrait;
  hiredMonth: number;
  stockOptions: number;
  // Phase 2 extensions
  grade: EmployeeGrade;
  stats: EmployeeStats;
  specialAbility: SpecialAbilityDef | null;
  salaryInfo: SalaryInfo;
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
  techDebtCategories: TechDebtCategories;
  devAllocation: number;  // 0-1: 新機能開発の割合 (残りが負債返済)
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
  pendingRaises: RaiseRequest[] | null;

  // OKR/KPI
  quarters: Quarter[];
  objectives: Objective[];
  memberKPIs: MemberKPI[];
  currentQuarterId: string | null;
  pendingQuarterReview: boolean;
  pendingObjectiveSetting: boolean;

  // Phase 4: Pivot & Multi-business
  subBusinesses: SubBusiness[];
  pivotHistory: PivotRecord[];
  pendingPivot: PivotOption | null;
  mrrDeclineStreak: number;
  highChurnStreak: number;
}

// ===== Phase 4: Pivot & Multi-business =====

export type PivotType =
  | 'zoom_in' | 'zoom_out' | 'customer_segment' | 'channel'
  | 'revenue_model' | 'tech_architecture' | 'platform' | 'domain_change';

export type BusinessDomainId =
  | 'hrtech' | 'fintech' | 'edtech' | 'healthtech' | 'legaltech'
  | 'martech' | 'logitech' | 'foodtech' | 'proptech' | 'agritech'
  | 'insurtech' | 'retailtech' | 'securitytech' | 'ai_saas' | 'vertical_saas'
  | 'crm' | 'devtools' | 'spacetech' | 'web3' | 'cleantech';

export interface BusinessDomain {
  id: BusinessDomainId;
  nameJa: string;
  tam: number;
  growthRate: number;
  avgArpu: number;
  avgChurn: number;
  competitorCount: number;
  difficulty: number;
}

export interface PivotOption {
  type: PivotType;
  nameJa: string;
  description: string;
  targetDomain: BusinessDomainId;
  costRate: number;        // % of cash consumed
  teamLossRate: number;    // % of employees lost
  mrrRetainRate: number;   // % of MRR retained
  devMonths: number;       // turns needed
  techCarryOver: number;   // % of tech assets retained
  brandCarryOver: number;  // % of brand retained
}

export interface PivotRecord {
  month: number;
  fromDomain: string;
  toDomain: BusinessDomainId;
  type: PivotType;
}

export type SubBusinessPhase = 'research' | 'mvp' | 'pmf' | 'growth' | 'failed';

export interface SubBusiness {
  id: string;
  name: string;
  domain: BusinessDomainId;
  phase: SubBusinessPhase;
  phaseMonthsLeft: number;
  mrr: number;
  customers: number;
  arpu: number;
  churnRate: number;
  teamAllocated: number;  // number of employees assigned
  monthlyBudget: number;
  pmfScore: number;       // 0-100
  startedMonth: number;
  totalInvested: number;
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

export interface TechDebtCategories {
  infrastructure: number;
  codeQuality: number;
  security: number;
  scalability: number;
}

// ===== OKR / KPI System =====

export interface Quarter {
  id: string;              // "Y1Q1"
  year: number;
  quarter: 1 | 2 | 3 | 4;
  startMonth: number;
  endMonth: number;
  status: 'planning' | 'active' | 'review' | 'closed';
}

export interface Objective {
  id: string;
  memberId: string;
  quarterId: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  keyResults: KeyResult[];
  createdAt: number;
}

export interface KeyResult {
  id: string;
  objectiveId: string;
  title: string;
  metricType: 'number' | 'percentage' | 'currency' | 'boolean';
  targetValue: number;
  currentValue: number;
  unit: string;
  progress: number;        // 0-100
}

export interface MemberKPI {
  id: string;
  memberId: string;
  quarterId: string;
  kpiName: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  trackingHistory: KPISnapshot[];
}

export interface KPISnapshot {
  month: number;
  value: number;
  note: string;
}

export type ReviewGrade = 'S' | 'A' | 'B' | 'C' | 'D';

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

