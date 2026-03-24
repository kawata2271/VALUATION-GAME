import {
  Employee, EmployeeGrade, EmployeeStats, EmployeeRole,
  SpecialAbilityDef, SalaryInfo,
} from './types';
import { GRADE_WEIGHTS, GRADE_STAT_RANGES, SALARY_MULTIPLIERS, ABILITY_GRANT_RATES } from './data/employeeBalance';
import { SPECIAL_ABILITIES } from './data/specialAbilities';
import { roles, generateName } from './data/roles';

/** 重み付きランダム選択 */
function weightedRandom(weights: Record<string, number>): string {
  const entries = Object.entries(weights);
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = Math.random() * total;
  for (const [key, weight] of entries) {
    r -= weight;
    if (r <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

/** 能力値を生成（得意分野1-2個） */
function generateStats(grade: EmployeeGrade): EmployeeStats {
  const range = GRADE_STAT_RANGES[grade];
  const keys: (keyof EmployeeStats)[] = ['sales', 'tech', 'management', 'creativity', 'loyalty'];
  const shuffled = [...keys].sort(() => Math.random() - 0.5);
  const specialtyCount = 1 + Math.floor(Math.random() * 2);
  const specialties = new Set(shuffled.slice(0, specialtyCount));

  const stats = {} as EmployeeStats;
  for (const key of keys) {
    let value = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    if (specialties.has(key)) {
      value = Math.min(100, value + 10 + Math.floor(Math.random() * 11));
    }
    stats[key] = value;
  }
  return stats;
}

/** 特殊能力をロール */
function rollSpecialAbility(grade: EmployeeGrade): SpecialAbilityDef | null {
  const grantRate = ABILITY_GRANT_RATES[grade];
  if (Math.random() > grantRate) return null;

  const gradeOrder: EmployeeGrade[] = ['D', 'C', 'B', 'A', 'S'];
  const gradeIndex = gradeOrder.indexOf(grade);
  const eligible = SPECIAL_ABILITIES.filter(a => gradeOrder.indexOf(a.minGrade) <= gradeIndex);
  if (eligible.length === 0) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

/** 給与を算出 */
function calculateSalary(
  grade: EmployeeGrade,
  stats: EmployeeStats,
  ability: SpecialAbilityDef | null,
  baseSalary: number,
): number {
  const gradeMult = SALARY_MULTIPLIERS[grade];
  const avgStat = Object.values(stats).reduce((a, b) => a + b, 0) / 5;
  const statMult = 1.0 + (avgStat - 50) * 0.005;
  const abilityMult = ability ? 1.1 : 1.0;
  const frugalMult = ability?.id === 'frugal' ? 0.85 : 1.0;
  return Math.round(baseSalary * gradeMult * statMult * abilityMult * frugalMult);
}

/** ヘッドハンター効果: ランクを1段階上げる */
function applyHeadhunterBoost(grade: EmployeeGrade): EmployeeGrade {
  const upgrades: Record<EmployeeGrade, EmployeeGrade> = {
    D: 'C', C: 'B', B: 'A', A: 'S', S: 'S',
  };
  return upgrades[grade];
}

/** 新しい社員を生成（採用候補用） */
export function generateEmployee(
  role: EmployeeRole,
  month: number,
  nextId: number,
  hasHeadhunter: boolean = false,
): Employee {
  let grade = weightedRandom(GRADE_WEIGHTS) as EmployeeGrade;
  if (hasHeadhunter) {
    grade = applyHeadhunterBoost(grade);
  }

  const stats = generateStats(grade);
  const specialAbility = rollSpecialAbility(grade);
  const roleInfo = roles[role];
  const salary = calculateSalary(grade, stats, specialAbility, roleInfo.baseSalary);

  const salaryInfo: SalaryInfo = {
    base: salary,
    current: salary,
    raiseHistory: [],
  };

  return {
    id: `emp_${nextId}`,
    name: generateName(),
    role,
    salary,
    trait: null,  // 旧traitは廃止、specialAbilityに統合
    hiredMonth: month,
    stockOptions: 0,
    grade,
    stats,
    specialAbility,
    salaryInfo,
  };
}

/** 採用候補を複数生成 */
export function generateCandidates(
  role: EmployeeRole,
  count: number,
  month: number,
  nextId: number,
  hasHeadhunter: boolean = false,
): Employee[] {
  return Array.from({ length: count }, (_, i) =>
    generateEmployee(role, month, nextId + i, hasHeadhunter)
  );
}

/** 既存セーブデータのマイグレーション */
export function migrateEmployee(old: any): Employee {
  if (old.grade && old.stats && old.salaryInfo) return old as Employee;

  return {
    ...old,
    grade: old.grade ?? 'C',
    stats: old.stats ?? {
      sales: 40 + Math.floor(Math.random() * 20),
      tech: 40 + Math.floor(Math.random() * 20),
      management: 40 + Math.floor(Math.random() * 20),
      creativity: 40 + Math.floor(Math.random() * 20),
      loyalty: 50 + Math.floor(Math.random() * 20),
    },
    specialAbility: old.specialAbility ?? null,
    salaryInfo: old.salaryInfo ?? {
      base: old.salary ?? 100000,
      current: old.salary ?? 100000,
      raiseHistory: [],
    },
  };
}
