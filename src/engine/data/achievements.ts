import { GameState } from '../types';

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'startup' | 'growth' | 'funding' | 'exit' | 'challenge';
  condition: (s: GameState) => boolean;
}

export const achievements: AchievementDef[] = [
  // Startup
  { id: 'hello_world', title: 'Hello World', description: '最初のゲームを開始', icon: '🌱', category: 'startup', condition: (s) => s.month >= 1 },
  { id: 'first_hire', title: '最初の仲間', description: '初めて社員を採用', icon: '🤝', category: 'startup', condition: (s) => s.employees.length >= 1 },
  { id: 'first_feature', title: '初リリース', description: '初めて機能をリリース', icon: '🚀', category: 'startup', condition: (s) => s.completedFeatures.length >= 1 },

  // Growth
  { id: 'first_customer', title: '最初の顧客', description: '初めて有料顧客を獲得', icon: '🎉', category: 'growth', condition: (s) => s.customers >= 1 },
  { id: 'pmf', title: 'Product-Market Fit', description: 'PMFを達成', icon: '🎯', category: 'growth', condition: (s) => s.pmfAchieved },
  { id: 'mrr_10k', title: 'MRR $10K', description: '月間収益$10Kを達成', icon: '📈', category: 'growth', condition: (s) => s.mrr >= 10000 },
  { id: 'mrr_100k', title: 'MRR $100K', description: '月間収益$100Kを達成', icon: '💹', category: 'growth', condition: (s) => s.mrr >= 100000 },
  { id: 'arr_1m', title: 'ARR $1M', description: '年間収益$1Mを達成', icon: '🏆', category: 'growth', condition: (s) => s.mrr * 12 >= 1000000 },
  { id: 'arr_10m', title: 'ARR $10M', description: '年間収益$10Mを達成', icon: '👑', category: 'growth', condition: (s) => s.mrr * 12 >= 10000000 },
  { id: 'customers_100', title: '100社突破', description: '顧客数100社を達成', icon: '💯', category: 'growth', condition: (s) => s.customers >= 100 },
  { id: 'customers_1000', title: '1000社クラブ', description: '顧客数1000社を達成', icon: '🏢', category: 'growth', condition: (s) => s.customers >= 1000 },
  { id: 'unicorn', title: 'ユニコーン', description: '評価額$1Bを達成', icon: '🦄', category: 'growth', condition: (s) => s.valuation >= 1000000000 },

  // Funding
  { id: 'first_funding', title: '最初の一歩', description: '初めての資金調達', icon: '💰', category: 'funding', condition: (s) => s.fundingRounds.length >= 1 },
  { id: 'series_a', title: 'シリーズA卒業', description: 'シリーズAをクローズ', icon: '🎓', category: 'funding', condition: (s) => s.fundingRounds.some(r => r.type === 'seriesA') },
  { id: 'mega_round', title: 'メガラウンド', description: '1回で$100M以上を調達', icon: '🚀', category: 'funding', condition: (s) => s.fundingRounds.some(r => r.amount >= 100000000) },

  // Exit
  { id: 'ipo_bell', title: 'IPOの鐘', description: 'IPOを達成', icon: '🔔', category: 'exit', condition: (s) => s.exitType === 'ipo' },
  { id: 'acquisition', title: '売却成功', description: 'M&Aを成立', icon: '🤝', category: 'exit', condition: (s) => s.exitType === 'mna' },
  { id: 'bootstrapper', title: 'ブートストラッパー', description: '外部資金なしでARR $1M', icon: '💪', category: 'exit', condition: (s) => s.fundingRounds.length === 0 && s.mrr * 12 >= 1000000 },

  // Challenge
  { id: 'phoenix', title: '不死鳥', description: 'ランウェイ1ヶ月以下から復活', icon: '🔥', category: 'challenge', condition: (_s) => false }, // special trigger
  { id: 'speed_run', title: 'スピードラン', description: '24ヶ月以内にIPO', icon: '⚡', category: 'challenge', condition: (s) => s.exitType === 'ipo' && s.month <= 24 },
  { id: 'lean_team', title: '少数精鋭', description: '社員5人以下でARR $500K', icon: '🎖️', category: 'challenge', condition: (s) => s.employees.length <= 5 && s.mrr * 12 >= 500000 },
  { id: 'nps_king', title: 'NPS王', description: 'NPS 80以上を達成', icon: '❤️', category: 'challenge', condition: (s) => s.nps >= 80 },
  { id: 'tech_clean', title: 'クリーンコード', description: '技術負債10以下を24ヶ月維持', icon: '✨', category: 'challenge', condition: (_s) => false }, // special trigger
  { id: 'profitable', title: '黒字化', description: '初めて月次黒字を達成', icon: '📗', category: 'challenge', condition: (s) => s.profitableMonth },
  { id: 'team_50', title: '50人の壁', description: 'チーム50人を達成', icon: '🏛️', category: 'challenge', condition: (s) => s.employees.length >= 50 },
  { id: 'marathon', title: 'マラソン', description: '72ヶ月経営を継続', icon: '🏃', category: 'challenge', condition: (s) => s.month >= 72 },
];

export function checkAchievements(state: GameState): string[] {
  const newlyUnlocked: string[] = [];
  for (const a of achievements) {
    if (state.achievements.includes(a.id)) continue;
    if (a.condition(state)) {
      newlyUnlocked.push(a.id);
    }
  }
  return newlyUnlocked;
}
