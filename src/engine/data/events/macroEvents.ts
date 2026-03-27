import { GameEvent } from '../../types';

export const macroEvents: GameEvent[] = [
  {
    id: 'me_rate_hike',
    title: '日銀がマイナス金利を解除 — 17年ぶりの利上げ',
    description: '日銀が17年ぶりにマイナス金利政策を解除。長期金利が急上昇し、スタートアップ投資の冷え込みが懸念される。VCのディールフローは鈍化し、既存ポートフォリオ企業へのフォローオン投資も厳選傾向に。',
    category: 'market',
    severity: 'negative',
    conditions: { minMonth: 12, probability: 0.06 },
    choices: [
      {
        label: 'コスト削減で備える',
        description: '不要SaaS解約、出張凍結',
        effect: { cash: -40000, moraleDelta: -8, mrrMultiplier: 0.97, message: '金利上昇に備えバーンレート圧縮。VCの投資意欲も冷え込み、次回調達の条件は厳しくなりそうだ' },
      },
      {
        label: '逆張りで攻める',
        description: '他社が縮小する今がチャンス',
        effect: { cash: -80000, brandDelta: 8, cacMultiplier: 0.85, message: '金利上昇局面でも攻めの姿勢。競合が萎縮する中、市場シェアを拡大' },
      },
      {
        label: '資金効率改善に集中',
        description: 'ユニットエコノミクス最適化',
        effect: { cash: -25000, churnDelta: -0.3, npsDelta: 3, message: 'LTV/CAC比率の改善に注力。投資家へのアピール材料に' },
      },
    ],
  },
  {
    id: 'me_yen_weak',
    title: '1ドル=160円突破 — AWSインフラ費が実質30%増',
    description: '急激な円安が進行し1ドル=160円を突破。AWSやGCPなどドル建てのクラウドインフラ費用が実質30%増となり、SaaS企業の利益率を直撃。為替ヘッジの有無で明暗が分かれる。',
    category: 'market',
    severity: 'negative',
    conditions: { minMonth: 6, probability: 0.05 },
    choices: [
      {
        label: 'インフラ最適化',
        description: 'リザーブドインスタンス購入+コスト監視強化',
        effect: { cash: -60000, techDebtDelta: -3, message: 'インフラコスト最適化で影響を最小化。ただし3ヶ月は利益率が圧迫される' },
      },
      {
        label: '円建て決済に全面切替',
        description: '海外サービスの円建て契約に移行',
        effect: { cash: -30000, cacMultiplier: 1.15, message: '海外サービスの円建て契約に切替。為替リスクは軽減したが割高に' },
      },
      {
        label: '価格転嫁 — 値上げで吸収',
        description: '為替影響分をプラン料金に転嫁',
        effect: { cash: -15000, churnDelta: 0.5, mrrMultiplier: 1.05, message: '為替影響分を価格に転嫁。一部顧客から不満の声' },
      },
    ],
  },
  {
    id: 'me_recession',
    title: 'リーマン級の世界同時不況 — GDP成長率-3%',
    description: '世界同時不況が到来。主要国のGDP成長率が軒並みマイナスに転落し、法人IT予算は凍結。新規導入の意思決定は完全にストップし、既存契約の見直しも始まった。ランウェイの長さが生死を分ける。',
    category: 'market',
    severity: 'critical',
    conditions: { minMonth: 18, probability: 0.05 },
    choices: [
      {
        label: '守りの経営 — バーンレート最小化',
        description: 'あらゆるコストを見直して耐久態勢に',
        effect: { cash: -30000, churnDelta: 1.5, moraleDelta: -12, mrrMultiplier: 0.9, message: '大不況を耐える態勢に。チーム全体に緊張が走る。6ヶ月は我慢の時期が続く' },
      },
      {
        label: 'レイオフ実施 — 人員20%削減',
        description: '断腸の思いで人員整理を決断',
        effect: { cash: -100000, moraleDelta: -20, techDebtDelta: 8, mrrMultiplier: 0.95, message: '断腸の思いでレイオフ実施。残ったメンバーの負荷増大。退職エントリがSNSで拡散' },
      },
      {
        label: '不況下でもシェア拡大',
        description: '競合が縮小する今がチャンス',
        effect: { cash: -200000, cacMultiplier: 0.65, brandDelta: 15, customersDelta: 10, message: '競合が縮小する中、逆張りで市場を一気に獲得。資金繰りは綱渡りだが' },
      },
    ],
  },
  {
    id: 'me_bubble_burst',
    title: 'SaaSバブル崩壊 — PSRが12倍→6倍に急落',
    description: 'SaaS銘柄のPSR（売上高倍率）が12倍から6倍に急落。「赤字成長モデル」が市場から完全に否定され、未上場SaaSの資金調達環境が一変。投資家は黒字化のタイムラインを執拗に問い始めた。',
    category: 'market',
    severity: 'critical',
    conditions: { minMonth: 24, probability: 0.04 },
    autoEffect: { cash: -100000, moraleDelta: -12, mrrMultiplier: 0.95, message: 'SaaSバブル崩壊。PSR（売上高倍率）が半減し、未上場SaaSの資金調達環境が急激に悪化。次回ラウンドのバリュエーションは大幅に下がる見込み' },
  },
  {
    id: 'me_pandemic',
    title: 'パンデミック発生',
    description: '新型感染症のパンデミックが世界を襲う。リモートワーク関連ツールに爆発的な特需が生まれる一方、対面ビジネスは壊滅的打撃。SaaSにとっては千載一遇のチャンスだが、対応の速さが命運を握る。',
    category: 'market',
    severity: 'neutral',
    conditions: { minMonth: 12, probability: 0.03 },
    choices: [
      {
        label: 'リモート対応強化',
        description: 'リモートワーク機能を最優先で緊急開発',
        effect: { cash: -100000, customersDelta: 25, npsDelta: 8, techDebtDelta: 8, message: 'リモートワーク対応を緊急開発。顧客急増も技術負債が増加' },
      },
      {
        label: '通常営業を維持',
        description: '特別な対応はしない',
        effect: { cash: -30000, churnDelta: 0.8, customersDelta: -8, message: 'パンデミック対応が遅れ、競合に顧客を奪われる' },
      },
      {
        label: '無償プラン提供で市場支配',
        description: '期間限定で全機能を無料開放',
        effect: { cash: -200000, customersDelta: 40, brandDelta: 20, mrrMultiplier: 0.85, message: '無償提供で圧倒的シェアを獲得。マネタイズは半年後の課題' },
      },
    ],
  },
  {
    id: 'me_subsidy',
    title: 'IT導入補助金2024 — 補助率最大3/4に拡充',
    description: '経済産業省がIT導入補助金の補助率を最大3/4に拡充。中小企業のSaaS導入が一気に加速する追い風。申請件数は前年比3倍に達し、認定ITツールへの問い合わせが殺到している。',
    category: 'market',
    severity: 'positive',
    conditions: { minMonth: 6, probability: 0.07 },
    choices: [
      {
        label: '補助金対応LP+専任担当配置',
        description: '補助金特設ページと専任チームを設置',
        effect: { cash: -50000, customersDelta: 12, cacMultiplier: 0.5, message: '補助金特設ページが大反響。中小企業からの問い合わせが殺到' },
      },
      {
        label: '既存代理店経由で対応',
        description: '代理店ネットワークを活用して補助金案件を獲得',
        effect: { customersDelta: 5, cacMultiplier: 0.7, message: '代理店経由で補助金案件を獲得。手数料で利益率は低いが確実' },
      },
      {
        label: '補助金対応パッケージを新設',
        description: '補助金申請に最適化した専用プランを作成',
        effect: { cash: -30000, customersDelta: 8, mrrMultiplier: 1.03, brandDelta: 5, message: '補助金専用パッケージが好評。新規顧客層の開拓に成功' },
      },
    ],
  },
  {
    id: 'me_regulation',
    title: 'AI規制法の施行 — EU AI Act準拠が求められる',
    description: 'EU AI Actが施行され、AI機能を持つSaaSに厳格なコンプライアンス要件が課される。日本企業でもEU圏に顧客を持つ場合は対応必須。透明性レポートやリスク評価の義務化で、対応コストが重くのしかかる。',
    category: 'market',
    severity: 'negative',
    conditions: { minMonth: 12, probability: 0.06 },
    choices: [
      {
        label: '早期に完全対応',
        description: '業界最速でAI規制対応を完了させる',
        effect: { cash: -200000, brandDelta: 18, npsDelta: 8, message: '業界最速でAI規制対応を完了。エンタープライズ顧客からの信頼が急上昇。3ヶ月後にはコンプライアンスが差別化要因に' },
      },
      {
        label: '最低限の対応',
        description: '必要最小限の対応にとどめる',
        effect: { cash: -50000, churnDelta: 0.5, brandDelta: -5, message: '最低限の規制対応にとどめた。一部の大企業顧客から懸念の声' },
      },
      {
        label: '規制対応を新プランとして販売',
        description: 'コンプライアンス機能をプレミアムプランに',
        effect: { cash: -120000, brandDelta: 12, mrrMultiplier: 1.05, customersDelta: 5, message: '規制対応機能をプレミアムプランとして提供。コンプライアンス意識の高い企業に刺さった' },
      },
    ],
  },
  {
    id: 'me_bigtech',
    title: 'Microsoft Copilotがあなたの領域に本格参入 — M365バンドルの脅威',
    description: 'Microsoft CopilotがM365にバンドルされ、あなたのプロダクトと同等の機能を無料で提供開始。既存顧客から「Copilotで十分では？」という声が上がり始め、商談でも比較されるケースが急増。',
    category: 'market',
    severity: 'critical',
    conditions: { minMonth: 12, minMrr: 50000, probability: 0.05 },
    choices: [
      {
        label: '業界特化で逃げる',
        description: 'Microsoftがカバーしない専門領域に特化',
        effect: { cash: -80000, npsDelta: 8, cacMultiplier: 0.85, churnDelta: 0.3, message: 'Microsoft がカバーしない業界特化機能で差別化。ただし既存顧客の一部は無料のCopilotに流れた' },
      },
      {
        label: 'Copilot連携プラグインを開発',
        description: 'Microsoftエコシステムに乗る戦略',
        effect: { cash: -60000, brandDelta: 12, cacMultiplier: 0.7, customersDelta: 8, message: 'Microsoft エコシステムに乗る戦略。Copilotの補完ツールとしてポジション確立' },
      },
      {
        label: '真正面から対抗',
        description: 'マーケティングを倍増して独自路線を死守',
        effect: { cash: -250000, brandDelta: 15, cacMultiplier: 1.5, moraleDelta: -8, message: '大手との全面戦争を選択。マーケ費が膨大だが、独自ポジションを死守' },
      },
    ],
  },
  {
    id: 'me_ma_wave',
    title: 'M&Aの波',
    description: '業界でM&Aが相次いでいる。大手SIerやPEファンドが中堅SaaS企業を次々に買収。あなたの会社にも買収打診が来てもおかしくない状況だ。',
    category: 'market',
    severity: 'positive',
    conditions: { minMonth: 24, minMrr: 100000, probability: 0.06 },
    autoEffect: { brandDelta: 8, moraleDelta: 3, message: 'M&A活況。あなたの会社にも買収打診の噂が。チーム内でエグジットへの期待と不安が入り混じる' },
  },
  {
    id: 'me_ipo_freeze',
    title: 'IPO市場の冷え込み',
    description: 'IPO市場が完全に凍結。東証グロース市場の新規上場承認がストップし、上場準備中の企業が続々と延期を発表。エグジット戦略の根本的な見直しを迫られる。',
    category: 'market',
    severity: 'negative',
    conditions: { minMonth: 30, probability: 0.05 },
    autoEffect: { cash: -50000, moraleDelta: -8, brandDelta: -3, message: 'IPO市場が完全凍結。上場準備にかけたコストが重荷に。エグジット戦略の根本的見直しが必要' },
  },
  {
    id: 'me_ipo_boom',
    title: 'IPO市場の過熱',
    description: 'SaaS企業のIPOラッシュが到来。初値が公開価格の2倍を超えるケースが続出し、投資家もVCも熱狂。上場準備を加速すべきか、それとも非上場のまま成長を続けるか。',
    category: 'market',
    severity: 'positive',
    conditions: { minMonth: 36, minMrr: 500000, probability: 0.06 },
    autoEffect: { brandDelta: 12, moraleDelta: 8, message: 'SaaS企業のIPOラッシュ。初値が公開価格の2倍を超えるケースも。上場準備を加速すべきか' },
  },
  {
    id: 'me_ai_revolution',
    title: 'エージェントAIの実用化 — 人間の業務を自律代行するAIが現実に',
    description: 'AIエージェントが実用段階に突入。人間の指示なしに業務を自律的に遂行するAIが登場し、SaaS業界のゲームルールが根底から変わろうとしている。「AIネイティブ」でないプロダクトは淘汰される危機感が広がる。',
    category: 'market',
    severity: 'neutral',
    conditions: { minMonth: 6, probability: 0.06 },
    choices: [
      {
        label: 'AIエージェント対応API基盤を構築',
        description: '開発リソースをAIエージェント連携に集中投下',
        effect: { cash: -200000, techDebtDelta: 8, brandDelta: 18, npsDelta: 10, customersDelta: 8, message: 'AIエージェント連携基盤を構築。「AI時代のインフラ」として注目を集める' },
      },
      {
        label: '段階的にAI導入',
        description: '小さく始めて検証しながら進める',
        effect: { cash: -80000, brandDelta: 8, npsDelta: 5, techDebtDelta: 3, message: 'AIを段階的に導入。手堅くバリューアップ' },
      },
      {
        label: '静観 — コア機能に集中',
        description: 'AIブームに踊らされず既存機能を磨く',
        effect: { moraleDelta: -5, brandDelta: -8, message: 'AIブームを静観。「AI非対応」のレッテルが貼られ始め、商談で不利になるケースが増えた' },
      },
    ],
  },
];
