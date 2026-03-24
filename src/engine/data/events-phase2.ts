import { GameEvent } from '../types';

export const phase2Events: GameEvent[] = [
  // ===== 組織の壁イベント =====
  {
    id: 'org_wall_5',
    title: '5人の壁',
    description: 'チームが5人を超え、コミュニケーションコストが増大している。役割分担を明確にする必要がある。',
    category: 'internal',
    severity: 'negative',
    conditions: { minTeamSize: 5, probability: 0.5 },
    choices: [
      {
        label: 'PM を採用して組織化',
        description: '明確な役割分担を作る',
        effect: { moraleDelta: 10, message: '組織化に成功。チームの生産性が向上した' },
      },
      {
        label: '今のまま続ける',
        description: 'まだ大丈夫だと判断',
        effect: { moraleDelta: -8, message: '混乱が続き、チーム士気が低下' },
      },
    ],
  },
  {
    id: 'org_wall_15',
    title: '15人の壁',
    description: '部署間の断絶が生まれ始めている。「隣のチームが何をしているか分からない」という声が聞こえてくる。',
    category: 'internal',
    severity: 'negative',
    conditions: { minTeamSize: 15, probability: 0.5 },
    choices: [
      {
        label: '組織構造を再定義',
        description: 'チーム構成と報告ラインを整理',
        effect: { moraleDelta: 15, cash: -30000, message: '組織再編に成功。情報共有が改善された' },
      },
      {
        label: 'COOを採用',
        description: '組織運営のプロを迎える',
        effect: { moraleDelta: 10, message: 'COO採用で組織課題に着手' },
      },
      {
        label: '放置する',
        description: 'プロダクト優先で組織課題は後回し',
        effect: { moraleDelta: -15, techDebtDelta: 5, message: '組織の断絶が深刻化...' },
      },
    ],
  },
  {
    id: 'org_wall_30',
    title: '30人の壁',
    description: '創業者がボトルネックになっている。全ての意思決定が創業者を経由しており、組織のスピードが落ちている。',
    category: 'internal',
    severity: 'negative',
    conditions: { minTeamSize: 30, probability: 0.6 },
    choices: [
      {
        label: '権限委譲を進める',
        description: 'VP層に意思決定権を移す',
        effect: { moraleDelta: 15, brandDelta: 5, message: '権限委譲に成功。組織が自律的に動き始めた' },
      },
      {
        label: '自分で管理し続ける',
        description: 'まだ自分がやった方が早い',
        effect: { moraleDelta: -20, npsDelta: -5, message: '意思決定の遅延が慢性化...' },
      },
    ],
  },
  {
    id: 'org_wall_50',
    title: '50人の壁：文化の危機',
    description: '急成長で企業文化が薄れつつある。新メンバーが「何のために働いているか分からない」と言い始めた。',
    category: 'internal',
    severity: 'critical',
    conditions: { minTeamSize: 50, probability: 0.7 },
    choices: [
      {
        label: 'カルチャーデッキを策定',
        description: 'ミッション・バリューを明文化する ($50K)',
        effect: { cash: -50000, moraleDelta: 20, brandDelta: 10, message: 'カルチャーの再定義に成功。チームが一つにまとまった' },
      },
      {
        label: '全社オフサイトを開催',
        description: '2日間のリトリートでチーム再構築 ($80K)',
        effect: { cash: -80000, moraleDelta: 25, npsDelta: 3, message: 'オフサイトが大成功。チームの絆が深まった' },
      },
      {
        label: '何もしない',
        description: '業務に集中するべき',
        effect: { moraleDelta: -25, message: '文化の崩壊が加速。退職者が増加...' },
      },
    ],
  },

  // ===== 共同創業者イベント =====
  {
    id: 'cofounder_vision_clash',
    title: '共同創業者とビジョンの相違',
    description: '共同創業者と今後の方向性について意見が食い違っている。プロダクトの優先順位を巡る対立が深刻化。',
    category: 'internal',
    severity: 'negative',
    conditions: { minMonth: 6, probability: 0.12 },
    choices: [
      {
        label: '話し合いで解決',
        description: '時間をかけて合意形成を目指す',
        effect: { moraleDelta: -5, message: '話し合いの結果、方向性を再確認。ただし完全には解決せず' },
      },
      {
        label: '持分を買い取る',
        description: '共同創業者の持分を買い取って別れる',
        effect: { cash: -200000, moraleDelta: -15, message: '共同創業者が離脱。株式問題は解決したが、チームに動揺' },
      },
    ],
  },
  {
    id: 'cofounder_poaching',
    title: '共同創業者への引き抜き',
    description: '大手企業から共同創業者に高額オファーが来ている。年俸$500Kのポジション。',
    category: 'internal',
    severity: 'critical',
    conditions: { minMonth: 12, probability: 0.08 },
    choices: [
      {
        label: 'ストックオプション追加で引き留め',
        description: 'オプション2%追加で説得',
        effect: { moraleDelta: 5, message: '共同創業者の引き留めに成功。オプションプール消費' },
      },
      {
        label: '送り出す',
        description: '相手の選択を尊重する',
        effect: { moraleDelta: -20, techDebtDelta: 5, message: '共同創業者が退任。大きな穴が空いた...' },
      },
    ],
  },

  // ===== ボードミーティング的イベント =====
  {
    id: 'board_growth_question',
    title: '投資家からの質問：成長率について',
    description: '投資家から「成長率が鈍化しているが、どう対処するのか」と詰められている。',
    category: 'internal',
    severity: 'neutral',
    conditions: { minMonth: 12, probability: 0.1 },
    choices: [
      {
        label: '攻めの投資を約束',
        description: '採用とマーケティングを強化する',
        effect: { brandDelta: 5, moraleDelta: -3, message: '攻めの姿勢を示し、投資家は一旦納得' },
      },
      {
        label: 'ユニットエコノミクスの改善を提示',
        description: 'LTV/CACの改善データで説得',
        effect: { moraleDelta: 5, message: '数字で丁寧に説明し、投資家の信頼を得た' },
      },
      {
        label: '新製品のビジョンを発表',
        description: 'マルチプロダクト戦略を提示',
        effect: { brandDelta: 10, message: 'ビジョンに投資家が興奮。次のラウンドに期待' },
      },
    ],
  },
  {
    id: 'board_burn_question',
    title: '投資家からの質問：バーンレートについて',
    description: '「バーンレートが高すぎないか？もっと効率的に成長できるはずだ」',
    category: 'internal',
    severity: 'negative',
    conditions: { minMonth: 6, probability: 0.1 },
    choices: [
      {
        label: '成長投資だと説明',
        description: '今は投資フェーズ',
        effect: { moraleDelta: 3, message: '「成長に必要な投資」として理解を得た' },
      },
      {
        label: 'コスト最適化を約束',
        description: 'バーンレートの削減を約束',
        effect: { moraleDelta: -5, message: 'コスト削減を約束。チームは少し不安に' },
      },
    ],
  },

  // ===== 顧客セグメント関連 =====
  {
    id: 'enterprise_opportunity',
    title: 'エンタープライズ企業からの引き合い',
    description: 'Fortune 100企業のCIOから直接連絡。年間契約$200Kの可能性。ただしSSO、監査ログ、SLAが必須条件。',
    category: 'customer',
    severity: 'positive',
    conditions: { minMonth: 12, minMrr: 20000, probability: 0.08 },
    choices: [
      {
        label: 'インフラ機能を最優先で開発',
        description: 'SSO/セキュリティ機能を急いで作る',
        effect: { techDebtDelta: 10, mrrMultiplier: 1.08, message: '突貫でインフラ機能を実装。大口契約を獲得！' },
      },
      {
        label: '標準プランを提案',
        description: 'カスタム対応はしない',
        effect: { brandDelta: 3, message: '「まだ早い」と判断し、エンタープライズは見送り' },
      },
    ],
  },
  {
    id: 'smb_churn_spike',
    title: 'SMB顧客の解約急増',
    description: '低単価のSMB顧客が一斉に解約通知。「予算削減」が主な理由。',
    category: 'customer',
    severity: 'negative',
    conditions: { minCustomers: 30, probability: 0.1 },
    choices: [
      {
        label: '割引プランを用意',
        description: 'SMB向けの低価格プランを新設',
        effect: { churnDelta: -0.5, mrrMultiplier: 0.95, message: '割引プランで一部引き留めに成功。ただしARPU低下' },
      },
      {
        label: 'アップマーケットにシフト',
        description: 'SMBは諦め、Mid-Market以上に注力',
        effect: { customersDelta: -10, npsDelta: 3, message: 'SMB離反を受け入れ、上位セグメントに集中' },
      },
    ],
  },

  // ===== プライシング関連 =====
  {
    id: 'pricing_pressure',
    title: '値下げプレッシャー',
    description: '競合が大幅値下げを実施。既存顧客から「料金を見直してほしい」という声が増加。',
    category: 'competitor',
    severity: 'negative',
    conditions: { minMonth: 6, minCustomers: 20, probability: 0.08 },
    choices: [
      {
        label: '値下げで対抗',
        description: '価格を20%下げて対抗',
        effect: { churnDelta: -0.5, mrrMultiplier: 0.85, message: '値下げで顧客流出を防いだが、売上に影響' },
      },
      {
        label: '価値で勝負',
        description: '新機能の価値を訴求',
        effect: { churnDelta: 0.3, brandDelta: 5, npsDelta: 3, message: '価値提案で差別化。一部解約は受け入れ' },
      },
      {
        label: '年間契約で囲い込み',
        description: '年間契約に20%割引を適用',
        effect: { churnDelta: -0.8, cash: -20000, message: '年間契約への移行が進み、チャーンが安定化' },
      },
    ],
  },

  // ===== 追加市場イベント =====
  {
    id: 'remote_work_boom',
    title: 'リモートワーク需要爆増',
    description: 'リモートワークの定着で、クラウドツールの需要が急増している。',
    category: 'market',
    severity: 'positive',
    conditions: { minMonth: 6, probability: 0.06 },
    autoEffect: { cacMultiplier: 0.7, customersDelta: 10, brandDelta: 5, message: 'リモートワークブームで需要急増！' },
  },
  {
    id: 'cyber_attack_wave',
    title: 'サイバー攻撃急増',
    description: '業界全体でサイバー攻撃が急増。セキュリティ機能の需要が高まっている。',
    category: 'external',
    severity: 'neutral',
    conditions: { minMonth: 12, probability: 0.07 },
    choices: [
      {
        label: 'セキュリティ投資を強化',
        description: '$100Kでセキュリティ監査と強化',
        effect: { cash: -100000, brandDelta: 15, npsDelta: 5, message: 'セキュリティ強化で企業の信頼性が向上' },
      },
      {
        label: '最低限の対応',
        description: '既存のセキュリティ機能で対応',
        effect: { churnDelta: 0.2, message: '最低限の対応。一部顧客から不安の声' },
      },
    ],
  },
  {
    id: 'talent_war',
    title: '人材獲得戦争',
    description: 'エンジニアの採用市場が過熱。給与水準が業界全体で上昇している。',
    category: 'market',
    severity: 'negative',
    conditions: { minMonth: 6, probability: 0.08 },
    autoEffect: { moraleDelta: -5, message: '人材市場の過熱で採用コストが上昇。既存社員の給与見直し圧力も。' },
  },
  {
    id: 'media_feature',
    title: 'メディア掲載',
    description: '有名テックメディアに取り上げられた！創業ストーリーが注目を集めている。',
    category: 'external',
    severity: 'positive',
    conditions: { minMonth: 3, probability: 0.06 },
    autoEffect: { brandDelta: 20, customersDelta: 8, cacMultiplier: 0.6, message: 'メディア掲載でブランド認知が急上昇！' },
  },
  {
    id: 'competitor_acquihire',
    title: '競合のアクハイヤー',
    description: '競合がテック大手にアクハイヤーされた。市場が一つ空いた。',
    category: 'competitor',
    severity: 'positive',
    conditions: { minMonth: 12, probability: 0.05 },
    autoEffect: { customersDelta: 20, cacMultiplier: 0.7, message: '競合消滅！顧客が流れてきた' },
  },
  {
    id: 'open_source_threat',
    title: 'オープンソース代替品の登場',
    description: '無料のOSS代替品が登場。コミュニティが急成長しており、低価格帯の顧客が流れ始めている。',
    category: 'competitor',
    severity: 'critical',
    conditions: { minMonth: 12, minCustomers: 30, probability: 0.06 },
    choices: [
      {
        label: 'エンタープライズ機能で差別化',
        description: 'OSSにはない高機能を訴求',
        effect: { npsDelta: 5, customersDelta: -5, brandDelta: 5, message: 'エンタープライズ向け機能で差別化成功' },
      },
      {
        label: 'OSSコミュニティに貢献',
        description: '共存路線でブランドを高める',
        effect: { brandDelta: 15, customersDelta: -8, message: 'OSS貢献でブランド向上。一部顧客は流出' },
      },
      {
        label: '値下げで対抗',
        description: '低価格プランで流出を防ぐ',
        effect: { mrrMultiplier: 0.9, churnDelta: -0.5, message: '値下げで一部顧客を引き留め' },
      },
    ],
  },

  // ===== ハッカソン・社内イベント =====
  {
    id: 'hackathon_idea',
    title: '社内ハッカソンで新機能アイデア',
    description: 'エンジニアチームがハッカソンで画期的な機能プロトタイプを作った。顧客からも好評。',
    category: 'internal',
    severity: 'positive',
    conditions: { minTeamSize: 5, probability: 0.06 },
    autoEffect: { moraleDelta: 15, npsDelta: 5, techDebtDelta: 3, message: 'ハッカソンが大成功！チームの士気が急上昇' },
  },
  {
    id: 'glassdoor_review',
    title: '匿名レビューサイトに書き込み',
    description: '元社員が匿名レビューサイトに「経営陣のリーダーシップに問題がある」と投稿。採用候補者も見ている。',
    category: 'internal',
    severity: 'negative',
    conditions: { minTeamSize: 8, probability: 0.07 },
    choices: [
      {
        label: '真摯に受け止めて改善',
        description: 'フィードバックを元に組織改善',
        effect: { moraleDelta: 10, brandDelta: 5, message: '批判を受け止め、改善策を実施。透明性が評価された' },
      },
      {
        label: '無視する',
        description: '匿名の声に振り回されない',
        effect: { moraleDelta: -5, brandDelta: -5, message: '無視した結果、追加の書き込みが...採用に影響' },
      },
    ],
  },
  {
    id: 'embezzlement',
    title: '横領の発覚',
    description: '経理担当者による横領が発覚。被害額は$80K。',
    category: 'internal',
    severity: 'critical',
    conditions: { minMonth: 12, minTeamSize: 10, probability: 0.03 },
    autoEffect: { cash: -80000, moraleDelta: -15, message: '横領が発覚。法的措置を取りつつ、内部統制を強化' },
  },

  // ===== データ関連 =====
  {
    id: 'data_breach',
    title: 'データ漏洩インシデント',
    description: '顧客データの一部が外部に流出した可能性がある。原因を調査中。',
    category: 'product',
    severity: 'critical',
    conditions: { minMonth: 12, minCustomers: 50, probability: 0.05 },
    choices: [
      {
        label: '即座に顧客に通知',
        description: '透明性を優先し、全顧客に通知',
        effect: { cash: -50000, npsDelta: -10, churnDelta: 0.5, brandDelta: 5, message: '迅速な対応で信頼を最小限に保った' },
      },
      {
        label: '内部調査を先行',
        description: '影響範囲を確認してから通知',
        effect: { npsDelta: -20, churnDelta: 1.5, brandDelta: -15, message: '対応の遅れがSNSで拡散。大きなダメージ' },
      },
    ],
  },

  // ===== 政府・規制関連 =====
  {
    id: 'gov_contract',
    title: '政府案件の引き合い',
    description: '政府機関から大口契約の打診。年間$300K。ただしセキュリティ認証が必要。',
    category: 'customer',
    severity: 'positive',
    conditions: { minMonth: 18, minMrr: 50000, probability: 0.05 },
    choices: [
      {
        label: '認証取得して受注',
        description: '$100K + 3ヶ月で認証を取得',
        effect: { cash: -100000, mrrMultiplier: 1.1, brandDelta: 15, message: '政府契約を獲得！信頼性の証明に' },
      },
      {
        label: '見送る',
        description: '民間に集中する',
        effect: { message: '政府案件は見送り。民間市場に集中' },
      },
    ],
  },

  // ===== M&A提案（受ける側） =====
  {
    id: 'acquisition_offer',
    title: 'M&A提案を受ける',
    description: '大手テック企業から買収提案。現在の評価額の1.5倍を提示している。',
    category: 'external',
    severity: 'neutral',
    conditions: { minMonth: 24, minMrr: 100000, probability: 0.06 },
    choices: [
      {
        label: '交渉のテーブルにつく',
        description: '条件を聞いてみる',
        effect: { brandDelta: 10, moraleDelta: -5, message: 'M&A交渉を開始。チームに動揺が広がるが、オプションとして検討' },
      },
      {
        label: '即座に断る',
        description: 'まだ成長の余地がある',
        effect: { moraleDelta: 10, brandDelta: 5, message: '「まだ始まったばかりだ」と断固拒否。チームの士気UP' },
      },
    ],
  },

  // ===== 追加イベント（50種+到達用） =====
  {
    id: 'platform_dependency',
    title: 'プラットフォーム依存リスク',
    description: '主要連携先のAPIが有料化を発表。月額$5Kの追加コストが発生する可能性。',
    category: 'external',
    severity: 'negative',
    conditions: { minMonth: 6, probability: 0.06 },
    choices: [
      { label: '代替APIに移行', description: '3ヶ月かけて自前実装に切り替え', effect: { techDebtDelta: 8, message: '代替実装を開始。3ヶ月間は不安定な状態が続く' } },
      { label: 'コストを受け入れる', description: '月$5Kの追加支出', effect: { cash: -15000, message: '追加コストを受け入れ。安定性を維持' } },
    ],
  },
  {
    id: 'key_customer_case_study',
    title: '導入事例の公開許可',
    description: '有名企業の顧客がケーススタディの公開に同意してくれた。強力なマーケティング素材に。',
    category: 'customer',
    severity: 'positive',
    conditions: { minMonth: 6, minCustomers: 10, probability: 0.08 },
    autoEffect: { brandDelta: 15, cacMultiplier: 0.8, message: '有名企業のケーススタディ公開！リード獲得が加速' },
  },
  {
    id: 'product_hunt_launch',
    title: 'Product Hunt ローンチ',
    description: 'Product Hunt でデイリー1位を獲得！大量のサインアップが来ている。',
    category: 'customer',
    severity: 'positive',
    conditions: { minMonth: 3, probability: 0.04 },
    autoEffect: { customersDelta: 25, brandDelta: 20, moraleDelta: 10, message: 'Product Hunt 1位！サインアップが殺到中' },
  },
  {
    id: 'technical_cofounder_burnout',
    title: '創業者のバーンアウト兆候',
    description: '最近、集中力が続かない。睡眠も不規則になっている。このままでは限界が来る。',
    category: 'internal',
    severity: 'negative',
    conditions: { minMonth: 12, probability: 0.07 },
    choices: [
      { label: '1週間休暇を取る', description: '思い切って休む', effect: { moraleDelta: 15, npsDelta: 2, message: '休暇でリフレッシュ。視野が広がった' } },
      { label: '気合いで乗り切る', description: '今は休んでいる場合じゃない', effect: { moraleDelta: -10, techDebtDelta: 5, message: '無理を続けた結果、判断力が低下...' } },
    ],
  },
  {
    id: 'referral_program_success',
    title: '紹介プログラムが大成功',
    description: '顧客紹介プログラムが予想以上に機能。紹介経由の獲得が全体の30%に。',
    category: 'customer',
    severity: 'positive',
    conditions: { minMonth: 12, minCustomers: 30, probability: 0.06 },
    autoEffect: { cacMultiplier: 0.6, customersDelta: 10, npsDelta: 5, message: '紹介プログラムが大ヒット！CACが大幅低下' },
  },
  {
    id: 'cloud_cost_spike',
    title: 'クラウドコスト急増',
    description: 'AWSの請求額が先月の3倍に。使用量の最適化が急務。',
    category: 'product',
    severity: 'negative',
    conditions: { minMonth: 6, minCustomers: 20, probability: 0.08 },
    choices: [
      { label: 'SREエンジニアに最適化させる', description: '1ヶ月かけてインフラ最適化', effect: { techDebtDelta: -5, message: 'インフラ最適化でコスト30%削減に成功' } },
      { label: 'プランをアップグレード', description: '上位プランでパフォーマンス確保', effect: { cash: -30000, message: '上位プランに移行。コスト増だがパフォーマンスは安定' } },
    ],
  },
  {
    id: 'partnership_offer',
    title: 'パートナーシップ提案',
    description: '大手SaaS企業からマーケットプレイス連携の提案。彼らの顧客基盤にリーチ可能。',
    category: 'external',
    severity: 'positive',
    conditions: { minMonth: 12, minMrr: 10000, probability: 0.06 },
    choices: [
      { label: '連携を進める', description: 'API連携とマーケットプレイス出店', effect: { cacMultiplier: 0.7, brandDelta: 10, techDebtDelta: 5, message: 'パートナーシップ締結！新たな流入チャネルを獲得' } },
      { label: '独自路線を維持', description: '依存関係を作りたくない', effect: { brandDelta: 3, message: '独自路線を堅持。自力成長を選択' } },
    ],
  },
  {
    id: 'diversity_initiative',
    title: 'ダイバーシティの課題',
    description: '社員構成の偏りが指摘されている。多様性の推進が採用ブランドに影響し始めた。',
    category: 'internal',
    severity: 'neutral',
    conditions: { minTeamSize: 15, probability: 0.06 },
    choices: [
      { label: 'D&Iプログラムを導入', description: '$30Kの予算で多様性推進', effect: { cash: -30000, moraleDelta: 10, brandDelta: 10, message: 'D&I施策が好評。採用ブランドが向上' } },
      { label: '実力主義を貫く', description: '能力だけで判断する', effect: { moraleDelta: -5, brandDelta: -5, message: '一部社員から不満の声。採用にも影響' } },
    ],
  },
  {
    id: 'office_decision',
    title: 'オフィス問題',
    description: 'チームが拡大し、現在のオフィスが手狭に。移転 or リモート完全移行の判断が必要。',
    category: 'internal',
    severity: 'neutral',
    conditions: { minTeamSize: 20, probability: 0.08 },
    choices: [
      { label: '大きなオフィスに移転', description: '月$15K増だが、チームの結束力UP', effect: { moraleDelta: 10, cash: -45000, message: '新オフィスに移転！チームの士気が上がった' } },
      { label: 'フルリモートに移行', description: 'オフィスコストゼロ。採用の幅も広がる', effect: { moraleDelta: 3, brandDelta: 5, message: 'フルリモート化。全国から採用可能に' } },
      { label: 'ハイブリッドにする', description: '週3出社のハイブリッド体制', effect: { moraleDelta: 5, message: 'ハイブリッド体制でバランスを取った' } },
    ],
  },
  {
    id: 'award_nomination',
    title: 'アワードにノミネート',
    description: 'SaaS業界のアワードにノミネートされた。受賞すればブランド力が大幅UP。',
    category: 'external',
    severity: 'positive',
    conditions: { minMonth: 12, minMrr: 30000, probability: 0.05 },
    autoEffect: { brandDelta: 15, moraleDelta: 10, message: 'アワード受賞！業界からの認知が一気に拡大' },
  },
  {
    id: 'customer_feedback_revolt',
    title: '顧客からのUI批判',
    description: 'SNSで「UIが使いにくい」という投稿がバズっている。数千リツイートされ、既存顧客にも不安が広がっている。',
    category: 'customer',
    severity: 'negative',
    conditions: { minMonth: 6, minCustomers: 20, probability: 0.07 },
    choices: [
      { label: 'UI改善を約束し公開ロードマップを提示', description: '透明性で信頼回復', effect: { npsDelta: -5, brandDelta: 5, moraleDelta: -3, message: 'ロードマップ公開で一部鎮静化。改善を急ぐ' } },
      { label: '批判に丁寧に個別対応', description: '一つ一つに返信する', effect: { npsDelta: -3, brandDelta: 10, message: '丁寧な対応が好感を生み、逆にファンが増えた' } },
    ],
  },
  {
    id: 'ipo_window',
    title: 'IPOウィンドウが開いている',
    description: 'SaaS企業のIPOが相次いで成功。市場環境が最高潮。今ならプレミアムバリュエーションが期待できる。',
    category: 'market',
    severity: 'positive',
    conditions: { minMonth: 36, minMrr: 500000, probability: 0.08 },
    autoEffect: { brandDelta: 10, message: 'IPO市場が好調！上場を検討する絶好のタイミング' },
  },
];
