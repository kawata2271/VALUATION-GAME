import { GameEvent } from '../../types';

export const teamEvents: GameEvent[] = [
  { id: 'te_cto_quit', title: 'CTO/VP Engineeringの退職', description: '技術責任者が突然の退職を申し出た。「次のチャレンジがしたい」とのこと。開発チームに動揺が広がっている。', category: 'internal', severity: 'critical', conditions: { minTeamSize: 10, probability: 0.04 },
    choices: [
      { label: 'カウンターオファー（給与50%増）', description: '何としても引き留める', effect: { cash: -50000, moraleDelta: 5, message: 'カウンターオファーが成功。だがチーム内に不公平感も' } },
      { label: '送り出して後任を探す', description: '円満退社+採用活動開始', effect: { cash: -100000, moraleDelta: -15, techDebtDelta: 10, message: 'CTO退職。3ヶ月の空白期間が開発に影響' } },
    ],
  },
  { id: 'te_hiring_hard', title: 'エンジニア採用難', description: '3ヶ月間、エンジニアの応募がほぼゼロ。採用市場が売り手市場で、競合他社も高給で奪い合い。', category: 'internal', severity: 'negative', conditions: { minMonth: 6, minTeamSize: 5, probability: 0.07 },
    choices: [
      { label: 'リファラルボーナス制度を導入', description: '社員紹介で¥30K/人のボーナス', effect: { cash: -30000, moraleDelta: 5, message: 'リファラル採用で突破口。社員の紹介で2名の候補者が見つかった' } },
      { label: '採用基準を下げる', description: '経験不問でポテンシャル採用', effect: { cash: -20000, techDebtDelta: 5, moraleDelta: -3, message: '未経験者を採用。育成コストは増えるが人手は確保' } },
    ],
  },
  { id: 'te_harassment', title: '社内ハラスメント報告', description: '匿名の内部通報でハラスメント問題が発覚。迅速かつ適切な対応を怠ると、法的リスクと評判リスクが増大。', category: 'internal', severity: 'critical', conditions: { minTeamSize: 8, probability: 0.04 },
    choices: [
      { label: '即座に第三者委員会を設置', description: '透明性のある調査を実施', effect: { cash: -50000, moraleDelta: -5, brandDelta: 5, message: '第三者委員会の調査を実施。厳正な処分で組織の健全性を回復' } },
      { label: '社内で対処', description: '当事者間での解決を図る', effect: { cash: -20000, moraleDelta: -15, brandDelta: -10, message: '内部処理を試みたが、不満が残り退職者が発生' } },
    ],
  },
  { id: 'te_keyman_poach', title: 'トップセールスの引き抜き', description: '売上の20%を1人で稼いでいたトップセールスに、競合から年俸2倍のオファーが来ている。', category: 'internal', severity: 'negative', conditions: { minTeamSize: 5, probability: 0.06 },
    choices: [
      { label: '給与交渉+ストックオプション追加', description: '金銭面で対抗', effect: { cash: -40000, moraleDelta: 3, message: 'カウンターオファーで引き留めに成功' } },
      { label: '送り出す', description: '1人に依存しない組織を目指す', effect: { mrrMultiplier: 0.9, moraleDelta: -8, customersDelta: -3, message: 'エースの退職。短期的に売上ダウンだが組織は強化方向へ' } },
    ],
  },
  { id: 'te_labor_issue', title: '労務問題の発覚', description: '労基署から調査が入った。一部社員の残業時間が法定基準を超過しており、是正勧告の可能性。', category: 'internal', severity: 'negative', conditions: { minTeamSize: 10, probability: 0.05 },
    choices: [
      { label: '即座に是正+残業代精算', description: '法令遵守を最優先', effect: { cash: -80000, moraleDelta: 5, brandDelta: 3, message: '労務体制を全面改善。コスト増だが健全な組織へ' } },
      { label: '最低限の対応', description: '指摘された部分のみ修正', effect: { cash: -20000, moraleDelta: -5, message: '最低限の是正を実施。根本解決には至らず' } },
    ],
  },
  { id: 'te_star_apply', title: '超優秀人材からの応募', description: 'FAANG出身のスーパースターがあなたの会社に興味を持っている。年俸¥300Kの希望だが、チーム全体の底上げになる。', category: 'internal', severity: 'positive', conditions: { minMonth: 6, probability: 0.05 },
    choices: [
      { label: '即座にオファー', description: '¥300Kは高いが投資価値あり', effect: { cash: -300000, moraleDelta: 10, techDebtDelta: -8, npsDelta: 5, message: 'スター人材がチームに参加！一気にレベルアップ' } },
      { label: '見送る', description: '今の予算では厳しい', effect: { message: '泣く泣く見送り。いつかこの規模の採用ができるようになりたい' } },
    ],
  },
  { id: 'te_silo', title: '組織のサイロ化', description: '開発チームと営業チームの間に深い溝ができている。「営業が無理な約束をする」「開発が要望を無視する」と非難合戦。', category: 'internal', severity: 'negative', conditions: { minTeamSize: 15, probability: 0.06 },
    choices: [
      { label: 'クロスファンクショナルチーム導入', description: '部門横断チームを編成', effect: { cash: -40000, moraleDelta: 10, npsDelta: 3, message: '部門の壁を壊し、顧客起点のチームに再編成' } },
      { label: '定例の合同ミーティングを開催', description: '週1回の情報共有会', effect: { moraleDelta: 5, message: '合同ミーティングで相互理解が進んだ' } },
    ],
  },
  { id: 'te_so_exercise', title: 'ストックオプション行使期限', description: '初期メンバー数名のストックオプション行使期限が近づいている。行使資金がなければ権利が消滅する。', category: 'internal', severity: 'neutral', conditions: { minMonth: 24, minTeamSize: 5, probability: 0.05 },
    choices: [
      { label: '会社でローン支援', description: '行使資金を貸し付け', effect: { cash: -30000, moraleDelta: 10, message: '初期メンバーのSO行使を支援。ロイヤリティが向上' } },
      { label: '個人の判断に委ねる', description: '自己責任で対応してもらう', effect: { moraleDelta: -5, message: '一部メンバーがSO行使を断念。不満の声も' } },
    ],
  },
  { id: 'te_remote_debate', title: 'リモートvs出社の対立', description: 'フルリモート派と出社必須派で組織が二分。どちらに決めても一方の不満が爆発する危険。', category: 'internal', severity: 'neutral', conditions: { minTeamSize: 10, probability: 0.06 },
    choices: [
      { label: 'フルリモートを維持', description: '柔軟な働き方を優先', effect: { moraleDelta: 3, brandDelta: 5, message: 'フルリモート継続。採用の幅が全国に拡大' } },
      { label: 'ハイブリッド（週3出社）', description: 'バランスを取る', effect: { cash: -30000, moraleDelta: -3, message: 'ハイブリッド移行。一部の不満は残るが妥協点に' } },
      { label: '出社必須に戻す', description: '対面のコミュニケーションを重視', effect: { cash: -50000, moraleDelta: -10, npsDelta: 3, message: '出社回帰。退職者が出たがチーム密度は向上' } },
    ],
  },
  { id: 'te_cofounder_clash', title: '共同創業者との深刻な対立', description: '事業方針を巡って共同創業者と激しく対立。このまま放置すると組織が分裂する恐れ。', category: 'internal', severity: 'critical', conditions: { minMonth: 12, probability: 0.04 },
    choices: [
      { label: '話し合いで解決を試みる', description: 'ファシリテーターを交えて対話', effect: { cash: -30000, moraleDelta: -5, message: '話し合いの結果、役割分担を明確化。ただし溝は完全には埋まらず' } },
      { label: '持分買い取り', description: '¥300Kで円満に別れる', effect: { cash: -300000, moraleDelta: -10, message: '共同創業者が離脱。寂しいが、意思決定は速くなった' } },
    ],
  },
];
