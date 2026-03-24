import { create } from 'zustand';
import {
  GameState, VerticalId, FounderType, EmployeeRole, EventChoice,
  TechStack, CofounderType, GameMode, Acquisition, Employee,
  PivotOption, BusinessDomainId, SubBusiness,
} from '../../engine/types';
import {
  createInitialState, advanceTurn, applyEventEffect, dismissEvent,
  hireEmployee, fireEmployee, startFeatureDev, attemptFunding,
  attemptIPO, attemptMnA, continueAsPrivate, runTechDebtSprint,
  getAvailableFunding, FundingOption, changePrice, enableTier,
  startGlobalExpansion, getAcquisitionTargets, executeAcquisition,
  launchNewProduct, processAllRaises, generateCandidates, migrateGameState,
  shouldSuggestPivot, getPivotOptions, executePivot,
  canLaunchSubBusiness, launchSubBusiness, withdrawSubBusiness,
} from '../../engine/GameEngine';
import { autoSave, loadAutoSave, clearAutoSave, saveToSlot, loadFromSlot } from './useSave';
import { Sound } from './useSound';

type Screen = 'title' | 'setup' | 'game' | 'gameover' | 'stats';
type Panel = 'team' | 'product' | 'funding' | 'sales' | 'strategy' | 'analytics' | 'exit' | 'log' | 'save' | null;

interface GameStore {
  screen: Screen;
  panel: Panel;
  state: GameState | null;

  setScreen: (screen: Screen) => void;
  setPanel: (panel: Panel) => void;
  togglePanel: (panel: Panel) => void;

  startGame: (companyName: string, vertical: VerticalId, founder: FounderType, techStack?: TechStack, cofounder?: CofounderType, gameMode?: GameMode, scenarioId?: string | null) => void;
  nextTurn: () => void;

  handleEventChoice: (choice: EventChoice) => void;
  handleEventDismiss: () => void;

  hire: (role: EmployeeRole) => void;
  fire: (employeeId: string) => void;

  startFeature: (featureId: string) => void;
  techDebtSprint: () => void;

  getAvailableFundingOptions: () => FundingOption[];
  raiseFunding: (type: FundingOption['type']) => void;

  doIPO: () => void;
  doMnA: () => void;
  doContinue: () => void;

  adjustPrice: (direction: 'up' | 'down', percent: number) => void;
  addTier: (tierIndex: number) => void;

  expandGlobal: (regionId: string) => void;
  buyCompany: (acquisition: Acquisition) => void;
  newProduct: () => void;
  getAcqTargets: () => Acquisition[];

  hireCandidate: (candidate: Employee) => void;
  getCandidates: (role: EmployeeRole, count: number) => Employee[];
  submitRaises: (decisions: Record<string, 'approved' | 'negotiated' | 'rejected'>) => void;

  // Pivot
  checkPivotSuggestion: () => boolean;
  getPivotOpts: () => PivotOption[];
  doPivot: (option: PivotOption) => void;

  // Sub-business
  canLaunchSub: () => boolean;
  launchSub: (domain: BusinessDomainId, name: string, budget: number, team: number) => void;
  withdrawSub: (subId: string) => void;

  saveGame: (slotId: number) => void;
  loadGame: (slotId: number) => void;
  resumeAutoSave: () => void;
  hasAutoSave: () => boolean;

  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'title',
  panel: null,
  state: null,

  setScreen: (screen) => set({ screen }),
  setPanel: (panel) => set({ panel }),
  togglePanel: (panel) => set(s => ({ panel: s.panel === panel ? null : panel })),

  startGame: (companyName, vertical, founder, techStack, cofounder, gameMode, scenarioId) => {
    const state = createInitialState(companyName, vertical, founder, techStack, cofounder, gameMode, scenarioId);
    set({ state, screen: 'game', panel: null });
  },

  nextTurn: () => {
    const { state } = get();
    if (!state || state.gameOver) return;
    Sound.turnAdvance();
    const newState = advanceTurn(state);
    autoSave(newState);
    // Sound for events
    if (newState.pendingEvent) {
      const sev = newState.pendingEvent.severity;
      if (sev === 'critical') Sound.criticalEvent();
      else if (sev === 'negative') Sound.badEvent();
      else if (sev === 'positive') Sound.goodEvent();
    }
    // Sound for achievements
    if (newState.achievements.length > (state.achievements?.length || 0)) {
      Sound.achievement();
    }
    if (newState.gameOver) {
      if (newState.exitType === 'bankrupt') Sound.bankrupt();
      set({ state: newState, screen: 'gameover' });
    } else {
      set({ state: newState });
    }
  },

  handleEventChoice: (choice) => {
    const { state } = get();
    if (!state) return;
    Sound.click();
    const newState = applyEventEffect(state, choice.effect);
    autoSave(newState);
    set({ state: newState });
  },

  handleEventDismiss: () => {
    const { state } = get();
    if (!state) return;
    const newState = dismissEvent(state);
    autoSave(newState);
    set({ state: newState });
  },

  hire: (role) => {
    const { state } = get();
    if (!state) return;
    Sound.hire();
    const newState = hireEmployee(state, role);
    autoSave(newState);
    set({ state: newState });
  },

  fire: (employeeId) => {
    const { state } = get();
    if (!state) return;
    const newState = fireEmployee(state, employeeId);
    autoSave(newState);
    set({ state: newState });
  },

  startFeature: (featureId) => {
    const { state } = get();
    if (!state) return;
    const newState = startFeatureDev(state, featureId);
    autoSave(newState);
    set({ state: newState });
  },

  techDebtSprint: () => {
    const { state } = get();
    if (!state) return;
    const newState = runTechDebtSprint(state);
    autoSave(newState);
    set({ state: newState });
  },

  getAvailableFundingOptions: () => {
    const { state } = get();
    if (!state) return [];
    return getAvailableFunding(state);
  },

  raiseFunding: (type) => {
    const { state } = get();
    if (!state) return;
    const newState = attemptFunding(state, type);
    if (newState.fundingRounds.length > state.fundingRounds.length) {
      Sound.fundingSuccess();
    } else {
      Sound.fundingFail();
    }
    autoSave(newState);
    set({ state: newState });
  },

  doIPO: () => {
    const { state } = get();
    if (!state) return;
    const newState = attemptIPO(state);
    clearAutoSave();
    if (newState.gameOver) {
      Sound.ipoBell();
      set({ state: newState, screen: 'gameover' });
    } else {
      set({ state: newState });
    }
  },

  doMnA: () => {
    const { state } = get();
    if (!state) return;
    const newState = attemptMnA(state);
    clearAutoSave();
    if (newState.gameOver) {
      Sound.fundingSuccess();
      set({ state: newState, screen: 'gameover' });
    } else {
      set({ state: newState });
    }
  },

  doContinue: () => {
    const { state } = get();
    if (!state) return;
    const newState = continueAsPrivate(state);
    clearAutoSave();
    set({ state: newState, screen: 'gameover' });
  },

  adjustPrice: (direction, percent) => {
    const { state } = get();
    if (!state) return;
    const newState = changePrice(state, direction, percent);
    autoSave(newState);
    set({ state: newState });
  },

  addTier: (tierIndex) => {
    const { state } = get();
    if (!state) return;
    const newState = enableTier(state, tierIndex);
    autoSave(newState);
    set({ state: newState });
  },

  expandGlobal: (regionId) => {
    const { state } = get();
    if (!state) return;
    const newState = startGlobalExpansion(state, regionId);
    autoSave(newState);
    set({ state: newState });
  },

  buyCompany: (acquisition) => {
    const { state } = get();
    if (!state) return;
    Sound.fundingSuccess();
    const newState = executeAcquisition(state, acquisition);
    autoSave(newState);
    set({ state: newState });
  },

  newProduct: () => {
    const { state } = get();
    if (!state) return;
    Sound.featureRelease();
    const newState = launchNewProduct(state);
    autoSave(newState);
    set({ state: newState });
  },

  getAcqTargets: () => {
    const { state } = get();
    if (!state) return [];
    return getAcquisitionTargets(state);
  },

  hireCandidate: (candidate) => {
    const { state } = get();
    if (!state) return;
    Sound.hire();
    const newState = hireEmployee(state, candidate.role, candidate);
    autoSave(newState);
    set({ state: newState });
  },

  getCandidates: (role, count) => {
    const { state } = get();
    if (!state) return [];
    const hasHeadhunter = state.employees.some(e => e.specialAbility?.id === 'headhunter');
    return generateCandidates(role, count, state.month, state.nextEmployeeId, hasHeadhunter);
  },

  submitRaises: (decisions) => {
    const { state } = get();
    if (!state) return;
    const newState = processAllRaises(state, decisions);
    newState.pendingRaises = null;
    autoSave(newState);
    set({ state: newState });
  },

  checkPivotSuggestion: () => {
    const { state } = get();
    if (!state) return false;
    return shouldSuggestPivot(state);
  },

  getPivotOpts: () => {
    const { state } = get();
    if (!state) return [];
    return getPivotOptions(state);
  },

  doPivot: (option) => {
    const { state } = get();
    if (!state) return;
    Sound.criticalEvent();
    const newState = executePivot(state, option);
    autoSave(newState);
    set({ state: newState });
  },

  canLaunchSub: () => {
    const { state } = get();
    if (!state) return false;
    return canLaunchSubBusiness(state);
  },

  launchSub: (domain, name, budget, team) => {
    const { state } = get();
    if (!state) return;
    Sound.featureRelease();
    const newState = launchSubBusiness(state, domain, name, budget, team);
    autoSave(newState);
    set({ state: newState });
  },

  withdrawSub: (subId) => {
    const { state } = get();
    if (!state) return;
    const newState = withdrawSubBusiness(state, subId);
    autoSave(newState);
    set({ state: newState });
  },

  saveGame: (slotId) => {
    const { state } = get();
    if (!state) return;
    saveToSlot(state, slotId);
  },

  loadGame: (slotId) => {
    const loaded = loadFromSlot(slotId);
    if (loaded) {
      set({ state: loaded, screen: loaded.gameOver ? 'gameover' : 'game', panel: null });
    }
  },

  resumeAutoSave: () => {
    const loaded = loadAutoSave();
    if (loaded) {
      const migrated = migrateGameState(loaded);
      set({ state: migrated, screen: migrated.gameOver ? 'gameover' : 'game', panel: null });
    }
  },

  hasAutoSave: () => {
    return loadAutoSave() !== null;
  },

  resetGame: () => {
    set({ screen: 'title', state: null, panel: null });
  },
}));
