import { GameEvent } from '../types';

export const events: GameEvent[] = [
  // ===== 市場イベント =====
  {
    id: 'recession',
    title: '景気後退 — IT予算の凍結',
    description:
      '主要顧客5社からIT予算凍結の通達。今月だけで50件の「コスト見直し」問い合わせが殺到し、営業パイプラインの60%がフリーズ状態に。来期の更新交渉も厳しくなりそうだ。',
    category: 'market',
    severity: 'negative',
    conditions: { minMonth: 12, probability: 0.08 },
    choices: [
      {
        label: 'コスト最適化で嵐をやり過ごす',
        description: '非必須ツールの解約、出張禁止、採用凍結でバーンレートを圧縮',
        effect: {
          cash: -80000,
          churnDelta: 1.2,
          cacMultiplier: 1.35,
          moraleDelta: -12,
          mrrMultiplier: 0.94,
          message:
            '耐え凌いだが、チームは疲弊。採用凍結の影響で3ヶ月後にはエンジニア不足が顕在化する見込み。',
        },
      },
      {
        label: '逆張り攻勢 — 競合が縮小する今こそシェアを奪う',
        description: '広告予算を倍増し、競合から乗り換えキャンペーンを展開',
        effect: {
          cash: -250000,
          cacMultiplier: 0.75,
          brandDelta: 12,
          customersDelta: 8,
          message:
            'リスクの大きい賭けだったが、競合の縮小に乗じてシェアを獲得。3ヶ月後のパイプラインが厚くなっている。',
        },
      },
      {
        label: '値下げで顧客を守る',
        description: '既存顧客に20%ディスカウントを提示し、解約を防ぐ',
        effect: {
          cash: -40000,
          churnDelta: -0.5,
          mrrMultiplier: 0.88,
          message:
            '解約は防いだが、ARPUが大幅に低下。値下げの「前例」が残り、3ヶ月後の更新交渉で値上げが困難に。',
        },
      },
    ],
  },
  {
    id: 'ai_boom',
    title: 'AIバブル — 「AI搭載」がないと商談すら始まらない',
    description:
      '商談の80%で「AI機能はありますか？」が最初の質問に。競合3社がすでに「AI搭載」を謳い始め、RFPの必須要件にも「AI/ML活用」が記載されるようになった。自社プロダクトにはまだAI機能がない。',
    category: 'market',
    severity: 'neutral',
    conditions: { minMonth: 6, probability: 0.06 },
    choices: [
      {
        label: '3ヶ月で突貫AI開発',
        description: 'OpenAI APIを組み込み、まず「AI搭載」の看板を掲げる',
        effect: {
          cash: -200000,
          techDebtDelta: 15,
          brandDelta: 18,
          npsDelta: 5,
          customersDelta: 10,
          message:
            '「AI搭載」のラベルが商談を加速。ただし突貫開発の技術的負債が重く、3ヶ月後にはリファクタリングが必要になる。',
        },
      },
      {
        label: '半年かけて本格AI基盤投資',
        description: '自社データパイプラインとモデル基盤をゼロから構築',
        effect: {
          cash: -350000,
          techDebtDelta: 5,
          brandDelta: 10,
          npsDelta: 10,
          message:
            '短期的には競合に遅れるが、6ヶ月後には「本物のAI」として差別化。エンタープライズ商談で信頼を獲得。',
        },
      },
      {
        label: '静観 — コア機能に集中',
        description: 'AIブームに踊らされず、既存顧客の課題解決を優先',
        effect: {
          moraleDelta: -8,
          brandDelta: -5,
          message:
            '「時代遅れ」のレッテルを貼られ、新規リードが15%減少。ただしコア機能の品質は維持。3ヶ月後にAIブームが落ち着けば堅実路線が評価される可能性も。',
        },
      },
    ],
  },
  {
    id: 'tech_layoffs',
    title: 'テックレイオフの波',
    description:
      'GAFAM各社が合計2万人規模のレイオフを発表。LinkedInにはシニアエンジニアやPMの「#OpenToWork」が溢れている。自社の現メンバーにも不安が広がるが、採用市場には追い風だ。',
    category: 'market',
    severity: 'positive',
    conditions: { minMonth: 8, probability: 0.07 },
    autoEffect: {
      cash: -20000,
      moraleDelta: -5,
      cacMultiplier: 0.7,
      message:
        '業界の動揺でチームに不安が広がるが、採用市場は買い手優位に。次の採用コストが30%低下し、3ヶ月間は優秀な候補者からの応募が増える。',
    },
  },

  // ===== 競合イベント =====
  {
    id: 'big_tech_entry',
    title: 'AWS/Google Cloudが同領域でサービス発表',
    description:
      'AWS re:Inventで自社プロダクトと直接競合するマネージドサービスが発表された。無料枠付きで、既存顧客12社から「乗り換えを検討中」の連絡。株価のある競合2社は翌日15%下落。',
    category: 'competitor',
    severity: 'critical',
    conditions: { minMonth: 12, minMrr: 50000, probability: 0.06 },
    choices: [
      {
        label: '業界特化で差別化',
        description: '医療・金融など特定業界のコンプライアンス要件に深く対応',
        effect: {
          cash: -80000,
          cacMultiplier: 0.85,
          npsDelta: 8,
          message:
            '「AWSにはできない業界知識」がUSPに。既存顧客の離脱を防ぎ、3ヶ月後には業界特化リードが増加。',
        },
      },
      {
        label: '正面対決 — マーケ2倍投下',
        description: '比較表・移行コスト計算ツール・ウェビナーで対抗',
        effect: {
          cash: -200000,
          brandDelta: 12,
          cacMultiplier: 1.4,
          message:
            '認知度は上がったが、CACが急騰。大手の無料枠との価格競争は消耗戦に。6ヶ月以内に別の差別化軸が必要。',
        },
      },
      {
        label: 'API連携で共存',
        description: 'AWS/GCPのエコシステム上で動く統合プラグインを開発',
        effect: {
          cash: -60000,
          cacMultiplier: 0.7,
          npsDelta: 5,
          churnDelta: -0.3,
          customersDelta: 8,
          message:
            'マーケットプレイス経由で新規顧客が流入。大手のエコシステムに依存するリスクはあるが、3ヶ月でROIがプラスに。',
        },
      },
    ],
  },
  {
    id: 'competitor_funding',
    title: '競合がシリーズBで$50M調達',
    description:
      '直接競合がTier1 VCから$50MのシリーズBを完了。TechCrunchのトップ記事に。翌週からLinkedIn広告とGoogle広告の入札単価が急上昇し始めた。',
    category: 'competitor',
    severity: 'negative',
    conditions: { minMonth: 6, probability: 0.1 },
    autoEffect: {
      cash: -50000,
      cacMultiplier: 1.3,
      churnDelta: 0.5,
      customersDelta: -5,
      message:
        '競合の広告攻勢でCACが30%上昇。一部顧客が「比較検討したい」と更新を保留。3ヶ月は厳しい戦いが続く。',
    },
  },
  {
    id: 'competitor_collapse',
    title: '競合が事業停止を発表',
    description:
      '主要競合が資金ショートで事業停止を発表。約200社の顧客が移行先を緊急で探している。サポートフォーラムは阿鼻叫喚で、X上では「#移行先募集」がトレンド入り。',
    category: 'competitor',
    severity: 'positive',
    conditions: { minMonth: 6, probability: 0.05 },
    autoEffect: {
      customersDelta: 25,
      cacMultiplier: 0.5,
      brandDelta: 8,
      message:
        '競合の顧客が殺到。サポートチームはフル稼働だが、CACほぼゼロで25社が移行。3ヶ月後にはオンボーディング負荷がピークに達する見込み。',
    },
  },

  // ===== 内部イベント =====
  {
    id: 'key_employee_quit',
    title: 'エースエンジニアが退職を申し出',
    description:
      'コアアーキテクチャを設計したリードエンジニアが「来月末で退職したい」と申し出た。彼/彼女が抜けると、認証基盤とAPI設計の知見がほぼゼロに。すでに競合からのオファーレターを持っている。',
    category: 'internal',
    severity: 'negative',
    conditions: { minTeamSize: 3, probability: 0.08 },
    choices: [
      {
        label: 'カウンターオファー — 給与40%増+SO追加',
        description: '年俸を40%引き上げ、ストックオプションを追加付与して引き留める',
        effect: {
          cash: -50000,
          moraleDelta: 3,
          message:
            '引き留めに成功したが、他のメンバーとの報酬格差が生まれた。3ヶ月以内に他メンバーからも待遇改善の相談が来る可能性。',
        },
      },
      {
        label: '送り出して社内昇格',
        description: '感謝を伝え、No.2のメンバーをリードに昇格させる',
        effect: {
          cash: -80000,
          moraleDelta: -8,
          techDebtDelta: 8,
          message:
            'エースが去り、引き継ぎ期間1ヶ月では足りない部分も。昇格したメンバーが自信を持つまで3ヶ月の生産性低下を覚悟。',
        },
      },
      {
        label: '引き留め失敗に備え即座に採用開始',
        description: '引き留めを試みつつ、同時にエージェント3社に依頼を出す',
        effect: {
          cash: -120000,
          moraleDelta: -12,
          techDebtDelta: 5,
          message:
            '結局退職。採用は3ヶ月かかり、その間チームは残業続きに。ただし後任候補は確保できた。',
        },
      },
    ],
  },
  {
    id: 'burnout_wave',
    title: 'バーンアウトの蔓延 — 離職予備軍が5名',
    description:
      'eNPSが過去最低の-20を記録。匿名サーベイでは「3ヶ月以内に転職を考えている」が5名。直近3ヶ月の残業時間は月平均60時間を超え、PRレビューの品質も目に見えて低下している。',
    category: 'internal',
    severity: 'negative',
    conditions: { minMonth: 6, minTeamSize: 5, probability: 0.07 },
    choices: [
      {
        label: '全社オフサイト+有給取得推奨',
        description: '2泊3日の合宿を開催し、翌週は全員有給取得を推奨',
        effect: {
          cash: -80000,
          moraleDelta: 30,
          message:
            'チームの一体感が回復。eNPSが+15に改善。ただし1週間の開発停止で次スプリントの計画調整が必要。',
        },
      },
      {
        label: '1on1で個別対応',
        description: 'マネージャーが全員と30分ずつ面談し、個別の課題をヒアリング',
        effect: {
          cash: -15000,
          moraleDelta: 12,
          message:
            '面談で一部は改善。ただし構造的な問題（人手不足）は未解決。3ヶ月後に再燃するリスクあり。',
        },
      },
      {
        label: '外部コーチ招聘',
        description: '組織開発の専門コーチを3ヶ月契約で招き、チーム再建を図る',
        effect: {
          cash: -50000,
          moraleDelta: 20,
          npsDelta: 3,
          message:
            'プロの介入でコミュニケーション改善。サポート品質にも好影響が出始め、3ヶ月後にはNPSも微増。',
        },
      },
    ],
  },
  {
    id: 'star_candidate',
    title: 'スター候補からの応募 — ex-Stripe VP of Engineering',
    description:
      'Stripe出身のVP of Engineeringがシリーズ直後のスタートアップを探しており、自社に興味を示している。年俸¥25Mを希望。採用できればアーキテクチャ刷新とエンジニア採用力が大幅に向上する。',
    category: 'internal',
    severity: 'positive',
    conditions: { minMonth: 3, probability: 0.06 },
    choices: [
      {
        label: '満額オファー',
        description: '希望年俸¥25M+SO 1.5%で即オファーを出す',
        effect: {
          cash: -250000,
          moraleDelta: 12,
          techDebtDelta: -8,
          npsDelta: 5,
          message:
            'スター人材がジョイン。3ヶ月でアーキテクチャ改善が始まり、エンジニア採用にも好影響。ただしバーンレートは大幅増。',
        },
      },
      {
        label: 'SO増額で年俸を抑える交渉',
        description: '年俸¥18M+SO 3%で交渉。アップサイドで訴求する',
        effect: {
          cash: -150000,
          moraleDelta: 8,
          techDebtDelta: -5,
          message:
            '交渉成立。キャッシュは抑えられたが、SO比率が上がりキャップテーブルに影響。3ヶ月後に既存メンバーのSO見直しも必要に。',
        },
      },
      {
        label: '見送る',
        description: '今のバーンレートでは厳しい。タイミングを待つ',
        effect: {
          moraleDelta: -3,
          message:
            '惜しい人材を逃した。チームは「あの人が来ていれば…」と少しモチベダウン。',
        },
      },
    ],
  },

  // ===== プロダクトイベント =====
  {
    id: 'major_outage',
    title: '本番DB障害 — 全顧客がアクセス不能',
    description:
      '午前10時、本番PostgreSQLのディスクが100%に達し、全サービスが停止。SLA 99.9%を大幅に下回る事態に。Statusページは真っ赤で、Slackのサポートチャンネルに200件以上の問い合わせが殺到。ダウンタイムはすでに2時間を超えている。',
    category: 'product',
    severity: 'critical',
    conditions: { minMonth: 3, probability: 0.08 },
    choices: [
      {
        label: '全エンジニア緊急招集+顧客全通知',
        description: '全員をWar Roomに集め、15分おきにステータス更新を全顧客に送信',
        effect: {
          cash: -80000,
          npsDelta: -12,
          moraleDelta: -15,
          techDebtDelta: 8,
          brandDelta: 5,
          message:
            '4時間で復旧。突貫対応のため技術的負債が増加。ただし誠実な対応が評価され、3ヶ月後には「障害対応が素晴らしかった」というレビューがG2に投稿される。',
        },
      },
      {
        label: '段階的復旧 — 大口顧客を優先',
        description: 'ARRの高い顧客から順に復旧し、全面復旧は翌日を目標',
        effect: {
          cash: -120000,
          npsDelta: -18,
          churnDelta: 0.8,
          customersDelta: -5,
          message:
            '大口顧客は救えたが、後回しにされた中小顧客から強い不満。5社が翌月解約。「差別対応」がXで炎上し、3ヶ月は火消しに追われる。',
        },
      },
      {
        label: '返金+ポストモーテム公開',
        description: '全顧客に当月分を返金し、詳細なポストモーテムをブログで公開',
        effect: {
          cash: -150000,
          npsDelta: -8,
          brandDelta: 10,
          moraleDelta: -5,
          message:
            '返金は痛いが、透明性のある対応が業界で話題に。ポストモーテム記事がHacker Newsでトップに。3ヶ月後にはエンタープライズ商談でプラスに働く。',
        },
      },
    ],
  },
  {
    id: 'security_breach',
    title: 'セキュリティ脆弱性 — 顧客データ露出のリスク',
    description:
      'バグバウンティのセキュリティ研究者から緊急レポート。APIの認証バイパスにより、顧客のPIIデータ（氏名・メールアドレス・利用履歴）が外部からアクセス可能な状態。実害の有無は不明だが、最悪の場合300社・5万ユーザーのデータが影響範囲。',
    category: 'product',
    severity: 'critical',
    conditions: { minMonth: 6, probability: 0.06 },
    choices: [
      {
        label: 'パッチ+全顧客通知+外部監査',
        description: '即座にパッチを適用し、全顧客にインシデント通知。外部セキュリティ監査も実施',
        effect: {
          cash: -200000,
          npsDelta: -5,
          brandDelta: 8,
          techDebtDelta: -5,
          message:
            '迅速かつ透明な対応が評価される。外部監査レポートがエンタープライズ商談の信頼材料に。3ヶ月後にはSOC2取得の足がかりにもなる。',
        },
      },
      {
        label: '次リリースで対応',
        description: '今のスプリントを優先し、2週間後のリリースに含める',
        effect: {
          cash: -150000,
          npsDelta: -25,
          churnDelta: 1.5,
          brandDelta: -25,
          customersDelta: -10,
          message:
            '対応の遅れを研究者がブログで公開し大炎上。メディアに取り上げられ、10社が即解約。6ヶ月は信頼回復に費やすことに。',
        },
      },
      {
        label: '非公表でパッチのみ',
        description: '静かにパッチを当て、通知は行わない',
        effect: {
          cash: -50000,
          npsDelta: -3,
          brandDelta: -10,
          message:
            'パッチは当たったが、研究者との合意がない。6ヶ月以内に情報がリークした場合、「隠蔽」として致命的なダメージを受けるリスクが残る。',
        },
      },
    ],
  },
  {
    id: 'unexpected_usecase',
    title: '想定外のユースケース発見 — 不動産業界で爆発的利用',
    description:
      '不動産仲介会社8社が自社プロダクトを物件管理に転用して使い倒している。元々は想定していなかった使い方だが、G2に5つ星レビューが連続投稿され、不動産テック界隈でバズり始めた。',
    category: 'product',
    severity: 'positive',
    conditions: { minMonth: 6, minCustomers: 20, probability: 0.07 },
    autoEffect: {
      cash: 50000,
      npsDelta: 8,
      brandDelta: 8,
      customersDelta: 8,
      message:
        '不動産業界からの問い合わせが月30件ペースに。口コミベースでCACほぼゼロの新規獲得。3ヶ月後には業界特化LPの作成を検討すべきタイミング。',
    },
  },

  // ===== 顧客イベント =====
  {
    id: 'big_deal',
    title: '上場企業の全社導入コンペ — 年間¥3M案件',
    description:
      '東証プライム上場の大手メーカー（従業員3,000名）が全社導入のコンペを開始。年間契約額¥3M、3年契約の可能性も。ただしSSO/SCIM対応、監査ログ、SLA 99.95%保証、専用環境が要件に含まれている。',
    category: 'customer',
    severity: 'positive',
    conditions: { minMonth: 6, probability: 0.08 },
    choices: [
      {
        label: 'カスタム開発で受注',
        description: '要件をすべて満たすカスタム開発を3ヶ月で実施',
        effect: {
          cash: 300000,
          mrrMultiplier: 1.08,
          techDebtDelta: 12,
          moraleDelta: -8,
          customersDelta: 1,
          message:
            '受注成功。¥3M/年の大型契約。ただしカスタム開発の保守負荷が重く、3ヶ月後にはエンジニアの30%がこの案件に張り付くことに。',
        },
      },
      {
        label: '標準プランで勝負',
        description: '既存機能の範囲で提案。不足分はロードマップで説明',
        effect: {
          cash: 150000,
          mrrMultiplier: 1.03,
          brandDelta: 8,
          customersDelta: 1,
          message:
            '縮小版で受注。契約額は¥1.5Mに下がったが、技術的負債なし。「プロダクトの思想がしっかりしている」と評価され、3ヶ月後に別部署からも引き合い。',
        },
      },
      {
        label: '見送り',
        description: '今のフェーズではエンタープライズ対応は時期尚早と判断',
        effect: {
          moraleDelta: -5,
          message:
            '大型案件を見送り。営業チームの士気は下がるが、開発リソースをプロダクト改善に集中できる。',
        },
      },
    ],
  },
  {
    id: 'churn_wave',
    title: '解約の波 — 今月の解約予告が通常の3倍',
    description:
      '今月だけで15社から解約予告。CSチームの分析では、原因は「競合の新機能」が40%、「ROIが見えない」が35%、「サポート品質」が25%。NRRが90%を割り込みそうな危機的状況。',
    category: 'customer',
    severity: 'negative',
    conditions: { minMonth: 4, minCustomers: 10, probability: 0.1 },
    choices: [
      {
        label: 'CS緊急対応',
        description: '全CSメンバーが対象顧客に個別連絡し、利用状況のヒアリングと改善提案を実施',
        effect: {
          cash: -30000,
          churnDelta: -0.5,
          moraleDelta: -8,
          message:
            '8社の引き留めに成功。ただしCSチームは疲弊。根本的なプロダクト改善なしでは3ヶ月後に再発する。',
        },
      },
      {
        label: '値引き提案',
        description: '解約予告の全社に30%ディスカウントを3ヶ月間提示',
        effect: {
          cash: -50000,
          churnDelta: -1.0,
          mrrMultiplier: 0.95,
          message:
            '12社が残留。ただしARPUが5%低下し、値引きの前例ができた。3ヶ月後の更新時にも割引を期待される。',
        },
      },
      {
        label: 'プロダクト改善にリソース集中',
        description: '解約理由の上位3つに直接対応する機能改善を最優先で開発',
        effect: {
          cash: -80000,
          churnDelta: -0.3,
          techDebtDelta: -5,
          npsDelta: 5,
          message:
            '短期的には5社が解約。しかし2ヶ月後のリリースで改善が実装され、残った顧客のNPSが向上。長期的にはチャーン体質の改善に。',
        },
      },
    ],
  },
  {
    id: 'viral_moment',
    title: 'バイラルの瞬間 — フォロワー15万のインフルエンサーが絶賛',
    description:
      '業界で影響力のあるインフルエンサー（Xフォロワー15万人）が自社プロダクトの使い方動画を投稿。いいね3,000超え、リポスト800件。「このツール、もっと早く知りたかった」のコメントが連鎖し、問い合わせが1日で100件を突破。サーバー負荷も急上昇中。',
    category: 'customer',
    severity: 'positive',
    conditions: { minMonth: 3, probability: 0.05 },
    choices: [
      {
        label: 'サーバー増強+CS体制強化',
        description: 'インフラをスケールアップし、臨時CSスタッフを3名追加',
        effect: {
          cash: -80000,
          customersDelta: 30,
          brandDelta: 18,
          cacMultiplier: 0.4,
          message:
            'バイラルの波を完全にキャッチ。30社が新規契約し、CACは通常の60%減。3ヶ月後にはオンボーディング完了で定着率も安定。',
        },
      },
      {
        label: '通常対応',
        description: '特別な投資はせず、既存体制で対応',
        effect: {
          customersDelta: 15,
          brandDelta: 10,
          message:
            '一部の問い合わせに対応しきれず機会損失。それでも15社が契約。サポート品質の低下が3ヶ月後のレビューに影響する可能性。',
        },
      },
      {
        label: '有料広告で追い風に乗る',
        description: 'バイラル投稿をリファレンスにした広告キャンペーンを即日開始',
        effect: {
          cash: -120000,
          customersDelta: 40,
          brandDelta: 20,
          cacMultiplier: 0.3,
          message:
            'バイラル×広告の相乗効果で爆発的リーチ。40社が新規契約。ただしオンボーディング負荷が高く、3ヶ月後のチャーンリスクに注意が必要。',
        },
      },
    ],
  },

  // ===== 外部イベント =====
  {
    id: 'regulation_change',
    title: 'データ保護規制強化 — 改正個人情報保護法の施行',
    description:
      '改正個人情報保護法が6ヶ月後に施行。データの越境移転制限、同意管理の厳格化、違反時の罰則強化が含まれる。エンタープライズ顧客からは「対応予定はありますか？」の問い合わせが週20件ペースで届いている。',
    category: 'external',
    severity: 'negative',
    conditions: { minMonth: 12, probability: 0.07 },
    choices: [
      {
        label: '即座にフル対応',
        description: '専任チームを立ち上げ、同意管理・データ暗号化・監査ログを3ヶ月で実装',
        effect: {
          cash: -120000,
          brandDelta: 15,
          npsDelta: 5,
          message:
            '施行2ヶ月前に対応完了。「コンプライアンス対応済」バッジが商談で強力な武器に。3ヶ月後にはエンタープライズからの引き合いが増加。',
        },
      },
      {
        label: '最低限対応',
        description: '必須要件のみ対応し、詳細対応は施行後に',
        effect: {
          cash: -30000,
          churnDelta: 0.5,
          message:
            '最低限のコストで法令違反は回避。ただし「対応が不十分」との評価で一部顧客が離脱。3ヶ月後に追加対応が必要になる見込み。',
        },
      },
      {
        label: 'コンプライアンス機能を新プランとして販売',
        description: '規制対応機能を「エンタープライズプラン」として有料提供',
        effect: {
          cash: -80000,
          brandDelta: 10,
          mrrMultiplier: 1.03,
          customersDelta: 3,
          message:
            '規制をビジネスチャンスに転換。エンタープライズプランへのアップセルが3社成約。3ヶ月後にはARPU改善にも寄与。',
        },
      },
    ],
  },
  {
    id: 'conference_invite',
    title: 'SaaS業界カンファレンス — 基調講演の招待',
    description:
      '参加者2,000名規模のSaaS業界カンファレンスから基調講演の招待。スポンサーブースの選択肢もある。競合3社もスポンサーとして参加予定。準備には2週間の工数が必要。',
    category: 'external',
    severity: 'positive',
    conditions: { minMonth: 6, probability: 0.08 },
    choices: [
      {
        label: '登壇する',
        description: '基調講演でプロダクトビジョンを語り、デモを実施',
        effect: {
          cash: -50000,
          brandDelta: 25,
          customersDelta: 12,
          cacMultiplier: 0.6,
          message:
            '講演が大好評。名刺交換150枚、うち30社が翌週トライアル開始。3ヶ月後には講演動画がYouTubeで1万再生を超え、持続的なリード獲得に。',
        },
      },
      {
        label: 'ブース出展のみ',
        description: '講演は辞退し、ブースでの展示とデモに集中',
        effect: {
          cash: -30000,
          brandDelta: 10,
          customersDelta: 5,
          message:
            'ブースで50社と接触。講演ほどのインパクトはないが、質の高いリードを5社獲得。準備工数も抑えられ、開発への影響は最小限。',
        },
      },
      {
        label: '辞退',
        description: '今四半期はプロダクト開発を最優先',
        effect: {
          message:
            '登壇を辞退。開発リソースは確保できたが、競合3社がカンファレンスで存在感を示したとの報告が入る。次回の招待が来るかは不透明。',
        },
      },
    ],
  },
  {
    id: 'patent_troll',
    title: '特許トロール訴訟 — ¥15Mの和解金を要求',
    description:
      'テキサス州の特許管理会社から訴訟通知。「UIにおけるドラッグ&ドロップによるデータ操作」に関する広範な特許を主張し、和解金¥15Mを要求。弁護士の見解では「勝てる可能性は70%だが、法廷闘争は6-12ヶ月かかる」とのこと。',
    category: 'external',
    severity: 'negative',
    conditions: { minMonth: 12, minMrr: 30000, probability: 0.05 },
    choices: [
      {
        label: '和解',
        description: '¥15Mの和解金を支払い、早期に決着',
        effect: {
          cash: -150000,
          message:
            '和解金は痛いが、経営陣のリソースを開放。ただし「払う会社」として他のトロールに目をつけられるリスクが3ヶ月後に顕在化する可能性。',
        },
      },
      {
        label: '法廷闘争',
        description: '弁護士費用¥8Mで徹底的に戦う',
        effect: {
          cash: -80000,
          moraleDelta: -8,
          brandDelta: 8,
          message:
            '6ヶ月の闘争の末、勝訴。業界メディアで「特許トロールに屈しないスタートアップ」として取り上げられる。ただし経営陣は半年間訴訟に時間を取られた。',
        },
      },
      {
        label: '機能削除で回避',
        description: '訴訟対象の機能を削除し、代替UIを開発',
        effect: {
          cash: -20000,
          npsDelta: -5,
          techDebtDelta: 5,
          churnDelta: 0.3,
          message:
            '訴訟は回避できたが、顧客から「使いにくくなった」とのフィードバック。3ヶ月後の代替UI完成まで解約リスクが続く。',
        },
      },
    ],
  },
];
