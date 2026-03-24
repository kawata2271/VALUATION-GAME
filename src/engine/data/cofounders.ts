import { CofounderData } from '../types';

export const cofounders: CofounderData[] = [
  {
    type: 'tech',
    nameJa: '技術共同創業者',
    emoji: '💻',
    description: 'エンジニアリングに強い共同創業者。開発速度と品質が向上。',
    effect: '開発速度+25%, 技術負債蓄積-20%',
  },
  {
    type: 'business',
    nameJa: 'ビジネス共同創業者',
    emoji: '📈',
    description: '営業と資金調達に強い共同創業者。顧客獲得と調達が容易に。',
    effect: '営業力+30%, 調達成功率+20%',
  },
  {
    type: 'domain',
    nameJa: 'ドメインエキスパート',
    emoji: '🎯',
    description: '選択した事業領域の専門家。CAC低下とチャーン率改善。',
    effect: 'CAC-20%, チャーン率-0.5%',
  },
];
