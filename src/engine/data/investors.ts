import { InvestorCharacter } from '../types';

export type InvestorArchetype = InvestorCharacter['archetype'];

interface InvestorTemplate {
  archetype: InvestorArchetype;
  names: string[];
  emoji: string;
  description: string;
}

const templates: InvestorTemplate[] = [
  {
    archetype: 'visionary',
    names: ['Horizon Ventures', 'Dreamscape Capital', 'Moonshot Partners'],
    emoji: '🌟',
    description: '大きなビジョンに投資。メディア露出+20%。報告は月次のみ。',
  },
  {
    archetype: 'metrics',
    names: ['DataDriven Capital', 'KPI Partners', 'Quantis Ventures'],
    emoji: '📊',
    description: '数字が全て。週次KPIレポートを要求。財務規律が向上。',
  },
  {
    archetype: 'operator',
    names: ['Founder Fund', 'Builder Capital', 'Operator Collective'],
    emoji: '🛠️',
    description: '元起業家。経営アドバイスでイベントダメージ-20%。',
  },
  {
    archetype: 'strategic',
    names: ['TechGiant Ventures', 'Enterprise CVC', 'Industry Partners'],
    emoji: '🏢',
    description: '大企業CVC。リード+30%だが、競合制限あり。将来M&A提案の可能性。',
  },
  {
    archetype: 'angel',
    names: ['エンジェル太郎', 'Angel Syndicate', 'Seed Angels'],
    emoji: '👼',
    description: '個人投資家。ボード席なし。他の投資家を紹介してくれる。',
  },
];

export function generateInvestor(archetype?: InvestorArchetype): InvestorCharacter {
  const template = archetype
    ? templates.find(t => t.archetype === archetype)!
    : templates[Math.floor(Math.random() * templates.length)];

  const name = template.names[Math.floor(Math.random() * template.names.length)];

  return {
    id: `inv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name,
    archetype: template.archetype,
    emoji: template.emoji,
    description: template.description,
    satisfaction: 70,
    boardSeat: template.archetype !== 'angel',
  };
}

export const archetypeLabels: Record<InvestorArchetype, string> = {
  visionary: 'ビジョナリーVC',
  metrics: 'メトリクスVC',
  operator: 'オペレーターVC',
  strategic: '戦略投資家',
  angel: 'エンジェル投資家',
};
