import { GameEvent } from '../../types';

export const fundingEvents: GameEvent[] = [
  { id: 'fe_good_impression', title: 'VC面談で好印象', description: 'トップティアVCとの面談で好感触。「ぜひ次のラウンドをリードしたい」とのフィードバック。', category: 'external', severity: 'positive', conditions: { minMonth: 6, probability: 0.06 },
    autoEffect: { brandDelta: 10, moraleDelta: 5, message: 'VCから好評価。次回調達に弾み' },
  },
  { id: 'fe_dd_issue', title: 'デューデリで問題発覚', description: '投資家のデューデリジェンスで技術負債と財務管理の甘さが指摘された。対応に時間がかかりそうだ。', category: 'external', severity: 'negative', conditions: { minMonth: 12, probability: 0.06 },
    autoEffect: { moraleDelta: -8, techDebtDelta: 3, message: 'DD指摘事項への対応が必要。調達が遅延する可能性' },
  },
  { id: 'fe_lead_exit', title: 'リードインベスター離脱', description: 'ラウンドをリードする予定だったVCが突然撤退。投資委員会で否決されたらしい。', category: 'external', severity: 'critical', conditions: { minMonth: 12, probability: 0.04 },
    autoEffect: { moraleDelta: -15, brandDelta: -5, message: 'リード投資家が離脱。ラウンドの組み直しが必要' },
  },
  { id: 'fe_down_round', title: 'ダウンラウンド提示', description: '投資家から前回より低いバリュエーションでの出資を提案された。受けるか、別の道を探すか。', category: 'external', severity: 'negative', conditions: { minMonth: 18, probability: 0.05 },
    choices: [
      { label: 'ダウンラウンドを受け入れ', description: '生存を優先する', effect: { cash: 500000, moraleDelta: -10, message: 'ダウンラウンドで調達。希薄化は厳しいが生き延びた' } },
      { label: 'ブリッジローンで凌ぐ', description: '¥200Kの借入で時間を稼ぐ', effect: { cash: 200000, message: 'ブリッジローンで半年の猶予を確保' } },
    ],
  },
  { id: 'fe_cvc_offer', title: 'CVC（事業会社VC）からの提案', description: '大手事業会社のCVCから出資の打診。資金に加えて事業提携も提案されているが、独立性への懸念も。', category: 'external', severity: 'neutral', conditions: { minMonth: 12, probability: 0.05 },
    choices: [
      { label: '提携を受ける', description: '資金+大企業のリソース', effect: { cash: 300000, customersDelta: 10, brandDelta: 5, message: 'CVC出資を受け入れ。大企業との提携が実現' } },
      { label: '独立性を優先', description: '事業の自由度を守る', effect: { moraleDelta: 5, message: '独立性を守る判断。チームの結束が強まった' } },
    ],
  },
  { id: 'fe_angel_intro', title: 'エンジェル投資家からの紹介', description: '業界の重鎮から「面白い会社がある」と紹介された。少額だが強力なメンター+投資家になる可能性。', category: 'external', severity: 'positive', conditions: { minMonth: 3, probability: 0.07 },
    autoEffect: { cash: 50000, brandDelta: 8, moraleDelta: 5, message: 'エンジェル投資家を獲得。メンタリングと人脈が財産に' },
  },
  { id: 'fe_convertible', title: '転換社債の提案', description: 'バリュエーション交渉を先送りできる転換社債（コンバーティブルノート）の提案。手軽だがリスクも。', category: 'external', severity: 'neutral', conditions: { minMonth: 6, probability: 0.05 },
    choices: [
      { label: '転換社債で調達', description: '迅速に¥300Kを確保', effect: { cash: 300000, message: 'コンバーティブルノートで資金調達。次回ラウンドで転換予定' } },
      { label: 'エクイティ調達を待つ', description: '正式なラウンドを組成する', effect: { message: '転換社債は見送り。正式ラウンドの準備を進める' } },
    ],
  },
  { id: 'fe_shareholder_conflict', title: '株主間契約のトラブル', description: '既存株主と新規投資家の間で条件が折り合わない。優先株の清算優先順位を巡って紛糾。', category: 'external', severity: 'negative', conditions: { minMonth: 18, probability: 0.04 },
    autoEffect: { moraleDelta: -8, message: '株主間のトラブル発生。法務対応に時間とコストが必要' },
  },
  { id: 'fe_foreign_vc', title: '海外VCからの打診', description: 'シリコンバレーの有名VCから連絡。バリュエーションは高めだが、英語でのボードミーティングと四半期レポートが必要。', category: 'external', severity: 'positive', conditions: { minMonth: 18, minMrr: 100000, probability: 0.04 },
    choices: [
      { label: '海外VCと組む', description: 'グローバルな成長を目指す', effect: { cash: 1000000, brandDelta: 20, moraleDelta: -3, message: '海外VCからの大型出資。グローバル経営への一歩' } },
      { label: '国内VCを優先', description: '地理的な近さを重視', effect: { brandDelta: 5, message: '国内VCとの関係を優先。安定的な経営を選択' } },
    ],
  },
  { id: 'fe_crowdfunding', title: 'クラウドファンディングの選択肢', description: 'エクイティ型クラウドファンディングという選択肢が浮上。資金調達とマーケティング効果を同時に狙えるが、株主数が増えるリスクも。', category: 'external', severity: 'neutral', conditions: { minMonth: 6, probability: 0.04 },
    choices: [
      { label: 'クラファンを実施', description: '資金+ファンコミュニティ獲得', effect: { cash: 150000, customersDelta: 5, brandDelta: 10, message: 'クラウドファンディング成功。熱烈なファン層を獲得' } },
      { label: '見送る', description: '株主管理の負荷を避ける', effect: { message: 'クラファンは見送り。従来の調達路線を維持' } },
    ],
  },
];
