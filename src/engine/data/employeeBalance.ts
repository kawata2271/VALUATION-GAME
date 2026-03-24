import { EmployeeGrade } from '../types';

/** ランク別出現率 */
export const GRADE_WEIGHTS: Record<EmployeeGrade, number> = {
  S: 0.03,
  A: 0.12,
  B: 0.25,
  C: 0.40,
  D: 0.20,
};

/** ランク別能力値範囲 */
export const GRADE_STAT_RANGES: Record<EmployeeGrade, { min: number; max: number }> = {
  S: { min: 80, max: 100 },
  A: { min: 60, max: 85 },
  B: { min: 40, max: 70 },
  C: { min: 20, max: 50 },
  D: { min: 5, max: 30 },
};

/** ランク別給与倍率（baseSalary × この倍率） */
export const SALARY_MULTIPLIERS: Record<EmployeeGrade, number> = {
  S: 3.0,
  A: 2.0,
  B: 1.5,
  C: 1.0,
  D: 0.7,
};

/** ランク別基本昇給率 */
export const RAISE_BASE_RATES: Record<EmployeeGrade, number> = {
  S: 0.12,
  A: 0.10,
  B: 0.08,
  C: 0.06,
  D: 0.04,
};

/** 昇給間隔（月数） */
export const RAISE_INTERVAL = 6;

/** 退職判定の忠誠度しきい値 */
export const LOYALTY_RESIGN_THRESHOLD = 30;

/** 昇給対応による忠誠度変化 */
export const LOYALTY_CHANGES = {
  approved: 5,
  negotiated: 0,
  negotiatedPenalty: -3,
  rejected: -10,
};

/** 特殊能力付与確率 */
export const ABILITY_GRANT_RATES: Record<EmployeeGrade, number> = {
  S: 1.0,
  A: 0.8,
  B: 0.5,
  C: 0.2,
  D: 0.0,
};

/** ランク表示色 */
export const GRADE_COLORS: Record<EmployeeGrade, string> = {
  S: '#FFD700',
  A: '#9B59B6',
  B: '#3498DB',
  C: '#27AE60',
  D: '#95A5A6',
};
