import {
  GameState, VerticalId, FounderType, Phase, ExitType, Grade,
  EmployeeRole, Employee, FeatureInProgress, EventEffect,
  MonthlySnapshot, GameEvent, CofounderType, TechStack,
  InvestorCharacter, PricingTier, FounderSkills,
  GameMode, GameScenario, GlobalRegion, Acquisition,
} from './types';
import { verticals } from './data/verticals';
import { founders } from './data/founders';
import { features, getAvailableFeatures } from './data/features';
import { events } from './data/events';
import { phase2Events } from './data/events-phase2';
import { roles, generateName } from './data/roles';
import { techStacks } from './data/techstacks';
import { generateInvestor } from './data/investors';
import { checkAchievements } from './data/achievements';
import { defaultRegions } from './data/regions';
import { generateEmployee, generateCandidates, migrateEmployee } from './employeeGenerator';
import { RAISE_INTERVAL, LOYALTY_RESIGN_THRESHOLD, LOYALTY_CHANGES, RAISE_BASE_RATES } from './data/employeeBalance';
import { scenarios } from './data/scenarios';
import { generateRivals, simulateRivals } from './data/rivals';
import { generateNewsFeed } from './data/newsfeed';

// ===== Initial State =====

export function createInitialState(
  companyName: string,
  vertical: VerticalId,
  founderType: FounderType,
  techStack: TechStack = 'monolith',
  cofounder: CofounderType = null,
  gameMode: GameMode = 'normal',
  scenarioId: string | null = null,
): GameState {
  const f = founders[founderType];
  let initialCash = founderType === 'serial' ? 200000 :
                    founderType === 'student' ? 30000 : 80000;

  // Game mode adjustments
  if (gameMode === 'hard') initialCash = Math.floor(initialCash * 0.5);
  if (gameMode === 'sandbox') initialCash = 10_000_000;
  const baseNps = 30 + (founderType === 'designer' ? 15 : 0);
  let startEquity = 100;
  let startMorale = 70;
  let startBrand = 10;
  let startCustomers = 0;

  // Founder-specific overrides
  if (founderType === 'domain_expert') startCustomers = 5;
  if (founderType === 'corporate') startBrand = 30;

  // Cofounder effects
  if (cofounder) {
    startEquity = 70; // 70/30 split
    startMorale = 80; // cofounder morale bonus
  }

  const state: GameState = {
    companyName,
    vertical,
    founderType,
    techStack,
    month: 0,
    phase: 0,
    gameOver: false,
    exitType: null,
    finalScore: 0,

    gameMode,
    scenarioId,

    cash: initialCash,
    mrr: 0,
    burn: 0,
    arpu: 0,

    customers: startCustomers,
    customersSmb: startCustomers,
    customersMidmarket: 0,
    customersEnterprise: 0,
    customersStrategic: 0,
    churnRate: verticals[vertical].baseChurn,
    cac: verticals[vertical].baseCac,
    ndr: 100,

    nps: baseNps,
    techDebt: 0,
    productSpeed: 1 + f.devSpeedBonus,
    featuresInProgress: [],
    completedFeatures: [],

    employees: [],
    morale: startMorale,
    nextEmployeeId: 1,

    brand: startBrand,
    competitorPressure: verticals[vertical].difficulty * 10,
    economyCycle: 0,

    fundingRounds: [],
    founderEquity: startEquity,
    valuation: founderType === 'serial' ? 2000000 : 1000000,
    optionPool: 15,

    history: [],
    eventLog: [],

    pendingEvent: null,
    pmfAchieved: false,
    profitableMonth: false,
    highNpsStreak: 0,
    highMoraleStreak: 0,
    pivotCount: 0,
    layoffDone: false,
    securityBreachIgnored: false,
    downRound: false,

    // Phase 2
    cofounder,
    cofounderTroubleCount: 0,
    investors: [],
    pricingTiers: [
      { name: 'Starter', price: 0, enabled: true },
      { name: 'Pro', price: 0, enabled: false },
      { name: 'Enterprise', price: 0, enabled: false },
    ],
    founderSkills: { leadership: 0, fundraising: 0, product: 0, sales: 0, crisis: 0 },
    orgWallsResolved: [],
    boardMeetingDue: false,
    achievements: [],

    // Phase 3
    globalRegions: defaultRegions.map(r => ({ ...r })),
    acquisitions: [],
    multiProductCount: 0,
    rivals: generateRivals(vertical),
    newsFeed: [],
    pendingRaises: null,
  };

  // Apply scenario overrides
  if (scenarioId) {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (scenario?.initialOverrides) {
      Object.assign(state, scenario.initialOverrides);
    }
  }

  return state;
}

// ===== Helper Counts =====

function countRole(state: GameState, prefix: string): number {
  return state.employees.filter(e => e.role.startsWith(prefix)).length;
}

function getEngineerCount(state: GameState): number {
  return countRole(state, 'engineer_');
}

function getSalesCount(state: GameState): number {
  return countRole(state, 'sales_');
}

function getCsCount(state: GameState): number {
  return countRole(state, 'cs_');
}

function getMarketingCount(state: GameState): number {
  return countRole(state, 'marketing_');
}

function hasCTO(state: GameState): boolean {
  return state.employees.some(e => e.role === 'cto');
}

function hasCFO(state: GameState): boolean {
  return state.employees.some(e => e.role === 'cfo');
}

function hasPM(state: GameState): boolean {
  return state.employees.some(e => e.role === 'pm');
}

// ===== Engineer Efficiency (Brooks's Law) =====

function engineerEfficiency(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1.0;
  if (count === 2) return 1.6;
  if (count <= 3) return 2.0;
  if (count <= 5) return 2.5;
  return 3.0;
}

// ===== Phase Determination =====

function determinePhase(state: GameState): Phase {
  if (state.month === 0) return 0;
  const arr = state.mrr * 12;
  if (arr >= 10_000_000 || state.month >= 48) return state.month >= 48 ? 4 : 3;
  if (state.mrr >= 200_000 || state.month >= 37) return 3;
  if (state.mrr >= 5000 || state.month >= 13) return 2;
  return 1;
}

// ===== Advance Turn =====

export function advanceTurn(state: GameState): GameState {
  const s = { ...state };
  s.month += 1;

  // --- Phase ---
  s.phase = determinePhase(s);

  // --- Economy cycle ---
  s.economyCycle = Math.sin((s.month * 2 * Math.PI) / 36) * 0.15 + (Math.random() - 0.5) * 0.05;

  // --- Product development ---
  const founderCanDev = s.founderType === 'engineer' && s.month <= 6;
  const cofounderTechBonus = s.cofounder === 'tech' ? 1 : 0;
  const engCount = getEngineerCount(s) + (founderCanDev ? 1 : 0) + cofounderTechBonus;
  const efficiency = engineerEfficiency(engCount);

  const techDebtPenalty =
    s.techDebt >= 80 ? 2.0 :
    s.techDebt >= 60 ? 1.5 :
    s.techDebt >= 40 ? 1.25 : 1.0;

  // Tech stack speed modifier
  const ts = techStacks[s.techStack];
  const techStackSpeed = s.month <= 18 ? ts.devSpeedEarly : ts.devSpeedLate;

  // Scaling limit warning
  if (ts.scalingLimit > 0 && s.customers > ts.scalingLimit) {
    const overload = (s.customers - ts.scalingLimit) / ts.scalingLimit;
    if (overload > 0.5 && !s.eventLog.some(l => l.title === 'スケーリング問題')) {
      s.eventLog = [...s.eventLog, { month: s.month, title: 'スケーリング問題', effect: `${ts.nameJa}の限界に到達。パフォーマンス低下` }];
      s.nps = Math.max(0, s.nps - 5);
    }
  }

  s.featuresInProgress = s.featuresInProgress.map(f => {
    const progress = (efficiency / techDebtPenalty) * s.productSpeed * techStackSpeed;
    return { ...f, monthsRemaining: Math.max(0, f.monthsRemaining - progress) };
  });

  const completed = s.featuresInProgress.filter(f => f.monthsRemaining <= 0);
  s.featuresInProgress = s.featuresInProgress.filter(f => f.monthsRemaining > 0);

  for (const c of completed) {
    const feat = features.find(f => f.id === c.featureId);
    if (!feat) continue;
    s.completedFeatures = [...s.completedFeatures, { featureId: c.featureId, completedMonth: s.month }];
    s.nps = Math.min(100, s.nps + feat.npsBonus);
    s.churnRate = Math.max(0.3, s.churnRate - feat.churnReduction);
    s.arpu += feat.arpuBonus;
    s.eventLog = [...s.eventLog, { month: s.month, title: `${feat.name} リリース`, effect: `NPS+${feat.npsBonus}` }];
  }

  // --- Tech debt ---
  const featuresShippedThisMonth = completed.length;
  let tdDelta = featuresShippedThisMonth * 3;
  tdDelta += engCount < 3 && engCount > 0 ? 1 : 0;
  tdDelta -= hasCTO(s) ? 3 : 0;
  tdDelta += (Math.random() - 0.5) * 2;
  if (s.founderType === 'engineer') tdDelta *= 0.7;
  if (s.cofounder === 'tech') tdDelta *= 0.8;
  if (s.founderType === 'sales') tdDelta *= 1.3;
  tdDelta *= ts.techDebtRate; // tech stack modifier
  if (s.employees.some(e => e.specialAbility?.id === 'debugger')) tdDelta *= 0.7; // debugger ability
  s.techDebt = Math.max(0, Math.min(100, s.techDebt + tdDelta));

  // --- PMF Check ---
  const coreCount = s.completedFeatures.filter(cf => {
    const feat = features.find(f => f.id === cf.featureId);
    return feat?.category === 'core';
  }).length;
  if (coreCount >= 2 && s.customers >= 10 && s.mrr >= 5000) {
    if (!s.pmfAchieved) {
      s.pmfAchieved = true;
      s.eventLog = [...s.eventLog, { month: s.month, title: 'PMF達成！', effect: 'Product-Market Fit を発見' }];
    }
  }

  // --- Customer acquisition ---
  const v = verticals[s.vertical];
  const cofounderSalesBonus = s.cofounder === 'business' ? 0.3 : 0;
  const founderSalesBonus = 1 + founders[s.founderType].salesBonus + cofounderSalesBonus;

  // Need at least 1 core feature to get any customers
  const hasProduct = s.completedFeatures.length > 0;

  const salesForce = getSalesCount(s) * 3 + getMarketingCount(s) * 2;
  const plgBonus = v.plgAffinity * (s.brand / 100) * 8;
  // Base leads: founder hustle(5) + sales team + PLG + marketing
  // Low-ARPU verticals get more volume
  const volumeMultiplier = s.arpu <= 50 ? 2.5 : s.arpu <= 100 ? 1.5 : 1.0;
  const baseLeads = (5 + salesForce + plgBonus) * founderSalesBonus * volumeMultiplier;
  const economyFactor = 1 + s.economyCycle;
  // Pre-PMF: some customers trickle in if you have a product
  // Post-PMF: conversion jumps significantly
  const conversionRate = s.pmfAchieved ? 0.5 : (hasProduct ? 0.25 : 0.03);
  const competitorDrag = Math.max(0.4, 1 - s.competitorPressure / 300);
  const rawCustomers = baseLeads * conversionRate * economyFactor * competitorDrag;
  // Probabilistic rounding: 0.7 = 70% chance of 1
  let newCustomers = Math.floor(rawCustomers) + (Math.random() < (rawCustomers % 1) ? 1 : 0);
  newCustomers = Math.max(0, newCustomers);

  // --- Global regions ---
  let globalBonus = 0;
  s.globalRegions = s.globalRegions.map(r => {
    if (r.expanding && r.expandingMonthsLeft > 0) {
      const updated = { ...r, expandingMonthsLeft: r.expandingMonthsLeft - 1 };
      if (updated.expandingMonthsLeft <= 0) {
        updated.unlocked = true;
        updated.expanding = false;
        s.eventLog = [...s.eventLog, { month: s.month, title: `${r.nameJa}展開完了`, effect: '新市場への展開が完了！' }];
      }
      return updated;
    }
    if (r.unlocked && r.id !== 'north_america') {
      globalBonus += r.marketMultiplier;
    }
    return r;
  });
  newCustomers += Math.floor(newCustomers * globalBonus);

  // --- Hard mode adjustments ---
  if (s.gameMode === 'hard') {
    newCustomers = Math.floor(newCustomers * 0.7);
  }

  // Set base ARPU based on vertical
  if (s.arpu === 0) {
    const arpuByVertical: Record<string, number> = {
      crm: 150, hrtech: 120, fintech: 300,
      devtools: 50, healthtech: 500, edtech: 30,
      spacetech: 2000, web3: 80, cleantech: 400,
    };
    s.arpu = arpuByVertical[s.vertical] || 100;
  }

  // --- Churn ---
  const csEffect = Math.min(0.5, getCsCount(s) * 0.1);
  const designerChurnBonus = s.founderType === 'designer' ? 0.5 : 0;
  const effectiveChurn = Math.max(0.3, s.churnRate - csEffect - designerChurnBonus) / 100;
  const churnedCustomers = Math.floor(s.customers * effectiveChurn);

  s.customers = Math.max(0, s.customers + newCustomers - churnedCustomers);
  s.customersSmb = Math.floor(s.customers * 0.6);
  s.customersMidmarket = Math.floor(s.customers * 0.25);
  s.customersEnterprise = Math.floor(s.customers * 0.12);
  s.customersStrategic = s.customers - s.customersSmb - s.customersMidmarket - s.customersEnterprise;

  // --- Revenue ---
  s.mrr = s.customers * s.arpu;
  const expansionRate = s.pmfAchieved ? 0.03 : 0.01;
  const expansion = s.mrr * expansionRate;
  s.mrr += expansion;
  s.ndr = s.customers > 0 ? ((s.mrr + expansion) / (s.mrr)) * 100 : 100;

  // --- CAC ---
  const salesEfficiency = getSalesCount(s) > 0 ? 0.9 : 1.0;
  const brandDiscount = 1 - (s.brand / 300);
  const domainExpertDiscount = s.cofounder === 'domain' ? 0.8 : 1.0;
  s.cac = v.baseCac * salesEfficiency * brandDiscount * domainExpertDiscount * (1 + s.competitorPressure / 100) * (1 / economyFactor);

  // --- Burn rate (individual salaries) ---
  let totalSalaries = s.employees.reduce((sum, e) => sum + (e.salaryInfo?.current ?? e.salary), 0);
  // Optimizer ability: -5% total salary
  if (s.employees.some(e => e.specialAbility?.id === 'optimizer')) totalSalaries *= 0.95;
  const monthlyPayroll = totalSalaries / 12;
  let infraCost = Math.max(200, s.customers * 1.5) + (ts.infraCostExtra / 12);
  // Automator ability: -15% infra cost
  if (s.employees.some(e => e.specialAbility?.id === 'automator')) infraCost *= 0.85;
  const marketingSpend = getMarketingCount(s) * 2000;
  // Sales/marketing acquisition cost (simplified: part of CAC is already in salaries)
  const acquisitionSpend = newCustomers * Math.min(s.cac * 0.3, 200);
  s.burn = monthlyPayroll + infraCost + marketingSpend + acquisitionSpend;

  // --- Cash ---
  s.cash = s.cash + s.mrr - s.burn;

  // --- Profitability check ---
  if (s.mrr > s.burn && !s.profitableMonth) {
    s.profitableMonth = true;
  }

  // --- Morale ---
  let moraleDelta = 0;
  if (s.cash < s.burn * 3) moraleDelta -= 3;
  if (s.techDebt > 60) moraleDelta -= 2;
  if (s.mrr > 0 && newCustomers > churnedCustomers) moraleDelta += 1;
  if (s.employees.length > 10 && !hasPM(s)) moraleDelta -= 5;
  if (completed.length > 0) moraleDelta += 3;
  s.morale = Math.max(0, Math.min(100, s.morale + moraleDelta));

  // --- Brand ---
  let brandDelta = 0;
  brandDelta += getMarketingCount(s) * 0.5;
  if (s.nps > 60) brandDelta += 1;
  if (s.founderType === 'designer') brandDelta += 1;
  brandDelta -= s.competitorPressure * 0.02;
  s.brand = Math.max(0, Math.min(100, s.brand + brandDelta));

  // --- Competitor pressure ---
  s.competitorPressure = Math.min(80, v.difficulty * 10 + Math.floor(s.month / 12) * 5);

  // --- Valuation ---
  const arr = s.mrr * 12;
  const growthRate = s.history.length >= 2
    ? (s.mrr - (s.history[s.history.length - 1]?.mrr || 0)) / Math.max(1, s.history[s.history.length - 1]?.mrr || 1)
    : 0;
  const multiple = arr < 1_000_000 ? 8 : arr < 5_000_000 ? 12 : arr < 20_000_000 ? 18 : 25;
  const growthMultiplier = 1 + Math.max(0, growthRate * 5);
  s.valuation = Math.max(s.valuation, arr * multiple * growthMultiplier);

  // --- Streaks ---
  if (s.nps >= 70) s.highNpsStreak += 1; else s.highNpsStreak = 0;
  if (s.morale >= 80) s.highMoraleStreak += 1; else s.highMoraleStreak = 0;

  // --- LTV ---
  const ltv = effectiveChurn > 0 ? s.arpu / effectiveChurn : s.arpu * 100;

  // --- Record history ---
  const snapshot: MonthlySnapshot = {
    month: s.month,
    mrr: s.mrr,
    arr: s.mrr * 12,
    customers: s.customers,
    cash: s.cash,
    burn: s.burn,
    nps: s.nps,
    morale: s.morale,
    techDebt: s.techDebt,
    brand: s.brand,
    valuation: s.valuation,
    founderEquity: s.founderEquity,
    teamSize: s.employees.length,
    churnRate: effectiveChurn * 100,
    cac: s.cac,
    arpu: s.arpu,
    ltv,
    ndr: s.ndr,
  };
  s.history = [...s.history, snapshot];

  // --- Events ---
  if (!s.pendingEvent) {
    const triggered = tryTriggerEvent(s);
    if (triggered) {
      s.pendingEvent = triggered;
    }
  }

  // --- Rivals ---
  s.rivals = simulateRivals(s.rivals, s.month, s.mrr);

  // --- News feed (refresh every 3 months) ---
  if (s.month % 3 === 1) {
    s.newsFeed = generateNewsFeed(s, s.rivals);
  }

  // --- Seasonal effects ---
  const monthOfYear = s.month % 12;
  if (s.vertical === 'edtech') {
    // EdTech: Sep(8) & Apr(3) boom, summer(5-7) slump
    if (monthOfYear === 3 || monthOfYear === 8) {
      newCustomers = Math.floor(newCustomers * 1.5);
    } else if (monthOfYear >= 5 && monthOfYear <= 7) {
      s.churnRate = Math.min(10, s.churnRate + 0.5);
    }
  }
  if (s.vertical === 'hrtech' && (monthOfYear === 11 || monthOfYear === 0)) {
    // HR Tech: year-end crunch
    s.morale = Math.max(0, s.morale - 2);
  }

  // --- Employee ability effects ---
  const abilityState = applyAbilityEffects(s);
  s.nps = abilityState.nps;
  s.brand = abilityState.brand;
  s.morale = abilityState.morale;
  s.employees = abilityState.employees;

  // --- Raise system (every 6 months, after month 6) ---
  if (s.month > 6 && s.month % RAISE_INTERVAL === 0 && s.employees.length > 0 && !s.pendingRaises) {
    s.pendingRaises = generateRaiseRequests(s);
  }

  // --- Founder skill growth ---
  if (s.employees.length > 0) s.founderSkills = { ...s.founderSkills, leadership: s.founderSkills.leadership + 0.5 };
  if (completed.length > 0) s.founderSkills = { ...s.founderSkills, product: s.founderSkills.product + 1 };
  if (newCustomers > 0) s.founderSkills = { ...s.founderSkills, sales: s.founderSkills.sales + 0.3 };
  if (s.pendingEvent?.severity === 'negative' || s.pendingEvent?.severity === 'critical') {
    s.founderSkills = { ...s.founderSkills, crisis: s.founderSkills.crisis + 1 };
  }

  // --- Achievements ---
  const newAchievements = checkAchievements(s);
  if (newAchievements.length > 0) {
    s.achievements = [...s.achievements, ...newAchievements];
    for (const id of newAchievements) {
      s.eventLog = [...s.eventLog, { month: s.month, title: '実績解除！', effect: id }];
    }
  }

  // --- Board meeting check (quarterly after first funding) ---
  if (s.fundingRounds.length > 0 && s.month % 3 === 0) {
    s.boardMeetingDue = true;
  }

  // --- Game over check ---
  if (s.cash <= 0 && s.month > 1) {
    s.gameOver = true;
    s.exitType = 'bankrupt';
    s.finalScore = 0;
    s.eventLog = [...s.eventLog, { month: s.month, title: '倒産', effect: '資金が尽きました...' }];
  }

  return s;
}

// ===== Event System =====

function tryTriggerEvent(state: GameState): (GameEvent & { instanceId: string }) | null {
  const allEvents = [...events, ...phase2Events];

  // Filter out org wall events that have already been resolved
  const eligible = allEvents.filter(e => {
    // Skip org wall events already handled
    if (e.id.startsWith('org_wall_') && state.orgWallsResolved.includes(e.id as any)) return false;
    // Skip cofounder events if no cofounder
    if (e.id.startsWith('cofounder_') && !state.cofounder) return false;

    const c = e.conditions;
    if (!c) return Math.random() < 0.1;
    if (c.minMonth && state.month < c.minMonth) return false;
    if (c.maxMonth && state.month > c.maxMonth) return false;
    if (c.minMrr && state.mrr < c.minMrr) return false;
    if (c.maxMrr && state.mrr > c.maxMrr) return false;
    if (c.minCustomers && state.customers < c.minCustomers) return false;
    if (c.minTeamSize && state.employees.length < c.minTeamSize) return false;
    if (c.verticals && !c.verticals.includes(state.vertical)) return false;
    if (c.probability && Math.random() > c.probability) return false;
    return true;
  });

  if (eligible.length === 0) return null;
  const event = eligible[Math.floor(Math.random() * eligible.length)];
  return { ...event, instanceId: `${event.id}_${state.month}` };
}

// ===== Apply Event Effect =====

export function applyEventEffect(state: GameState, effect: EventEffect): GameState {
  const s = { ...state };
  if (effect.cash) s.cash += effect.cash;
  if (effect.mrrMultiplier) s.mrr *= effect.mrrMultiplier;
  if (effect.churnDelta) s.churnRate = Math.max(0.3, s.churnRate + effect.churnDelta);
  if (effect.npsDelta) s.nps = Math.max(0, Math.min(100, s.nps + effect.npsDelta));
  if (effect.moraleDelta) s.morale = Math.max(0, Math.min(100, s.morale + effect.moraleDelta));
  if (effect.techDebtDelta) s.techDebt = Math.max(0, Math.min(100, s.techDebt + effect.techDebtDelta));
  if (effect.brandDelta) s.brand = Math.max(0, Math.min(100, s.brand + effect.brandDelta));
  if (effect.cacMultiplier) s.cac *= effect.cacMultiplier;
  if (effect.customersDelta) {
    s.customers = Math.max(0, s.customers + effect.customersDelta);
    s.mrr = s.customers * s.arpu;
  }
  if (effect.message) {
    s.eventLog = [...s.eventLog, { month: s.month, title: '選択結果', effect: effect.message }];
  }
  s.pendingEvent = null;
  return s;
}

export function dismissEvent(state: GameState): GameState {
  const s = { ...state };
  if (s.pendingEvent?.autoEffect) {
    return applyEventEffect(s, s.pendingEvent.autoEffect);
  }
  s.pendingEvent = null;
  return s;
}

// ===== Hiring (Revamped) =====

export function hireEmployee(state: GameState, role: EmployeeRole, candidate?: Employee): GameState {
  const s = { ...state };
  const roleInfo = roles[role];

  // Use provided candidate or generate one
  const hasHeadhunter = s.employees.some(e => e.specialAbility?.id === 'headhunter');
  const employee = candidate
    ? { ...candidate, hiredMonth: s.month }
    : generateEmployee(role, s.month, s.nextEmployeeId, hasHeadhunter);

  const hiringCost = employee.salary * 0.2;
  if (s.cash < hiringCost) return s;

  // Stock options
  const empCount = s.employees.length + 1;
  let stockOptions = 0;
  if (empCount <= 5) stockOptions = 1.0;
  else if (empCount <= 20) stockOptions = 0.25;
  else stockOptions = 0.05;
  if (['cto', 'cfo', 'coo'].includes(role)) stockOptions = 2.0;

  employee.stockOptions = stockOptions;
  employee.id = `emp_${s.nextEmployeeId}`;

  s.employees = [...s.employees, employee];
  s.nextEmployeeId += 1;
  s.cash -= hiringCost;
  s.optionPool = Math.max(0, s.optionPool - stockOptions);

  const gradeLabel = employee.grade;
  const abilityMsg = employee.specialAbility ? ` [${employee.specialAbility.name}]` : '';
  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: `${roleInfo.nameJa}を採用`,
    effect: `${employee.name} (${gradeLabel}ランク, ¥${(employee.salary / 1000).toFixed(0)}K/年)${abilityMsg}`,
  }];

  return s;
}

export function fireEmployee(state: GameState, employeeId: string): GameState {
  const s = { ...state };
  const emp = s.employees.find(e => e.id === employeeId);
  if (!emp) return s;

  const severancePay = emp.salary / 12 * 3; // 3 months severance
  s.cash -= severancePay;
  s.employees = s.employees.filter(e => e.id !== employeeId);
  s.morale = Math.max(0, s.morale - 5);
  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: `${roles[emp.role].nameJa}を解雇`,
    effect: `${emp.name} (退職金: ¥${Math.floor(severancePay).toLocaleString()})`,
  }];

  return s;
}

function getTraitLabel(trait: Employee['trait']): string {
  const labels: Record<string, string> = {
    '10x_engineer': '10xエンジニア',
    closer: 'クローザー',
    mood_maker: 'ムードメーカー',
    mentor: 'メンター',
    problem_solver: '問題解決者',
    toxic_genius: '有害な天才',
    job_hopper: 'ジョブホッパー',
    underperformer: '過小評価',
    politician: '政治屋',
    burnout_risk: 'バーンアウト予備軍',
  };
  return trait ? labels[trait] || trait : '';
}

// ===== Feature Development =====

export function startFeatureDev(state: GameState, featureId: string): GameState {
  const s = { ...state };
  const feat = features.find(f => f.id === featureId);
  if (!feat) return s;

  // Check if already in progress or completed
  if (s.featuresInProgress.some(f => f.featureId === featureId)) return s;
  if (s.completedFeatures.some(f => f.featureId === featureId)) return s;

  // Check prerequisites
  if (feat.requiresFeature && !s.completedFeatures.some(f => f.featureId === feat.requiresFeature)) return s;

  const fip: FeatureInProgress = {
    featureId,
    monthsRemaining: feat.months,
    totalMonths: feat.months,
  };

  s.featuresInProgress = [...s.featuresInProgress, fip];
  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: `${feat.name}の開発開始`,
    effect: `推定${feat.months}ヶ月`,
  }];

  return s;
}

// ===== Funding =====

interface FundingOption {
  type: 'preseed' | 'seed' | 'seriesA' | 'seriesB' | 'seriesC';
  nameJa: string;
  minAmount: number;
  maxAmount: number;
  minValuation: number;
  maxValuation: number;
  dilution: number;
  successRate: number;
  conditions: (s: GameState) => boolean;
}

const fundingOptions: FundingOption[] = [
  {
    type: 'preseed',
    nameJa: 'プレシード',
    minAmount: 100000, maxAmount: 500000,
    minValuation: 1000000, maxValuation: 5000000,
    dilution: 12, successRate: 0.75,
    conditions: (s) => s.month <= 9 && !s.fundingRounds.some(r => r.type === 'preseed'),
  },
  {
    type: 'seed',
    nameJa: 'シード',
    minAmount: 500000, maxAmount: 3000000,
    minValuation: 5000000, maxValuation: 15000000,
    dilution: 15, successRate: 0.45,
    conditions: (s) => s.month >= 3 && s.mrr >= 1000 && !s.fundingRounds.some(r => r.type === 'seed'),
  },
  {
    type: 'seriesA',
    nameJa: 'シリーズA',
    minAmount: 5000000, maxAmount: 20000000,
    minValuation: 20000000, maxValuation: 100000000,
    dilution: 20, successRate: 0.3,
    conditions: (s) => s.month >= 12 && s.pmfAchieved && s.mrr >= 50000,
  },
  {
    type: 'seriesB',
    nameJa: 'シリーズB',
    minAmount: 20000000, maxAmount: 60000000,
    minValuation: 100000000, maxValuation: 500000000,
    dilution: 20, successRate: 0.25,
    conditions: (s) => s.month >= 24 && s.mrr >= 200000,
  },
  {
    type: 'seriesC',
    nameJa: 'シリーズC+',
    minAmount: 60000000, maxAmount: 200000000,
    minValuation: 500000000, maxValuation: 2000000000,
    dilution: 15, successRate: 0.2,
    conditions: (s) => s.month >= 36 && s.mrr >= 1000000,
  },
];

export function getAvailableFunding(state: GameState): FundingOption[] {
  return fundingOptions.filter(f => f.conditions(state));
}

export function attemptFunding(state: GameState, type: FundingOption['type']): GameState {
  const s = { ...state };
  const option = fundingOptions.find(f => f.type === type);
  if (!option || !option.conditions(s)) return s;

  const founderBonus = founders[s.founderType].fundingBonus;
  const cfoCbonus = hasCFO(s) ? 0.15 : 0;
  const cofounderFundingBonus = s.cofounder === 'business' ? 0.2 : 0;
  const skillBonus = Math.min(0.1, s.founderSkills.fundraising * 0.01);
  const successRate = Math.min(0.95, option.successRate + founderBonus + cfoCbonus + cofounderFundingBonus + skillBonus);

  if (Math.random() > successRate) {
    s.eventLog = [...s.eventLog, {
      month: s.month,
      title: `${option.nameJa}調達失敗`,
      effect: '投資家から見送りの連絡...',
    }];
    return s;
  }

  const range = option.maxAmount - option.minAmount;
  const amount = option.minAmount + Math.floor(Math.random() * range);
  const valRange = option.maxValuation - option.minValuation;
  const valuation = option.minValuation + Math.floor(Math.random() * valRange);
  const dilution = option.dilution + (Math.random() - 0.5) * 5;

  s.cash += amount;
  s.founderEquity = Math.max(10, s.founderEquity - dilution);
  s.valuation = Math.max(s.valuation, valuation);

  if (valuation < s.valuation * 0.8) {
    s.downRound = true;
  }

  // Generate investor character
  const archetypes = ['visionary', 'metrics', 'operator', 'strategic', 'angel'] as const;
  const archetype = type === 'preseed' ? 'angel' : archetypes[Math.floor(Math.random() * 4)]; // angel for preseed
  const investor = generateInvestor(archetype);
  s.investors = [...s.investors, investor];
  const investorName = investor.name;

  s.fundingRounds = [...s.fundingRounds, {
    type, amount, valuation, dilution, month: s.month, investorName,
  }];

  // Founder skill growth
  s.founderSkills = { ...s.founderSkills, fundraising: s.founderSkills.fundraising + 3 };

  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: `${option.nameJa}調達成功！`,
    effect: `¥${(amount / 1_000_000).toFixed(1)}M at ¥${(valuation / 1_000_000).toFixed(0)}M valuation (${investorName})`,
  }];

  return s;
}

// ===== Exit =====

export function attemptIPO(state: GameState): GameState {
  const s = { ...state };
  const arr = s.mrr * 12;

  if (arr < 10_000_000 || !hasCFO(s)) {
    s.eventLog = [...s.eventLog, { month: s.month, title: 'IPO不可', effect: 'ARR ¥10M以上かつCFO在籍が必要' }];
    return s;
  }

  const baseMultiple = arr < 20_000_000 ? 15 : arr < 50_000_000 ? 20 : 25;
  const growthAdj = 1.2;
  const profitAdj = s.profitableMonth ? 1.3 : 1.0;
  const marketAdj = s.economyCycle > 0 ? 1.2 : 0.8;

  const ipoValuation = arr * baseMultiple * growthAdj * profitAdj * marketAdj;
  const founderValue = ipoValuation * (s.founderEquity / 100);

  s.valuation = ipoValuation;
  s.gameOver = true;
  s.exitType = 'ipo';
  s.finalScore = calculateScore(s);

  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: 'IPO達成！',
    effect: `時価総額: ¥${(ipoValuation / 1_000_000).toFixed(0)}M | 創業者持分価値: ¥${(founderValue / 1_000_000).toFixed(0)}M`,
  }];

  return s;
}

export function attemptMnA(state: GameState): GameState {
  const s = { ...state };
  const arr = s.mrr * 12;

  if (arr < 1_000_000) {
    s.eventLog = [...s.eventLog, { month: s.month, title: 'M&A不可', effect: 'ARR ¥1M以上が必要' }];
    return s;
  }

  const multiple = 5 + Math.random() * 10;
  const techDebtDiscount = s.techDebt > 60 ? 0.8 : 1.0;
  const acquisitionPrice = arr * multiple * techDebtDiscount;
  const founderValue = acquisitionPrice * (s.founderEquity / 100);

  s.valuation = acquisitionPrice;
  s.cash += acquisitionPrice;
  s.gameOver = true;
  s.exitType = 'mna';
  s.finalScore = calculateScore(s);

  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: 'M&A成立！',
    effect: `買収額: ¥${(acquisitionPrice / 1_000_000).toFixed(0)}M | 創業者受取: ¥${(founderValue / 1_000_000).toFixed(0)}M`,
  }];

  return s;
}

// ===== Scoring =====

function calculateScore(state: GameState): number {
  let base = 0;
  const founderRatio = state.founderEquity / 100;

  switch (state.exitType) {
    case 'ipo':
      base = state.valuation * founderRatio * 1.0;
      break;
    case 'mna':
      base = state.valuation * founderRatio * 0.8;
      break;
    case 'continue':
      base = state.mrr * 12 * 10 * founderRatio * 0.6;
      break;
    default:
      return 0;
  }

  let multiplier = 1.0;

  // Bonuses
  if (state.profitableMonth) multiplier += 0.20;
  if (state.highNpsStreak >= 12) multiplier += 0.15;
  if (state.highMoraleStreak >= 12) multiplier += 0.10;
  if (state.techDebt <= 30) multiplier += 0.10;
  if (!state.downRound) multiplier += 0.25;
  if (state.fundingRounds.length === 0 && state.exitType === 'ipo') multiplier += 0.30;

  // Penalties
  if (state.pivotCount >= 3) multiplier -= 0.15;
  if (state.layoffDone) multiplier -= 0.10;
  if (state.securityBreachIgnored) multiplier -= 0.20;
  if (state.founderEquity < 20) multiplier -= 0.10;

  return Math.floor((base / 1000) * multiplier);
}

export function getGrade(score: number): { grade: Grade; title: string } {
  if (score >= 1_000_000) return { grade: 'SSS', title: 'ユニコーンの神' };
  if (score >= 500_000) return { grade: 'SS', title: 'デカコーンへの道' };
  if (score >= 200_000) return { grade: 'S', title: '伝説の起業家' };
  if (score >= 100_000) return { grade: 'A', title: '優秀な経営者' };
  if (score >= 50_000) return { grade: 'B', title: '堅実な創業者' };
  if (score >= 20_000) return { grade: 'C', title: '苦労人' };
  if (score >= 5_000) return { grade: 'D', title: 'サバイバー' };
  return { grade: 'F', title: '次こそは...' };
}

export function continueAsPrivate(state: GameState): GameState {
  const s = { ...state };
  s.gameOver = true;
  s.exitType = 'continue';
  s.finalScore = calculateScore(s);
  return s;
}

// ===== Tech Debt Actions =====

export function runTechDebtSprint(state: GameState): GameState {
  const s = { ...state };
  s.techDebt = Math.max(0, s.techDebt - 20);
  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: '技術負債スプリント実施',
    effect: '技術負債-20',
  }];
  return s;
}

// ===== Pricing =====

export function changePrice(state: GameState, direction: 'up' | 'down', percent: number): GameState {
  const s = { ...state };
  const factor = direction === 'up' ? (1 + percent / 100) : (1 - percent / 100);
  const oldArpu = s.arpu;
  s.arpu = Math.max(10, s.arpu * factor);

  if (direction === 'up') {
    // Price increase: some churn risk
    const churnIncrease = percent * 0.03;
    s.churnRate = Math.min(10, s.churnRate + churnIncrease);
    s.eventLog = [...s.eventLog, {
      month: s.month,
      title: `値上げ ${percent}%`,
      effect: `ARPU ¥${oldArpu.toFixed(0)} → ¥${s.arpu.toFixed(0)} | チャーンリスク+${churnIncrease.toFixed(1)}%`,
    }];
  } else {
    // Price decrease: better acquisition, lower ARPU
    s.cac *= 0.9;
    s.eventLog = [...s.eventLog, {
      month: s.month,
      title: `値下げ ${percent}%`,
      effect: `ARPU ¥${oldArpu.toFixed(0)} → ¥${s.arpu.toFixed(0)} | CAC改善`,
    }];
  }

  // Recalculate MRR
  s.mrr = s.customers * s.arpu;
  return s;
}

export function enableTier(state: GameState, tierIndex: number): GameState {
  const s = { ...state };
  s.pricingTiers = s.pricingTiers.map((t, i) => i === tierIndex ? { ...t, enabled: true } : t);
  const tierName = s.pricingTiers[tierIndex].name;
  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: `${tierName}プラン追加`,
    effect: 'アップセル機会が増加',
  }];
  // Expansion rate boost
  s.ndr = Math.min(150, s.ndr + 5);
  return s;
}

// ===== Global Expansion =====

export function startGlobalExpansion(state: GameState, regionId: string): GameState {
  const s = { ...state };
  const region = s.globalRegions.find(r => r.id === regionId);
  if (!region || region.unlocked || region.expanding) return s;
  if (s.cash < region.setupCost) return s;

  // Requires i18n feature for most regions
  const hasI18n = s.completedFeatures.some(f => f.featureId === 'infra_i18n');
  if (!hasI18n && regionId !== 'north_america') {
    s.eventLog = [...s.eventLog, { month: s.month, title: 'グローバル展開不可', effect: '多言語対応機能が必要です' }];
    return s;
  }

  s.cash -= region.setupCost;
  s.globalRegions = s.globalRegions.map(r =>
    r.id === regionId ? { ...r, expanding: true, expandingMonthsLeft: region.setupMonths } : r
  );
  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: `${region.nameJa}展開開始`,
    effect: `¥${(region.setupCost / 1000).toFixed(0)}K投資、${region.setupMonths}ヶ月後に展開完了`,
  }];
  return s;
}

// ===== M&A (Buying) =====

function generateAcquisitionTarget(state: GameState): Acquisition {
  const names = ['DataSync', 'MetricFlow', 'CloudBridge', 'PipelineAI', 'InsightHub',
    'AutoScale', 'ConnectIQ', 'FlowStack', 'SmartDash', 'NexusAPI'];
  const name = names[Math.floor(Math.random() * names.length)];
  const arr = state.mrr * 12;
  const costBase = arr * (0.05 + Math.random() * 0.15);
  const revenue = costBase * (0.1 + Math.random() * 0.2) / 12;

  return {
    id: `acq_${Date.now()}`,
    targetName: name,
    cost: Math.floor(costBase),
    monthlyRevenue: Math.floor(revenue),
    teamSize: Math.floor(3 + Math.random() * 15),
    techDebtAdded: Math.floor(10 + Math.random() * 20),
    synergy: ['プロダクト補完', '顧客基盤獲得', '技術獲得', '人材獲得'][Math.floor(Math.random() * 4)],
  };
}

export function getAcquisitionTargets(state: GameState): Acquisition[] {
  if (state.mrr * 12 < 5_000_000 || state.month < 24) return [];
  // Generate 1-3 targets
  const count = 1 + Math.floor(Math.random() * 3);
  const targets: Acquisition[] = [];
  for (let i = 0; i < count; i++) {
    targets.push(generateAcquisitionTarget(state));
  }
  return targets;
}

export function executeAcquisition(state: GameState, acquisition: Acquisition): GameState {
  const s = { ...state };
  if (s.cash < acquisition.cost) return s;

  s.cash -= acquisition.cost;
  s.mrr += acquisition.monthlyRevenue;
  s.customers += Math.floor(acquisition.monthlyRevenue / s.arpu);
  s.techDebt = Math.min(100, s.techDebt + acquisition.techDebtAdded);
  s.multiProductCount += 1;
  s.acquisitions = [...s.acquisitions, acquisition];

  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: `${acquisition.targetName}を買収`,
    effect: `¥${(acquisition.cost / 1e6).toFixed(1)}M | +¥${(acquisition.monthlyRevenue / 1000).toFixed(0)}K MRR | +${acquisition.teamSize}人 | シナジー: ${acquisition.synergy}`,
  }];

  return s;
}

// ===== Multi-Product =====

export function launchNewProduct(state: GameState): GameState {
  const s = { ...state };
  if (s.mrr * 12 < 5_000_000 || s.cash < 500000) return s;

  s.cash -= 500000;
  s.multiProductCount += 1;
  const mrrBoost = s.mrr * 0.1;
  s.mrr += mrrBoost;
  s.techDebt = Math.min(100, s.techDebt + 15);

  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: `新プロダクトラインを立ち上げ (#${s.multiProductCount})`,
    effect: `¥500K投資 | MRR+¥${(mrrBoost / 1000).toFixed(0)}K | 技術負債+15`,
  }];
  return s;
}

// ===== Ability Effects (applied in advanceTurn) =====

export function applyAbilityEffects(state: GameState): GameState {
  const s = { ...state };
  const emps = s.employees;

  for (const emp of emps) {
    if (!emp.specialAbility) continue;
    switch (emp.specialAbility.id) {
      case 'debugger':
        // Tech debt reduction applied in tech debt section
        break;
      case 'visionary':
        s.nps = Math.min(100, s.nps + 0.3);
        break;
      case 'branding':
        s.brand = Math.min(100, s.brand + 0.3);
        break;
      case 'morale_boost':
        s.morale = Math.min(100, s.morale + 0.5);
        break;
    }
  }

  // Mentor: grow C/D rank employees
  const hasMentor = emps.some(e => e.specialAbility?.id === 'mentor_ability');
  if (hasMentor) {
    s.employees = s.employees.map(emp => {
      if (emp.grade === 'C' || emp.grade === 'D') {
        return {
          ...emp,
          stats: {
            sales: Math.min(100, emp.stats.sales + 1),
            tech: Math.min(100, emp.stats.tech + 1),
            management: Math.min(100, emp.stats.management + 1),
            creativity: Math.min(100, emp.stats.creativity + 1),
            loyalty: Math.min(100, emp.stats.loyalty + 1),
          },
        };
      }
      return emp;
    });
  }

  // Leader: 10% boost to all stats (affects calculations via stat sums)
  // Applied implicitly through stat-weighted calculations

  return s;
}

// ===== Raise System =====

export function generateRaiseRequests(state: GameState): import('./types').RaiseRequest[] {
  return state.employees.map(emp => {
    let raiseRate = RAISE_BASE_RATES[emp.grade];
    // Loyalty adjustment
    const loyaltyMod = 1.0 - (emp.stats.loyalty - 50) * 0.005;
    raiseRate *= Math.max(0.5, Math.min(1.5, loyaltyMod));
    // Tenure adjustment
    const tenure = state.month - emp.hiredMonth;
    if (tenure > 12) raiseRate *= 1.1;
    // Random variance
    raiseRate *= 0.8 + Math.random() * 0.4;
    // Frugal ability
    if (emp.specialAbility?.id === 'frugal') raiseRate *= 0.85;

    const requestedSalary = Math.round(emp.salaryInfo.current * (1 + raiseRate));
    const avgStat = Object.values(emp.stats).reduce((a, b) => a + b, 0) / 5;
    const contribution = avgStat >= 80 ? 5 : avgStat >= 65 ? 4 : avgStat >= 50 ? 3 : avgStat >= 35 ? 2 : 1;

    return {
      employeeId: emp.id,
      employeeName: emp.name,
      grade: emp.grade,
      currentSalary: emp.salaryInfo.current,
      requestedSalary,
      raiseRate: Math.round(raiseRate * 1000) / 10,
      contributionScore: contribution,
    };
  });
}

export function processRaise(
  state: GameState,
  employeeId: string,
  decision: 'approved' | 'negotiated' | 'rejected',
): GameState {
  const s = { ...state };
  s.employees = s.employees.map(emp => {
    if (emp.id !== employeeId) return emp;

    const request = generateRaiseRequests(state).find(r => r.employeeId === employeeId);
    if (!request) return emp;

    let newSalary = emp.salaryInfo.current;
    let loyaltyDelta = 0;

    switch (decision) {
      case 'approved':
        newSalary = request.requestedSalary;
        loyaltyDelta = LOYALTY_CHANGES.approved;
        break;
      case 'negotiated':
        newSalary = Math.round(emp.salaryInfo.current + (request.requestedSalary - emp.salaryInfo.current) * 0.5);
        loyaltyDelta = Math.random() < 0.5 ? LOYALTY_CHANGES.negotiatedPenalty : 0;
        break;
      case 'rejected':
        loyaltyDelta = LOYALTY_CHANGES.rejected;
        break;
    }

    return {
      ...emp,
      salary: newSalary,
      salaryInfo: {
        ...emp.salaryInfo,
        current: newSalary,
        raiseHistory: [...emp.salaryInfo.raiseHistory, {
          month: s.month,
          before: emp.salaryInfo.current,
          after: newSalary,
          type: decision,
        }],
      },
      stats: {
        ...emp.stats,
        loyalty: Math.max(0, Math.min(100, emp.stats.loyalty + loyaltyDelta)),
      },
    };
  });

  return s;
}

export function processAllRaises(
  state: GameState,
  decisions: Record<string, 'approved' | 'negotiated' | 'rejected'>,
): GameState {
  let s = { ...state };
  for (const [empId, decision] of Object.entries(decisions)) {
    s = processRaise(s, empId, decision);
  }

  // Check resignations after raise processing
  const resignees: string[] = [];
  s.employees = s.employees.filter(emp => {
    if (emp.stats.loyalty > LOYALTY_RESIGN_THRESHOLD) return true;
    const resignChance = (LOYALTY_RESIGN_THRESHOLD - emp.stats.loyalty) * 0.03;
    if (Math.random() < resignChance) {
      resignees.push(emp.name);
      return false;
    }
    return true;
  });

  if (resignees.length > 0) {
    s.morale = Math.max(0, s.morale - resignees.length * 3);
    s.eventLog = [...s.eventLog, {
      month: s.month,
      title: '退職者発生',
      effect: `${resignees.join('、')}が退職しました（忠誠度低下による）`,
    }];
  }

  s.eventLog = [...s.eventLog, {
    month: s.month,
    title: '昇給処理完了',
    effect: `${Object.keys(decisions).length}名の昇給を処理`,
  }];

  return s;
}

// ===== Data Migration =====

export function migrateGameState(state: GameState): GameState {
  if (!state.employees) return state;
  return {
    ...state,
    employees: state.employees.map(e => migrateEmployee(e)),
    pendingRaises: state.pendingRaises ?? null,
  };
}

// Re-export data accessors
export { features, getAvailableFeatures, verticals, founders, roles, techStacks };
export { cofounders } from './data/cofounders';
export { achievements } from './data/achievements';
export { archetypeLabels } from './data/investors';
export { scenarios } from './data/scenarios';
export { generateCandidates } from './employeeGenerator';
export { GRADE_COLORS } from './data/employeeBalance';
export { SPECIAL_ABILITIES } from './data/specialAbilities';
export type { FundingOption };
