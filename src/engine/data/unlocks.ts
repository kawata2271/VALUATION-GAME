// Unlock system - tracks what the player has unlocked across playthroughs

const UNLOCKS_KEY = 'valuation_game_unlocks';

export interface UnlockState {
  verticals: string[];      // unlocked vertical IDs
  founders: string[];       // unlocked founder IDs
  scenarios: string[];      // unlocked scenario IDs
  totalPlaythroughs: number;
  bestScore: number;
  bestGrade: string;
  exitTypes: string[];      // exit types achieved
}

const defaultUnlocks: UnlockState = {
  verticals: ['crm', 'hrtech', 'fintech', 'devtools', 'healthtech', 'edtech'],
  founders: ['engineer', 'sales', 'designer', 'serial'],
  scenarios: ['slack_miracle', 'bootstrap_dream'],
  totalPlaythroughs: 0,
  bestScore: 0,
  bestGrade: 'F',
  exitTypes: [],
};

export function getUnlocks(): UnlockState {
  try {
    const raw = localStorage.getItem(UNLOCKS_KEY);
    if (!raw) return { ...defaultUnlocks };
    return { ...defaultUnlocks, ...JSON.parse(raw) };
  } catch {
    return { ...defaultUnlocks };
  }
}

export function saveUnlocks(unlocks: UnlockState): void {
  try {
    localStorage.setItem(UNLOCKS_KEY, JSON.stringify(unlocks));
  } catch {
    // ignore
  }
}

export interface UnlockCondition {
  id: string;
  type: 'vertical' | 'founder' | 'scenario';
  nameJa: string;
  condition: string;
  check: (unlocks: UnlockState) => boolean;
}

export const unlockConditions: UnlockCondition[] = [
  // Verticals
  {
    id: 'spacetech', type: 'vertical', nameJa: '宇宙テック',
    condition: 'IPOを1回達成',
    check: (u) => u.exitTypes.includes('ipo'),
  },
  {
    id: 'web3', type: 'vertical', nameJa: 'Web3/ブロックチェーン',
    condition: 'DevToolsで1回プレイ完了',
    check: (u) => u.totalPlaythroughs >= 2,
  },
  {
    id: 'cleantech', type: 'vertical', nameJa: 'クリーンテック',
    condition: '3回プレイ完了',
    check: (u) => u.totalPlaythroughs >= 3,
  },

  // Founders
  {
    id: 'domain_expert', type: 'founder', nameJa: 'ドメインエキスパート',
    condition: 'グレードB以上を1回達成',
    check: (u) => ['SSS', 'SS', 'S', 'A', 'B'].includes(u.bestGrade),
  },
  {
    id: 'student', type: 'founder', nameJa: '学生起業家',
    condition: '2回プレイ完了',
    check: (u) => u.totalPlaythroughs >= 2,
  },
  {
    id: 'corporate', type: 'founder', nameJa: '大企業出身者',
    condition: 'M&Aを1回達成',
    check: (u) => u.exitTypes.includes('mna'),
  },

  // Scenarios
  {
    id: 'zoom_growth', type: 'scenario', nameJa: 'Zoomの急成長',
    condition: 'グレードA以上を達成',
    check: (u) => ['SSS', 'SS', 'S', 'A'].includes(u.bestGrade),
  },
  {
    id: 'wework_lesson', type: 'scenario', nameJa: 'WeWorkの教訓',
    condition: 'IPOを1回達成',
    check: (u) => u.exitTypes.includes('ipo'),
  },
  {
    id: 'fintech_regulation', type: 'scenario', nameJa: 'FinTech規制の嵐',
    condition: 'FinTechで1回プレイ完了',
    check: (u) => u.totalPlaythroughs >= 1,
  },
];

export function processUnlocks(unlocks: UnlockState): { updated: UnlockState; newUnlocks: string[] } {
  const updated = { ...unlocks };
  const newUnlocks: string[] = [];

  for (const cond of unlockConditions) {
    if (!cond.check(updated)) continue;

    if (cond.type === 'vertical' && !updated.verticals.includes(cond.id)) {
      updated.verticals.push(cond.id);
      newUnlocks.push(`${cond.nameJa} (領域)`);
    }
    if (cond.type === 'founder' && !updated.founders.includes(cond.id)) {
      updated.founders.push(cond.id);
      newUnlocks.push(`${cond.nameJa} (創業者)`);
    }
    if (cond.type === 'scenario' && !updated.scenarios.includes(cond.id)) {
      updated.scenarios.push(cond.id);
      newUnlocks.push(`${cond.nameJa} (シナリオ)`);
    }
  }

  return { updated, newUnlocks };
}
