import { GameEvent } from '../types';

export const events: GameEvent[] = [
  // ===== 市場イベント =====
  {
    id: 'recession',
    title: '景気後退の波',
    description: 'マクロ経済が冷え込み、企業のIT予算が縮小。顧客の解約率が上昇し、新規獲得も困難に。',
    category: 'market',
    severity: 'negative',
    conditions: { minMonth: 12, probability: 0.08 },
    choices: [
      {
        label: 'コスト削減モード',
        description: 'バーンレートを抑え、嵐をやり過ごす',
        effect: { cash: -30000, churnDelta: 0.5, cacMultiplier: 1.2, moraleDelta: -5, message: 'コスト削減で耐え凌ぐ方針に' },
      },
      {
        label: '逆張り投資',
        description: '競合が縮小する今こそ攻める',
        effect: { cash: -50000, cacMultiplier: 0.8, brandDelta: 10, message: '逆張りで市場シェアを奪いに行く' },
      },
    ],
  },
  {
    id: 'ai_boom',
    title: 'AI革命の到来',
    description: '生成AIブームが到来。AI機能を持つSaaSの評価額が急上昇。',
    category: 'market',
    severity: 'neutral',
    conditions: { minMonth: 6, probability: 0.06 },
    choices: [
      {
        label: 'AI機能に全振り',
        description: '開発リソースをAI機能に集中する',
        effect: { cash: -120000, techDebtDelta: 10, brandDelta: 15, npsDelta: 5, customersDelta: 8, message: 'AI機能の開発を加速。市場の注目を集める' },
      },
      {
        label: '静観する',
        description: 'ブームに踊らされず、着実に進む',
        effect: { moraleDelta: -3, message: 'AIブームを静観。堅実路線を維持' },
      },
    ],
  },
  {
    id: 'tech_layoffs',
    title: 'テックレイオフの波',
    description: '大手テック企業が大規模レイオフを実施。優秀な人材が市場に溢れている。',
    category: 'market',
    severity: 'positive',
    conditions: { minMonth: 8, probability: 0.07 },
    autoEffect: { cash: -20000, moraleDelta: -3, message: '業界全体が不安定だが、採用のチャンス。次の採用コストが30%低下。' },
  },

  // ===== 競合イベント =====
  {
    id: 'big_tech_entry',
    title: '大手テック企業が参入',
    description: 'Google/Microsoft/Amazonが同じ領域で新サービスを発表。市場に激震が走る。',
    category: 'competitor',
    severity: 'critical',
    conditions: { minMonth: 12, minMrr: 50000, probability: 0.06 },
    choices: [
      {
        label: 'ニッチに深堀り',
        description: '特定業界に特化して差別化する',
        effect: { cash: -50000, cacMultiplier: 0.9, npsDelta: 5, message: 'ニッチ戦略で差別化に成功' },
      },
      {
        label: '正面対決',
        description: 'マーケティングを強化して対抗',
        effect: { cash: -100000, brandDelta: 10, cacMultiplier: 1.3, message: '大手との正面対決を選択' },
      },
      {
        label: '統合戦略',
        description: '大手のエコシステムに乗る',
        effect: { cash: -40000, cacMultiplier: 0.7, npsDelta: 3, churnDelta: -0.3, customersDelta: 5, message: '大手プラットフォームとの統合で共存路線' },
      },
    ],
  },
  {
    id: 'competitor_funding',
    title: '競合が大型調達',
    description: '主要競合が$50Mの大型ラウンドを完了。マーケティング攻勢が予想される。',
    category: 'competitor',
    severity: 'negative',
    conditions: { minMonth: 6, probability: 0.1 },
    autoEffect: { cash: -30000, cacMultiplier: 1.2, churnDelta: 0.3, customersDelta: -3, message: '競合の資金力が増大。CAC上昇圧力。' },
  },
  {
    id: 'competitor_collapse',
    title: '競合が自滅',
    description: '主要競合で大規模障害が発生。信頼を失った顧客が流出中。',
    category: 'competitor',
    severity: 'positive',
    conditions: { minMonth: 6, probability: 0.05 },
    autoEffect: { customersDelta: 15, cacMultiplier: 0.6, brandDelta: 5, message: '競合の失敗で顧客が流入！' },
  },

  // ===== 内部イベント =====
  {
    id: 'key_employee_quit',
    title: 'エースエンジニアの退職',
    description: 'チームの中心メンバーが退職を申し出た。引き留めるか、送り出すか。',
    category: 'internal',
    severity: 'negative',
    conditions: { minTeamSize: 3, probability: 0.08 },
    choices: [
      {
        label: 'カウンターオファー',
        description: '給与30%アップで引き留める',
        effect: { cash: -30000, moraleDelta: 5, message: 'カウンターオファーで引き留めに成功' },
      },
      {
        label: '送り出す',
        description: '感謝を伝え、新たな挑戦を応援する',
        effect: { cash: -60000, moraleDelta: -10, techDebtDelta: 5, message: 'エースが去り、チームに動揺が走る' },
      },
    ],
  },
  {
    id: 'burnout_wave',
    title: 'バーンアウトの蔓延',
    description: 'チームの疲弊が限界に。生産性が大幅に低下している。',
    category: 'internal',
    severity: 'negative',
    conditions: { minMonth: 6, minTeamSize: 5, probability: 0.07 },
    choices: [
      {
        label: '全社オフサイト実施',
        description: '¥50Kでチームリトリートを開催',
        effect: { cash: -50000, moraleDelta: 25, npsDelta: 3, message: 'オフサイトでチームが再活性化！' },
      },
      {
        label: '個別面談で対応',
        description: 'コストを抑えて1on1で対応',
        effect: { cash: -10000, moraleDelta: 10, message: '面談で少し改善。根本解決にはなっていないが...' },
      },
    ],
  },
  {
    id: 'star_candidate',
    title: 'スター候補からの応募',
    description: 'FAANG出身の超優秀な人材が入社を希望している。ただし高給を要求。',
    category: 'internal',
    severity: 'positive',
    conditions: { minMonth: 3, probability: 0.06 },
    choices: [
      {
        label: '採用する',
        description: '年俸$200Kだが、チーム全体の底上げに',
        effect: { cash: -200000, moraleDelta: 10, techDebtDelta: -5, npsDelta: 3, message: 'スター人材がチームに加入！' },
      },
      {
        label: '見送る',
        description: '今のチームのバランスを重視',
        effect: { message: '惜しい人材だったが、タイミングが合わなかった' },
      },
    ],
  },

  // ===== プロダクトイベント =====
  {
    id: 'major_outage',
    title: '大規模サービス障害',
    description: 'プロダクションで重大な障害が発生。顧客のデータにアクセスできない状態が続いている。',
    category: 'product',
    severity: 'critical',
    conditions: { minMonth: 3, probability: 0.08 },
    choices: [
      {
        label: '即座に全力対応',
        description: '全エンジニアを投入して復旧',
        effect: { cash: -30000, npsDelta: -10, moraleDelta: -10, techDebtDelta: 5, message: '4時間で復旧。信頼回復に努める' },
      },
      {
        label: '段階的に対応',
        description: '影響範囲を限定し、計画的に復旧',
        effect: { cash: -50000, npsDelta: -15, churnDelta: 0.5, techDebtDelta: 3, customersDelta: -3, message: '復旧に12時間。一部顧客が不満' },
      },
    ],
  },
  {
    id: 'security_breach',
    title: 'セキュリティ脆弱性発見',
    description: 'セキュリティ研究者から脆弱性の報告。顧客データが露出するリスクがある。',
    category: 'product',
    severity: 'critical',
    conditions: { minMonth: 6, probability: 0.06 },
    choices: [
      {
        label: '即座にパッチ適用',
        description: '開発を止めて緊急対応',
        effect: { cash: -40000, techDebtDelta: -3, npsDelta: -5, brandDelta: 5, message: '迅速な対応で信頼を維持' },
      },
      {
        label: '次のリリースで対応',
        description: '現在の開発を優先',
        effect: { cash: -100000, npsDelta: -20, churnDelta: 1.0, brandDelta: -20, customersDelta: -8, message: '対応の遅れがメディアに取り上げられ大炎上' },
      },
    ],
  },
  {
    id: 'unexpected_usecase',
    title: '想定外のユースケース発見',
    description: '顧客が予想もしない使い方をしている。新しい市場機会の可能性。',
    category: 'product',
    severity: 'positive',
    conditions: { minMonth: 6, minCustomers: 20, probability: 0.07 },
    autoEffect: { cash: 30000, npsDelta: 5, brandDelta: 5, customersDelta: 5, message: '新しいユースケースが口コミで広がり始めた！' },
  },

  // ===== 顧客イベント =====
  {
    id: 'big_deal',
    title: '大口契約の機会',
    description: 'Fortune 500企業からの引き合い。年間$120K契約の可能性。ただしカスタム機能を要求。',
    category: 'customer',
    severity: 'positive',
    conditions: { minMonth: 6, probability: 0.08 },
    choices: [
      {
        label: '受注する',
        description: 'カスタム開発を引き受けてでも獲得',
        effect: { cash: 200000, mrrMultiplier: 1.05, techDebtDelta: 8, moraleDelta: -5, customersDelta: 1, message: '大口契約を獲得！ただしカスタム開発の負荷が...' },
      },
      {
        label: '標準プランを提案',
        description: 'カスタムはせず、標準機能で勝負',
        effect: { cash: 80000, mrrMultiplier: 1.02, brandDelta: 3, customersDelta: 1, message: '標準プランで契約成立。ブランド力向上' },
      },
      {
        label: '見送る',
        description: '今のフェーズでは対応できない',
        effect: { moraleDelta: -3, message: '大口案件を見送り。チームはやや残念がっている' },
      },
    ],
  },
  {
    id: 'churn_wave',
    title: '解約の波',
    description: '今月、複数の顧客から解約通知が届いている。原因を調査する必要がある。',
    category: 'customer',
    severity: 'negative',
    conditions: { minMonth: 4, minCustomers: 10, probability: 0.1 },
    choices: [
      {
        label: '緊急CSミーティング',
        description: '顧客一人ひとりに連絡して引き留め',
        effect: { cash: -20000, churnDelta: -0.5, moraleDelta: -5, message: '一部の顧客を引き留めに成功' },
      },
      {
        label: '割引を提案',
        description: '20%割引で継続を促す',
        effect: { cash: -30000, churnDelta: -0.8, mrrMultiplier: 0.97, customersDelta: 2, message: '割引で多くの顧客が残留。ただしARPU低下' },
      },
    ],
  },
  {
    id: 'viral_moment',
    title: 'バイラルの瞬間',
    description: 'インフルエンサーがプロダクトを絶賛するツイートを投稿。フォロワー10万人にリーチ。',
    category: 'customer',
    severity: 'positive',
    conditions: { minMonth: 3, probability: 0.05 },
    autoEffect: { customersDelta: 20, brandDelta: 15, cacMultiplier: 0.5, message: 'バイラル！新規問い合わせが殺到！' },
  },

  // ===== 外部イベント =====
  {
    id: 'regulation_change',
    title: 'データ保護規制強化',
    description: '新しいデータ保護法が施行される。対応にはセキュリティ機能の強化が必要。',
    category: 'external',
    severity: 'negative',
    conditions: { minMonth: 12, probability: 0.07 },
    choices: [
      {
        label: '即座に対応',
        description: '¥80Kかけてコンプライアンス対応',
        effect: { cash: -80000, brandDelta: 10, npsDelta: 3, message: '迅速な規制対応でエンタープライズからの信頼UP' },
      },
      {
        label: '最低限の対応',
        description: '¥20Kで最低限の対応',
        effect: { cash: -20000, churnDelta: 0.3, message: '最低限の対応。一部顧客から不安の声' },
      },
    ],
  },
  {
    id: 'conference_invite',
    title: 'テックカンファレンス登壇招待',
    description: '有名テックカンファレンスから登壇の招待。大きなPR機会だが、準備に時間がかかる。',
    category: 'external',
    severity: 'positive',
    conditions: { minMonth: 6, probability: 0.08 },
    choices: [
      {
        label: '登壇する',
        description: '1週間の準備時間を投資',
        effect: { cash: -30000, brandDelta: 20, customersDelta: 10, cacMultiplier: 0.7, message: 'カンファレンスで大きな反響！リード急増' },
      },
      {
        label: '辞退する',
        description: '今はプロダクトに集中',
        effect: { message: '登壇を辞退。開発に集中' },
      },
    ],
  },
  {
    id: 'patent_troll',
    title: '特許トロール訴訟',
    description: '特許トロールから訴訟通知。和解金$150Kを要求されている。',
    category: 'external',
    severity: 'negative',
    conditions: { minMonth: 12, minMrr: 30000, probability: 0.05 },
    choices: [
      {
        label: '和解する',
        description: '¥100Kで早期和解',
        effect: { cash: -100000, message: '和解金を支払い、訴訟から解放' },
      },
      {
        label: '戦う',
        description: '¥50Kの弁護士費用で法廷闘争',
        effect: { cash: -50000, moraleDelta: -5, brandDelta: 5, message: '法廷で勝訴！業界から称賛の声' },
      },
    ],
  },
];
