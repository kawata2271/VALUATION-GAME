// ===== Bridge: 新採用システム ⇔ 既存GameEngine =====
// 新しいCandidateProfileを既存のEmployee型に変換し、
// GameEngine.hireEmployee()と連携するためのブリッジ関数

import type { Employee, EmployeeRole, EmployeeGrade, EmployeeStats, SalaryInfo, GameState } from '../types';
import type { CandidateProfile, SalaryOffer, HiringRecord, JobType } from './types';
import { JOB_TYPE_TO_ROLES, SALARY_TABLE, HIDDEN_JOB_BONUS_RANGE } from './constants';
import { SPECIAL_TRAITS } from './constants';
import { monthlyBurnImpact } from './salaryTable';

// --- CandidateRank → EmployeeGrade 変換 ---

export function candidateRankToGrade(rank: string): EmployeeGrade {
  // 同一の文字列なので直接キャスト
  return rank as EmployeeGrade;
}

// --- CandidateAbility → EmployeeStats 変換 ---

export function abilityToStats(candidate: CandidateProfile): EmployeeStats {
  const a = candidate.trueAbility;

  // 適職ボーナス
  let bonus = 1.0;
  if (candidate.hiddenBestFitJob !== candidate.currentJobType) {
    // 隠し適職と実際の配置が一致する場合はボーナス
    // ここでは変換時のみなのでボーナスは適用しない
    // 配置変更時に別途適用する
  }

  return {
    sales: Math.round((a.communication * 0.5 + a.domainKnowledge * 0.3 + a.analytics * 0.2) * bonus),
    tech: Math.round((a.coding * 0.7 + a.analytics * 0.2 + a.creativity * 0.1) * bonus),
    management: Math.round((a.leadership * 0.5 + a.communication * 0.3 + a.stamina * 0.2) * bonus),
    creativity: Math.round((a.creativity * 0.6 + a.growth * 0.2 + a.coding * 0.2) * bonus),
    loyalty: Math.round((a.stamina * 0.6 + a.growth * 0.2 + a.communication * 0.2) * bonus),
  };
}

// --- JobType → EmployeeRole 変換 ---

export function jobTypeToRole(jobType: JobType): EmployeeRole {
  const roles = JOB_TYPE_TO_ROLES[jobType];
  if (!roles || roles.length === 0) return 'engineer_backend';
  // ランダムに1つ選ぶ（実際にはUIで指定されるべき）
  return roles[Math.floor(Math.random() * roles.length)] as EmployeeRole;
}

// --- CandidateProfile → Employee 変換 ---

export function candidateToEmployee(
  candidate: CandidateProfile,
  offer: SalaryOffer,
  assignedRole: EmployeeRole,
  gameMonth: number,
  nextEmployeeId: number,
): Employee {
  const grade = candidateRankToGrade(candidate.rank);
  const stats = abilityToStats(candidate);
  const annualSalaryDollars = offer.baseSalary * 100; // 万円 → ドル換算

  // 特殊属性をSpecialAbilityDef形式に変換
  let specialAbility = null;
  if (candidate.specialTrait) {
    const traitInfo = SPECIAL_TRAITS.find(t => t.id === candidate.specialTrait);
    if (traitInfo) {
      specialAbility = {
        id: traitInfo.id,
        name: traitInfo.name,
        description: traitInfo.description,
        category: 'special' as const,
        minGrade: 'D' as EmployeeGrade,
      };
    }
  }

  const salaryInfo: SalaryInfo = {
    base: annualSalaryDollars,
    current: annualSalaryDollars,
    raiseHistory: [],
  };

  return {
    id: `emp_${nextEmployeeId}`,
    name: candidate.name,
    role: assignedRole,
    salary: annualSalaryDollars,
    trait: null,
    hiredMonth: gameMonth,
    stockOptions: offer.stockOptionPercent,
    grade,
    stats,
    specialAbility,
    salaryInfo,
  };
}

// --- 採用確定時のGameState更新 ---

export function applyHiringToGameState(
  gameState: GameState,
  candidate: CandidateProfile,
  offer: SalaryOffer,
  assignedRole: EmployeeRole,
): GameState {
  const employee = candidateToEmployee(
    candidate,
    offer,
    assignedRole,
    gameState.month,
    gameState.nextEmployeeId,
  );

  // 採用コスト（サインオンボーナス + 採用経費）
  const signingCostDollars = offer.signingBonus * 100; // 万円 → ドル
  const hiringExpense = employee.salary * 0.2; // 年収の20%が採用コスト
  const totalCost = signingCostDollars + hiringExpense;

  if (gameState.cash < totalCost) {
    // 資金不足
    return {
      ...gameState,
      eventLog: [...gameState.eventLog, {
        month: gameState.month,
        title: '採用資金不足',
        effect: `${candidate.name}の採用に必要な資金が不足しています`,
      }],
    };
  }

  // SO
  const empCount = gameState.employees.length + 1;
  let stockOptions = offer.stockOptionPercent;
  if (stockOptions === 0) {
    // デフォルトSO
    if (empCount <= 5) stockOptions = 1.0;
    else if (empCount <= 20) stockOptions = 0.25;
    else stockOptions = 0.05;
  }
  employee.stockOptions = stockOptions;

  return {
    ...gameState,
    employees: [...gameState.employees, employee],
    nextEmployeeId: gameState.nextEmployeeId + 1,
    cash: gameState.cash - totalCost,
    optionPool: Math.max(0, gameState.optionPool - stockOptions),
    eventLog: [...gameState.eventLog, {
      month: gameState.month,
      title: `${candidate.name}が入社！`,
      effect: `${candidate.rank}ランク ${candidate.currentJobType} / 年収${offer.baseSalary}万円${offer.signingBonus > 0 ? ` + サインオン${offer.signingBonus}万円` : ''}`,
    }],
  };
}

// --- 採用チャネルのコストをGameStateに反映 ---

export function applyChannelCost(gameState: GameState, costManYen: number): GameState {
  const costDollars = costManYen * 10000; // 万円 → ドル（ゲーム内通貨）
  // 注: ゲーム内通貨はドルベースで、万円×100≒ドルの概算
  // 実際にはcostManYen * 100が妥当
  const actualCost = costManYen * 100;

  if (gameState.cash < actualCost) {
    return gameState; // 資金不足
  }

  return {
    ...gameState,
    cash: gameState.cash - actualCost,
    eventLog: [...gameState.eventLog, {
      month: gameState.month,
      title: '採用活動費',
      effect: `¥${costManYen}万の採用コストが発生`,
    }],
  };
}
