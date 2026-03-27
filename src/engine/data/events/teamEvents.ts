import { GameEvent } from '../../types';

export const teamEvents: GameEvent[] = [
  {
    id: 'te_cto_quit',
    title: 'CTO/VP Engineeringの退職',
    description: '技術責任者が突然の退職を申し出た。「次のチャレンジがしたい」とのこと。開発チームに動揺が広がっている。引き継ぎ資料はほぼ存在せず、本番環境のアクセス権限も彼に集中していた。',
    category: 'internal',
    severity: 'critical',
    conditions: { minTeamSize: 10, probability: 0.04 },
    choices: [
      {
        label: 'カウンターオファー — 給与50%増+Co-founder昇格',
        description: '何としても引き留める。待遇と肩書で誠意を見せる',
        effect: { cash: -80000, moraleDelta: 3, message: '引き留めに成功。だがチーム内に「ゴネ得」の空気が。3ヶ月以内に他メンバーからも昇給要求が来る可能性' },
      },
      {
        label: '外部からCTOを採用する',
        description: 'ヘッドハンターに依頼して市場から技術リーダーを探す',
        effect: { cash: -150000, moraleDelta: -12, techDebtDelta: 12, message: 'CTO退職。外部採用に3ヶ月かかり、その間に追随退職が2名発生。技術方針の空白期間が痛い' },
      },
      {
        label: '社内No.2をCTOに昇格',
        description: '既存メンバーの中から後任を選んで即座に昇格させる',
        effect: { cash: -50000, moraleDelta: -5, techDebtDelta: 5, message: '社内昇格で空白を最小化。ただし前任ほどの技術力はなく、アーキテクチャ判断に不安が残る' },
      },
    ],
  },
  {
    id: 'te_hiring_hard',
    title: 'エンジニア採用難',
    description: '3ヶ月間、エンジニアの応募がほぼゼロ。採用市場が完全に売り手市場で、競合他社はシリーズBの資金で年俸を吊り上げている。スカウト返信率は2%を切った。',
    category: 'internal',
    severity: 'negative',
    conditions: { minMonth: 6, minTeamSize: 5, probability: 0.07 },
    choices: [
      {
        label: 'リファラルボーナス制度を導入',
        description: '社員紹介で¥40K/人のボーナスを支給',
        effect: { cash: -40000, moraleDelta: 5, message: 'リファラル採用で2名の候補者確保。採用コストは抑えられたが、同質的なチームになるリスクも' },
      },
      {
        label: '採用基準を下げてポテンシャル採用',
        description: '経験不問で意欲のある未経験者を大量に採用する',
        effect: { cash: -25000, techDebtDelta: 8, moraleDelta: -5, message: '未経験者を3名採用。育成に半年必要。シニアメンバーの負荷が急増' },
      },
      {
        label: 'フリーランス/業務委託で補完',
        description: '即戦力のフリーランスを月額契約で確保する',
        effect: { cash: -80000, techDebtDelta: 3, message: '業務委託で即戦力を確保。月額単価は高いがすぐにアウトプットが出る。ただしノウハウが社内に残らない' },
      },
    ],
  },
  {
    id: 'te_harassment',
    title: '社内ハラスメント報告',
    description: '匿名の内部通報でハラスメント問題が発覚。被害者は複数名おり、加害者はハイパフォーマーの幹部社員。対応を誤れば法的リスクと評判リスクが同時に襲いかかる。',
    category: 'internal',
    severity: 'critical',
    conditions: { minTeamSize: 8, probability: 0.04 },
    choices: [
      {
        label: '外部弁護士含む第三者委員会を設置',
        description: '透明性のある調査を実施し、厳正に対処する',
        effect: { cash: -80000, moraleDelta: -3, brandDelta: 8, message: '第三者委員会の調査で事実を解明。厳正な処分と再発防止策を全社に共有。3ヶ月後には組織の信頼回復' },
      },
      {
        label: '社内で対処する',
        description: '人事部主導で当事者間の解決を図る',
        effect: { cash: -30000, moraleDelta: -18, brandDelta: -15, customersDelta: -3, message: '内部処理を試みたが被害者が退職エントリを公開。SNSで炎上し採用にも影響' },
      },
      {
        label: '被害者と加害者の配置転換',
        description: '物理的に距離を置くことで再発を防ぐ',
        effect: { cash: -20000, moraleDelta: -10, message: '配置転換で表面上は解決。しかし根本原因は放置されたまま。半年後に再発リスク' },
      },
    ],
  },
  {
    id: 'te_keyman_poach',
    title: 'トップセールスの引き抜き',
    description: '売上の20%を1人で稼いでいたトップセールスに、競合から年俸2倍のオファーが来ている。彼の担当顧客との関係は属人的で、引き継ぎは容易ではない。',
    category: 'internal',
    severity: 'negative',
    conditions: { minTeamSize: 5, probability: 0.06 },
    choices: [
      {
        label: 'マネージャー昇格+SO追加で対抗',
        description: '役職とストックオプションで引き留める',
        effect: { cash: -50000, moraleDelta: 5, message: 'マネージャー昇格とSO追加で引き留めに成功。ただし担当顧客への依存度は変わらず' },
      },
      {
        label: '送り出す',
        description: '1人に依存しない組織づくりを優先する',
        effect: { mrrMultiplier: 0.88, moraleDelta: -10, customersDelta: -5, message: 'エース退職。担当顧客5社中2社が解約を示唆。売上インパクトは半年続く' },
      },
      {
        label: '競業避止義務を交渉して円満退社',
        description: '退職金上乗せの代わりに3ヶ月の競業避止で合意を目指す',
        effect: { cash: -30000, moraleDelta: -3, mrrMultiplier: 0.95, message: '円満退社+3ヶ月の競業避止で合意。引き継ぎ期間で顧客関係を組織に移管' },
      },
    ],
  },
  {
    id: 'te_labor_issue',
    title: '労基署の臨検調査 — 36協定違反の疑い',
    description: '労働基準監督署から臨検調査の通知が届いた。匿名のタレコミがあったらしい。勤怠記録を確認すると、複数の社員が月80時間超の残業を常態化させていた。',
    category: 'internal',
    severity: 'negative',
    conditions: { minTeamSize: 10, probability: 0.05 },
    choices: [
      {
        label: '全面是正+未払い残業代を全額精算',
        description: '法令遵守を最優先に、勤怠管理システムも刷新する',
        effect: { cash: -200000, moraleDelta: 8, brandDelta: 5, message: '未払い残業代を全額精算し、勤怠管理システムを導入。痛い出費だが「ホワイト企業」として採用力が向上' },
      },
      {
        label: '指摘事項のみ最低限対応',
        description: '労基署に指摘された部分だけ修正する',
        effect: { cash: -50000, moraleDelta: -8, message: '最低限の是正にとどめた。労基署との関係は改善せず、半年後に再度臨検の可能性' },
      },
      {
        label: '顧問弁護士と交渉',
        description: '弁護士を通じて労基署との折衝を進める',
        effect: { cash: -80000, moraleDelta: -3, message: '顧問弁護士を通じて労基署と交渉。是正計画の提出で猶予期間を獲得' },
      },
    ],
  },
  {
    id: 'te_star_apply',
    title: 'Google出身スタッフエンジニアからの応募 — 年俸¥350K希望',
    description: 'Google出身のスタッフエンジニアがあなたのプロダクトに惚れ込み、直接応募してきた。年俸¥350K希望。技術ブログのフォロワーは5万人、OSS貢献も多数。採用できればチームの技術力が一段上がる。',
    category: 'internal',
    severity: 'positive',
    conditions: { minMonth: 6, probability: 0.05 },
    choices: [
      {
        label: '満額¥350Kでオファー',
        description: '迷わず最高の条件で迎え入れる',
        effect: { cash: -350000, moraleDelta: 12, techDebtDelta: -10, npsDelta: 5, message: 'スター人材が入社！アーキテクチャが刷新され、既存メンバーの技術力も底上げ' },
      },
      {
        label: 'SO増額で年俸を¥250Kに交渉',
        description: 'ストックオプションを厚くして年俸を抑える',
        effect: { cash: -250000, moraleDelta: 8, techDebtDelta: -5, message: 'SO条件で折り合い。入社後の活躍に期待。ただしベスティング期間中の離脱リスクあり' },
      },
      {
        label: '見送る',
        description: '今のバーンレートでは採用できない',
        effect: { moraleDelta: -3, message: '予算の都合で見送り。3ヶ月後、その人材が競合に入社したと噂が流れ、チームに動揺' },
      },
    ],
  },
  {
    id: 'te_silo',
    title: 'ビルドトラップ — 営業が売った機能を開発が作り、誰も使わない',
    description: '営業が大口顧客に約束した機能を開発チームが必死に実装したが、リリース後の利用率は3%。開発は「言われた通り作っただけ」、営業は「仕様が違う」と責任の押し付け合い。プロダクトのロードマップが顧客別カスタマイズで埋まっている。',
    category: 'internal',
    severity: 'negative',
    conditions: { minTeamSize: 15, probability: 0.06 },
    choices: [
      {
        label: 'PM採用+プロダクトディスカバリー導入',
        description: '専任PMを採用し、仮説検証プロセスを確立する',
        effect: { cash: -60000, moraleDelta: 8, npsDelta: 5, techDebtDelta: -3, message: 'PM主導のプロダクトディスカバリーで機能開発の精度が向上。3ヶ月後にはリリース機能の利用率が2倍に' },
      },
      {
        label: '開発と営業の合同レビュー会を毎週実施',
        description: '週次で両チームが顧客の声を共有する場を設ける',
        effect: { cash: -10000, moraleDelta: 5, npsDelta: 3, message: '週次の合同レビューで相互理解が進んだ。根本解決ではないが改善の兆し' },
      },
      {
        label: '営業主導のプロダクト戦略に切替',
        description: '受注を最優先にプロダクトの方向性を営業に委ねる',
        effect: { cash: -20000, moraleDelta: -8, techDebtDelta: 8, customersDelta: 5, message: '営業の声を最優先に。短期的に受注は増えたがプロダクトの一貫性が崩壊しつつある' },
      },
    ],
  },
  {
    id: 'te_so_exercise',
    title: 'ストックオプション行使期限',
    description: '初期メンバー数名のストックオプション行使期限が近づいている。行使資金がなければ権利が消滅する。彼らは創業期の苦しい時期を支えてくれた仲間だ。',
    category: 'internal',
    severity: 'neutral',
    conditions: { minMonth: 24, minTeamSize: 5, probability: 0.05 },
    choices: [
      {
        label: '会社でローン支援',
        description: '行使資金を無利子で貸し付ける',
        effect: { cash: -40000, moraleDelta: 12, message: '初期メンバーのSO行使を全額支援。「この会社は仲間を大切にする」と社内の信頼が深まった' },
      },
      {
        label: '個人の判断に委ねる',
        description: '自己責任で対応してもらう',
        effect: { moraleDelta: -8, message: '一部メンバーがSO行使を断念。「会社は助けてくれないんだ」という空気が広がり、初期メンバーの求心力が低下' },
      },
    ],
  },
  {
    id: 'te_remote_debate',
    title: 'リモートvs出社の対立',
    description: 'フルリモート派と出社必須派で組織が二分。エンジニアは「集中できる自宅が最高」、営業は「対面でないと信頼関係が築けない」と一歩も譲らない。Slackで感情的な議論が噴出し始めた。',
    category: 'internal',
    severity: 'neutral',
    conditions: { minTeamSize: 10, probability: 0.06 },
    choices: [
      {
        label: 'フルリモートを維持',
        description: '柔軟な働き方を優先し、採用の幅を全国に広げる',
        effect: { moraleDelta: 3, brandDelta: 5, message: 'フルリモート継続。採用の幅が全国に拡大' },
      },
      {
        label: 'ハイブリッド（週3出社）',
        description: 'バランスを取って両方の意見を取り入れる',
        effect: { cash: -30000, moraleDelta: -3, message: 'ハイブリッド移行。一部の不満は残るが妥協点に' },
      },
      {
        label: '出社必須に戻す',
        description: '対面のコミュニケーションを重視する',
        effect: { cash: -50000, moraleDelta: -10, npsDelta: 3, message: '出社回帰。退職者が出たがチーム密度は向上' },
      },
    ],
  },
  {
    id: 'te_cofounder_clash',
    title: '共同創業者との深刻な対立',
    description: '事業方針を巡って共同創業者と激しく対立。プロダクトの方向性、資金調達の戦略、採用方針 —— あらゆる議題で衝突が起きている。社員は顔色を窺い、意思決定が停滞中。',
    category: 'internal',
    severity: 'critical',
    conditions: { minMonth: 12, probability: 0.04 },
    choices: [
      {
        label: 'ファシリテーターを入れて話し合い',
        description: '外部のエグゼクティブコーチを交えて対話する',
        effect: { cash: -40000, moraleDelta: -5, message: '外部コーチを入れて対話。役割分担を明確化したが、根本的な方向性の違いは残る' },
      },
      {
        label: '持分買い取り',
        description: '¥400Kで共同創業者の株式を買い取り、円満に別れる',
        effect: { cash: -400000, moraleDelta: -12, message: '共同創業者が離脱。チームに大きな衝撃。ただし意思決定は格段に速くなった' },
      },
      {
        label: '新規事業を任せて分離',
        description: '共同創業者に新規事業を任せ、お互いの領域を分ける',
        effect: { cash: -100000, moraleDelta: 3, message: '共同創業者に新規事業を任せることで共存。お互いの強みを活かす形に。ただし経営リソースは分散' },
      },
    ],
  },
];
