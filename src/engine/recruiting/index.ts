// ===== Recruiting System — Public API =====

// Types
export type {
  CandidateRank,
  JobType,
  CandidateAbility,
  AbilityKey,
  CandidateSpecialTrait,
  SpecialTraitInfo,
  CandidateProfile,
  InterviewStage,
  InterviewEvent,
  InterviewEventCondition,
  InterviewChoice,
  InterviewChoiceEffect,
  RecruitingChannel,
  ChannelConfig,
  SalaryOffer,
  BenefitType,
  SalaryNegotiation,
  NegotiationResponse,
  CandidatePool,
  InterviewResult,
  HiringRecord,
  TurnRecruitingReport,
} from './types';

export {
  ABILITY_KEYS,
  ABILITY_LABELS,
  INTERVIEW_STAGE_ORDER,
  INTERVIEW_STAGE_LABELS,
  BENEFIT_LABELS,
  BENEFIT_INTEREST_BONUS,
} from './types';

// Constants
export {
  RANK_ABILITY_RANGES,
  RANK_WEIGHTS,
  SPECIALIST_RATES,
  SPECIALIST_RANK_BOOST,
  HIDDEN_JOB_MATCH_RATES,
  ADJACENT_JOBS,
  HIDDEN_JOB_BONUS_RANGE,
  INITIAL_INTEREST_RANGES,
  MIN_INTEREST_FOR_OFFER,
  S_RANK_RULES,
  STAGE_REVEAL_CONFIG,
  SALARY_TABLE,
  NEGOTIATION_RULES,
  CANDIDATE_AVAILABLE_TURNS,
  REAPPLY_RULES,
  INTERVIEW_SLOTS,
  CHANNEL_CONFIGS,
  SNS_BRANDING_EFFECT,
  SPECIAL_TRAITS,
  TRAIT_GRANT_RATES,
  INTEREST_TO_ACCEPTANCE,
  TURN_INTEREST_DECAY,
  COMPANY_INTEREST_FACTORS,
  JOB_TYPE_TO_ROLES,
} from './constants';

// Candidate Generator
export {
  setRandomSeed,
  clearRandomSeed,
  resetCandidateIdCounter,
  generateCandidate,
  generateCandidates,
  calculateCompanyInterestBonus,
  revealAbilities,
  evaluateOfferAcceptance,
} from './candidateGenerator';

// Interview Events
export {
  interviewEvents,
  getEventsForStage,
  filterEvents,
} from './interviewEvents';

// Salary
export {
  getMarketSalaryRange,
  createNegotiation,
  evaluateOffer,
  calculateAnnualCost,
  salaryToGameCurrency,
  monthlyBurnImpact,
} from './salaryTable';

// Store
export { useRecruitingStore } from './recruitingStore';
export type { RecruitingState, RecruitingActions, RecruitingStore } from './recruitingStore';

// Bridge (既存GameEngine連携)
export {
  candidateRankToGrade,
  abilityToStats,
  jobTypeToRole,
  candidateToEmployee,
  applyHiringToGameState,
  applyChannelCost,
} from './bridge';
