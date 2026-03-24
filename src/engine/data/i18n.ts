type Lang = 'ja' | 'en';

const LANG_KEY = 'valuation_game_lang';

let currentLang: Lang = (typeof localStorage !== 'undefined' && localStorage.getItem(LANG_KEY) as Lang) || 'ja';

export function getLang(): Lang { return currentLang; }
export function setLang(l: Lang) {
  currentLang = l;
  try { localStorage.setItem(LANG_KEY, l); } catch {}
}

type TranslationMap = Record<string, { ja: string; en: string }>;

const translations: TranslationMap = {
  // Title
  'title.subtitle': { ja: 'SaaS創業からエグジットまでの全てを体験する\n最もリアルな経営シミュレーション', en: 'The most realistic management simulation\nfrom SaaS founding to exit' },
  'title.newgame': { ja: 'NEW GAME', en: 'NEW GAME' },
  'title.continue': { ja: 'CONTINUE', en: 'CONTINUE' },
  'title.loadsave': { ja: 'LOAD SAVE', en: 'LOAD SAVE' },

  // Setup
  'setup.mode': { ja: 'ゲームモードを選択', en: 'Select Game Mode' },
  'setup.mode.sub': { ja: 'どのモードでプレイしますか？', en: 'Which mode will you play?' },
  'setup.normal': { ja: 'ノーマル', en: 'Normal' },
  'setup.normal.desc': { ja: '標準的なSaaS経営体験。バランスの取れた難易度。', en: 'Standard SaaS management. Balanced difficulty.' },
  'setup.hard': { ja: 'ハード', en: 'Hard' },
  'setup.hard.desc': { ja: '初期資金半減、顧客獲得-30%。真の経営者だけが生き残る。', en: 'Half starting cash, -30% customer acquisition. Only true CEOs survive.' },
  'setup.sandbox': { ja: 'サンドボックス', en: 'Sandbox' },
  'setup.sandbox.desc': { ja: '初期資金$10M。自由に実験できるモード。', en: '$10M starting cash. Experiment freely.' },
  'setup.scenarios': { ja: '歴史シナリオ', en: 'Historical Scenarios' },
  'setup.companyname': { ja: '会社名を決める', en: 'Name Your Company' },
  'setup.companyname.sub': { ja: 'あなたのSaaS企業の名前を入力してください', en: 'Enter your SaaS company name' },
  'setup.vertical': { ja: '事業領域を選択', en: 'Choose Your Market' },
  'setup.vertical.sub': { ja: 'どの市場で戦いますか？', en: 'Which market will you compete in?' },
  'setup.founder': { ja: '創業者タイプを選択', en: 'Choose Founder Type' },
  'setup.techstack': { ja: '技術スタックを選択', en: 'Choose Tech Stack' },
  'setup.techstack.sub': { ja: 'プロダクトの技術基盤を決めましょう', en: 'Choose your product\'s technical foundation' },
  'setup.cofounder': { ja: '共同創業者を選ぶ', en: 'Choose Co-founder' },
  'setup.cofounder.sub': { ja: '共同創業者は能力を補完するが、株式を分割する必要がある', en: 'Co-founders complement abilities but require equity split' },
  'setup.solo': { ja: 'ソロ創業', en: 'Solo Founder' },
  'setup.solo.desc': { ja: '共同創業者なし。株式100%を維持。全ての決定権はあなたに。', en: 'No co-founder. Keep 100% equity. All decisions are yours.' },
  'setup.back': { ja: '戻る', en: 'Back' },
  'setup.next': { ja: '次へ', en: 'Next' },
  'setup.locked': { ja: '条件を満たすと解放されます', en: 'Complete conditions to unlock' },
  'setup.difficulty': { ja: '難易度', en: 'Difficulty' },
  'setup.equity': { ja: '持分', en: 'Equity' },

  // Game
  'game.nextmonth': { ja: '▶ 次の月へ進む', en: '▶ Advance to Next Month' },
  'game.team': { ja: 'チーム', en: 'Team' },
  'game.dev': { ja: '開発', en: 'Dev' },
  'game.funding': { ja: '調達', en: 'Funding' },
  'game.sales': { ja: '営業', en: 'Sales' },
  'game.strategy': { ja: '戦略', en: 'Strategy' },
  'game.analytics': { ja: '分析', en: 'Analytics' },
  'game.exit': { ja: 'EXIT', en: 'EXIT' },
  'game.log': { ja: 'ログ', en: 'Log' },
  'game.save': { ja: 'セーブ', en: 'Save' },
  'game.runway': { ja: 'ヶ月', en: 'mo' },
  'game.customers': { ja: '社', en: '' },

  // Panels
  'panel.team': { ja: 'チーム管理', en: 'Team Management' },
  'panel.product': { ja: 'プロダクト開発', en: 'Product Development' },
  'panel.funding': { ja: '資金調達', en: 'Fundraising' },
  'panel.sales': { ja: '営業・プライシング', en: 'Sales & Pricing' },
  'panel.strategy': { ja: '戦略・情報', en: 'Strategy & Info' },
  'panel.exit': { ja: 'EXIT戦略', en: 'EXIT Strategy' },
  'panel.log': { ja: 'イベントログ', en: 'Event Log' },
  'panel.analytics': { ja: '分析', en: 'Analytics' },
  'panel.save': { ja: 'セーブ', en: 'Save' },

  // KPIs
  'kpi.mrr': { ja: 'MRR', en: 'MRR' },
  'kpi.customers': { ja: '顧客数', en: 'Customers' },
  'kpi.cash': { ja: 'キャッシュ', en: 'Cash' },
  'kpi.nps': { ja: 'NPS', en: 'NPS' },
  'kpi.morale': { ja: 'チーム士気', en: 'Team Morale' },
  'kpi.techdebt': { ja: '技術負債', en: 'Tech Debt' },
  'kpi.brand': { ja: 'ブランド認知', en: 'Brand' },
  'kpi.valuation': { ja: '評価額', en: 'Valuation' },
  'kpi.equity': { ja: '持分', en: 'Equity' },

  // Phases
  'phase.0': { ja: 'アイデア期', en: 'Idea Stage' },
  'phase.1': { ja: 'PMF探索期', en: 'PMF Search' },
  'phase.2': { ja: 'グロース期', en: 'Growth' },
  'phase.3': { ja: 'スケール期', en: 'Scale' },
  'phase.4': { ja: 'エグジット期', en: 'Exit Stage' },

  // Game Over
  'gameover.replay': { ja: 'もう一度プレイ', en: 'Play Again' },
  'gameover.ranking': { ja: 'ランキング', en: 'Ranking' },
  'gameover.close': { ja: '閉じる', en: 'Close' },
  'gameover.score_adj': { ja: 'スコア修正', en: 'Score Adjustments' },
  'gameover.bankrupt': { ja: '倒産', en: 'Bankrupt' },
  'gameover.ipo': { ja: 'IPO達成', en: 'IPO Achieved' },
  'gameover.mna': { ja: 'M&A成立', en: 'M&A Complete' },
  'gameover.continue': { ja: '継続経営', en: 'Continuing Operations' },

  // Tutorial
  'tutorial.skip': { ja: 'スキップ', en: 'Skip' },
  'tutorial.back': { ja: '戻る', en: 'Back' },
  'tutorial.next': { ja: '次へ', en: 'Next' },
  'tutorial.start': { ja: 'ゲーム開始！', en: 'Start Game!' },

  // Advisor
  'advisor.title': { ja: '経営アドバイザー', en: 'Strategic Advisor' },
  'advisor.btn': { ja: '💡 アドバイス', en: '💡 Advice' },

  // Common
  'common.hire': { ja: '採用', en: 'Hire' },
  'common.fire': { ja: '解雇', en: 'Fire' },
  'common.ok': { ja: '了解', en: 'OK' },
  'common.month': { ja: '月', en: 'month' },
  'common.year': { ja: '年', en: 'year' },
};

export function t(key: string): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[currentLang] || entry.ja;
}

// Quick format helper
export function tpl(key: string, vars: Record<string, string | number>): string {
  let str = t(key);
  for (const [k, v] of Object.entries(vars)) {
    str = str.replace(`{${k}}`, String(v));
  }
  return str;
}
