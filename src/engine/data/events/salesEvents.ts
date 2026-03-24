import { GameEvent } from '../../types';

export const salesEvents: GameEvent[] = [
  { id: 'se_enterprise_win', title: '大型エンタープライズ契約獲得', description: '東証プライム上場企業との年間¥2M契約が決定。導入事例としても活用でき、ブランド力が大幅に向上。', category: 'customer', severity: 'positive', conditions: { minMonth: 12, minMrr: 30000, probability: 0.05 },
    autoEffect: { mrrMultiplier: 1.08, brandDelta: 15, moraleDelta: 10, npsDelta: 3, message: '大型エンタープライズ契約を獲得！ARR大幅増+導入事例化' },
  },
  { id: 'se_major_churn', title: '主要顧客の解約通知', description: '売上の15%を占める主要顧客が解約を通知。原因は「社内方針の変更」とのこと。', category: 'customer', severity: 'critical', conditions: { minMonth: 6, minCustomers: 20, probability: 0.06 },
    choices: [
      { label: '経営層に直接アプローチ', description: 'CEO自ら訪問して引き留め', effect: { moraleDelta: -3, churnDelta: -0.3, message: 'CEO訪問で解約を3ヶ月延期に成功。根本解決を急ぐ' } },
      { label: '解約を受け入れ、他顧客に注力', description: '顧客集中リスクを軽減する好機', effect: { mrrMultiplier: 0.92, brandDelta: -3, message: '主要顧客が離脱。痛いが、顧客分散が進んだ' } },
    ],
  },
  { id: 'se_cs_success', title: 'CS施策でNRR大幅改善', description: 'カスタマーサクセスチームのオンボーディング改善が奏功。既存顧客のアップセル率が2倍に。', category: 'customer', severity: 'positive', conditions: { minMonth: 12, minCustomers: 30, probability: 0.06 },
    autoEffect: { npsDelta: 8, churnDelta: -0.5, mrrMultiplier: 1.05, message: 'CS施策が大成功。NRR（売上維持率）が120%超に改善' },
  },
  { id: 'se_price_hike_reaction', title: '値上げへの反応', description: '先月実施した値上げに対して、顧客から様々な反応が届いている。満足している声と不満の声が混在。', category: 'customer', severity: 'neutral', conditions: { minMonth: 6, probability: 0.05 },
    choices: [
      { label: '既存顧客は旧価格で据え置き', description: 'グランドファザリング適用', effect: { npsDelta: 5, mrrMultiplier: 0.98, message: '既存顧客の据え置きで解約を抑止。新規のみ新価格' } },
      { label: '全顧客に新価格を適用', description: '公平性を重視', effect: { churnDelta: 0.5, mrrMultiplier: 1.05, message: '一律値上げ。短期チャーン増だがARPU改善' } },
    ],
  },
  { id: 'se_case_study_media', title: '導入事例がメディアに掲載', description: '大手ビジネスメディアにあなたの顧客企業の導入事例が掲載された。問い合わせが急増。', category: 'customer', severity: 'positive', conditions: { minMonth: 6, minCustomers: 10, probability: 0.06 },
    autoEffect: { customersDelta: 12, cacMultiplier: 0.6, brandDelta: 15, message: 'メディア掲載でリード急増！過去最高の問い合わせ数' },
  },
  { id: 'se_customer_lawsuit', title: '顧客からの訴訟', description: '顧客企業がサービス品質の問題を理由に損害賠償を求めて訴訟を起こした。', category: 'customer', severity: 'critical', conditions: { minMonth: 18, minCustomers: 50, probability: 0.03 },
    choices: [
      { label: '和解で解決', description: '¥200Kの和解金で早期解決', effect: { cash: -200000, brandDelta: -5, message: '和解で訴訟終了。守秘義務付き' } },
      { label: '法廷で戦う', description: '弁護士費用¥80K、長期戦の覚悟', effect: { cash: -80000, moraleDelta: -8, message: '法廷闘争を選択。判決まで事業に暗雲' } },
    ],
  },
  { id: 'se_mega_comp', title: '大型コンペ参加', description: '某上場企業グループの全社導入コンペに招待された。勝てば年間¥5Mの大型契約。', category: 'customer', severity: 'neutral', conditions: { minMonth: 12, minMrr: 50000, probability: 0.05 },
    choices: [
      { label: '全力でコンペに臨む', description: '2ヶ月間、セールスチームが専念', effect: { mrrMultiplier: 1.12, moraleDelta: 5, brandDelta: 10, message: 'コンペに勝利！大型契約を獲得し、業界での存在感が増した' } },
      { label: '辞退する', description: 'リソースの浪費リスクを回避', effect: { message: 'コンペは辞退。既存顧客の深堀りに集中' } },
    ],
  },
  { id: 'se_global_inquiry', title: '海外企業からの導入打診', description: '海外の大手企業から「日本語以外にも対応できないか？」という問い合わせが来ている。', category: 'customer', severity: 'positive', conditions: { minMonth: 12, minMrr: 50000, probability: 0.05 },
    choices: [
      { label: '英語対応を開始', description: '¥100Kの投資でi18n対応', effect: { cash: -100000, customersDelta: 5, brandDelta: 10, message: '英語対応を開始。グローバル市場への扉が開いた' } },
      { label: '国内に集中', description: 'まだ早いと判断', effect: { message: '海外対応は見送り。国内市場の深掘りを優先' } },
    ],
  },
  { id: 'se_partner_deal', title: 'パートナー企業との提携成立', description: '大手コンサルティングファームが自社サービスの推奨パートナーとしてあなたの会社を選定した。', category: 'customer', severity: 'positive', conditions: { minMonth: 12, probability: 0.05 },
    autoEffect: { cacMultiplier: 0.7, customersDelta: 8, brandDelta: 10, message: 'パートナー提携成立！新たな販売チャネルを獲得' },
  },
  { id: 'se_exhibition', title: '展示会で大反響', description: 'SaaS業界最大のカンファレンスに出展。ブースには行列ができ、名刺交換だけで200枚超。', category: 'customer', severity: 'positive', conditions: { minMonth: 6, probability: 0.05 },
    choices: [
      { label: 'フォローアップに全力', description: 'セールスチーム総動員でリード対応', effect: { customersDelta: 15, cacMultiplier: 0.5, moraleDelta: 5, message: '展示会のリードを迅速にフォロー。大量の商談が発生' } },
      { label: '通常ペースで対応', description: '過度な期待はしない', effect: { customersDelta: 5, brandDelta: 5, message: '展示会の効果は限定的だが、ブランド認知は向上' } },
    ],
  },
];
