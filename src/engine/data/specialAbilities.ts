import { SpecialAbilityDef } from '../types';

export const SPECIAL_ABILITIES: SpecialAbilityDef[] = [
  // === 営業系 ===
  { id: 'top_sales',    name: 'トップセールス',   description: '売上貢献+30%',                    category: 'sales',      minGrade: 'A' },
  { id: 'negotiator',   name: '交渉の達人',       description: '大型案件の成功率+20%',             category: 'sales',      minGrade: 'B' },
  { id: 'networker',    name: '人脈王',           description: '毎月の新規リード+2',               category: 'sales',      minGrade: 'C' },

  // === 技術系 ===
  { id: 'innovator',    name: '天才エンジニア',    description: '開発速度+50%（個人）',             category: 'tech',       minGrade: 'S' },
  { id: 'debugger',     name: 'バグハンター',     description: '技術負債蓄積速度-30%',             category: 'tech',       minGrade: 'B' },
  { id: 'automator',    name: '自動化マスター',    description: 'インフラコスト-15%',               category: 'tech',       minGrade: 'A' },

  // === 管理系 ===
  { id: 'leader',       name: 'カリスマリーダー',  description: '全社員の能力効果+10%',             category: 'management', minGrade: 'S' },
  { id: 'mentor_ability', name: '育成の鬼',       description: 'C/Dランク社員が毎月少しずつ成長',   category: 'management', minGrade: 'B' },
  { id: 'optimizer',    name: 'コスト最適化',     description: '全体の人件費-5%',                  category: 'management', minGrade: 'A' },

  // === 創造系 ===
  { id: 'visionary',    name: 'ビジョナリー',     description: 'NPS+5、ブランド成長+20%',          category: 'creativity', minGrade: 'S' },
  { id: 'branding',     name: 'ブランド戦略家',   description: 'ブランド認知の上昇速度+30%',        category: 'creativity', minGrade: 'A' },
  { id: 'trendsetter',  name: 'トレンドセッター', description: 'PLG効果+25%',                     category: 'creativity', minGrade: 'B' },

  // === 特殊系 ===
  { id: 'lucky',        name: '強運の持ち主',     description: 'ポジティブイベント発生率+10%',      category: 'special',    minGrade: 'D' },
  { id: 'frugal',       name: '倹約家',           description: '自身の給与要求が常に-15%',         category: 'special',    minGrade: 'D' },
  { id: 'headhunter',   name: 'ヘッドハンター',   description: '次回採用時の候補者ランク+1',        category: 'special',    minGrade: 'A' },
  { id: 'morale_boost', name: 'ムードメーカー',   description: 'チーム士気の自然低下を無効化',       category: 'special',    minGrade: 'C' },
];
