/**
 * 通貨フォーマットユーティリティ
 * 全ての金額表示はこの関数群を経由する
 */

/** 大きな金額を省略表記でフォーマット (例: ¥1.2B, ¥5.0M, ¥120K) */
export function formatCurrency(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1e9) return `${sign}¥${(abs / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${sign}¥${(abs / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${sign}¥${(abs / 1e3).toFixed(0)}K`;
  return `${sign}¥${Math.round(abs)}`;
}

/** 千単位フォーマット (例: ¥120K/年) */
export function formatSalary(n: number): string {
  return `¥${(n / 1000).toFixed(0)}K`;
}

/** カンマ区切りフォーマット (例: ¥1,234,567) */
export function formatFull(n: number): string {
  return `¥${Math.round(n).toLocaleString('ja-JP')}`;
}

/** 略称なし (グラフ用、記号のみ) */
export function formatChartValue(n: number): string {
  return `¥${Math.round(n).toLocaleString('ja-JP')}`;
}
