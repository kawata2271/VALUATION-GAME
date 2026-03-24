import { GameEvent } from '../../types';

export const productEvents: GameEvent[] = [
  { id: 'pe_security_incident', title: '重大セキュリティインシデント', description: '顧客データに不正アクセスの形跡が発見された。即座に対応しないと信頼は取り返しのつかないダメージを受ける。', category: 'product', severity: 'critical', conditions: { minMonth: 12, minCustomers: 30, probability: 0.04 },
    choices: [
      { label: '全顧客に即時通知+対策', description: '透明性を最優先に', effect: { cash: -100000, npsDelta: -10, brandDelta: 5, churnDelta: 0.5, message: '迅速かつ誠実な対応で信頼回復への第一歩を踏み出した' } },
      { label: '内部対応のみ', description: '公表せず静かに修正', effect: { cash: -30000, npsDelta: -5, brandDelta: -15, churnDelta: 1.5, message: '非公表で対応したが、後日リークされるリスクが残る' } },
    ],
  },
  { id: 'pe_competitor_feature', title: '競合が類似機能をリリース', description: '主要競合があなたの差別化機能とほぼ同じ機能をリリースした。顧客から「違いは何？」と聞かれることが増えている。', category: 'competitor', severity: 'negative', conditions: { minMonth: 6, probability: 0.08 },
    choices: [
      { label: '次世代機能で差別化', description: '¥80Kの追加投資で一歩先へ', effect: { cash: -80000, npsDelta: 5, techDebtDelta: 5, message: '次世代機能で再び差別化に成功' } },
      { label: 'UXとサポートで勝負', description: '機能ではなく体験で差別化', effect: { cash: -30000, npsDelta: 8, moraleDelta: 3, message: 'UXとカスタマーサクセスの質で差別化' } },
    ],
  },
  { id: 'pe_patent_suit', title: '特許侵害の訴訟', description: '特許トロールから訴訟通知が届いた。あなたのコア機能が特許を侵害していると主張している。', category: 'external', severity: 'negative', conditions: { minMonth: 12, minMrr: 30000, probability: 0.04 },
    choices: [
      { label: '和解金を支払う', description: '¥150Kで早期決着', effect: { cash: -150000, message: '和解で訴訟終了。事業に集中できる' } },
      { label: '法廷で戦う', description: '¥80Kの弁護士費用+時間', effect: { cash: -80000, moraleDelta: -5, brandDelta: 8, message: '法廷闘争を選択。勝てば特許無効化+PR効果' } },
    ],
  },
  { id: 'pe_tech_debt_crisis', title: '技術的負債の臨界点', description: 'デプロイが週に3回失敗し、本番障害も頻発。エンジニアチームから「このままでは限界」と直訴があった。', category: 'product', severity: 'critical', conditions: { minMonth: 12, probability: 0.06 },
    choices: [
      { label: '3ヶ月のリファクタリング', description: '新機能開発を止めて根本対応', effect: { cash: -120000, techDebtDelta: -30, npsDelta: -5, moraleDelta: 10, message: '3ヶ月のリファクタリングで技術基盤を再構築' } },
      { label: '応急処置で凌ぐ', description: '最低限の修正で開発を継続', effect: { cash: -25000, techDebtDelta: -5, moraleDelta: -10, message: '応急処置でなんとか回しているが、爆弾を抱えた状態' } },
    ],
  },
  { id: 'pe_ai_opportunity', title: 'AI活用の大チャンス', description: '最新のAI技術を活用すれば、プロダクトの価値を10倍にできる可能性がある。ただし開発投資は大きい。', category: 'product', severity: 'positive', conditions: { minMonth: 6, probability: 0.06 },
    choices: [
      { label: 'AI機能に大型投資', description: '¥200K + エンジニア2名専任', effect: { cash: -200000, techDebtDelta: 8, npsDelta: 12, brandDelta: 15, message: 'AI機能がキラーフィーチャーに。メディアからも注目' } },
      { label: '小規模に実験', description: 'PoCレベルで検証', effect: { cash: -40000, npsDelta: 3, brandDelta: 5, message: 'AI PoCで手応えあり。段階的に拡大予定' } },
    ],
  },
  { id: 'pe_major_update', title: '大型アップデート大成功', description: '半年かけた大型アップデートが大好評。TwitterでもトレンドXに入り、既存顧客のNPSが急上昇。', category: 'product', severity: 'positive', conditions: { minMonth: 12, probability: 0.05 },
    autoEffect: { npsDelta: 15, brandDelta: 15, customersDelta: 15, moraleDelta: 10, message: '大型アップデートが大反響！口コミで新規流入も急増' },
  },
  { id: 'pe_downtime', title: '大規模障害（SLA違反）', description: '4時間以上のダウンタイムが発生。エンタープライズ顧客のSLAに違反し、返金対応が必要に。', category: 'product', severity: 'critical', conditions: { minMonth: 6, minCustomers: 20, probability: 0.06 },
    choices: [
      { label: '全額返金+再発防止策を公表', description: '信頼回復を最優先', effect: { cash: -50000, npsDelta: -8, brandDelta: 5, message: '誠実な対応で一定の信頼を維持。ポストモーテムを公開' } },
      { label: '影響範囲の顧客のみ対応', description: 'コストを最小限に', effect: { cash: -20000, npsDelta: -15, churnDelta: 1.0, message: '限定的な対応に批判の声。SNSで炎上リスクも' } },
    ],
  },
  { id: 'pe_oss_threat', title: 'OSS代替品が急成長', description: 'あなたのプロダクトの無料OSS代替品がGitHubで★10,000を突破。開発者コミュニティで話題に。', category: 'competitor', severity: 'negative', conditions: { minMonth: 12, minCustomers: 30, probability: 0.05 },
    choices: [
      { label: 'エンタープライズ機能で差別化', description: 'OSSにはないセキュリティ/管理機能', effect: { cash: -80000, npsDelta: 3, brandDelta: 5, customersDelta: 3, message: 'エンタープライズ機能で有料の価値を証明' } },
      { label: 'OSSに貢献して共存', description: 'コミュニティに参加して存在感を示す', effect: { cash: -30000, brandDelta: 15, customersDelta: -5, message: 'OSS貢献でブランド向上。一部流出は受け入れ' } },
    ],
  },
  { id: 'pe_api_change', title: '主要APIの仕様変更', description: '主要連携先プラットフォームがAPI仕様を大幅変更。対応しないと連携が止まり、顧客に影響が出る。', category: 'product', severity: 'negative', conditions: { minMonth: 6, probability: 0.06 },
    autoEffect: { cash: -40000, techDebtDelta: 5, moraleDelta: -5, message: '主要API仕様変更への緊急対応が必要に' },
  },
  { id: 'pe_patent_success', title: '特許取得成功', description: 'コア技術の特許取得に成功。競争優位性が法的に保護され、バリュエーションにもプラス。', category: 'product', severity: 'positive', conditions: { minMonth: 18, probability: 0.04 },
    autoEffect: { brandDelta: 10, npsDelta: 3, moraleDelta: 5, message: '特許取得成功！知的財産による競争優位を確立' },
  },
];
