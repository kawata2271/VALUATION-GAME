import { GameEvent } from '../../types';

export const pivotEvents: GameEvent[] = [
  { id: 'pv_mentor_advice', title: 'メンターからの助言「やり直す勇気」', description: '信頼するメンターから「今のまま続けても先はない。ピボットする勇気を持て」と助言を受けた。', category: 'internal', severity: 'neutral', conditions: { minMonth: 6, probability: 0.05 },
    choices: [
      { label: 'ピボットを真剣に検討する', description: '事業転換の可能性を探る', effect: { moraleDelta: 5, message: 'メンターの助言を受け、ピボットの検討を開始' } },
      { label: '今の事業を信じて続ける', description: '初志貫徹', effect: { moraleDelta: 3, message: 'メンターの助言に感謝しつつ、現事業に集中する決断' } },
    ],
  },
  { id: 'pv_customer_plea', title: '旧事業顧客からの引き留め', description: 'ピボットの噂を聞いた既存顧客から「お願いだから続けてくれ」と懇願のメールが殺到。', category: 'customer', severity: 'neutral', conditions: { minMonth: 6, probability: 0.04 },
    autoEffect: { moraleDelta: -5, message: '既存顧客からの引き留めが続く。ピボットの決断が揺らぐ' },
  },
  { id: 'pv_pmf_signal', title: 'ピボット先でPMFの兆し', description: '新しい事業領域で、まだ少ないながらも熱狂的なユーザーが現れ始めた。「これ待ってた！」との声。', category: 'product', severity: 'positive', conditions: { minMonth: 3, probability: 0.05 },
    autoEffect: { npsDelta: 10, moraleDelta: 15, brandDelta: 5, message: 'ピボット先で初期PMFの兆候！チームのモチベーション急上昇' },
  },
  { id: 'pv_team_split', title: 'ピボットに伴うチーム分裂', description: '一部のメンバーが「旧事業に戻したい」と主張し、チームが二分。説得が必要。', category: 'internal', severity: 'negative', conditions: { minTeamSize: 5, probability: 0.05 },
    choices: [
      { label: 'ビジョンを共有する全社集会', description: 'なぜピボットするのか、徹底的に説明', effect: { moraleDelta: 5, message: '全社集会でビジョンを共有。大半のメンバーが納得' } },
      { label: '反対派には退職を促す', description: '方向性が合わない人には別の道を', effect: { moraleDelta: -10, message: '反対派が退職。短期的な戦力ダウンだが組織は一枚岩に' } },
    ],
  },
  { id: 'pv_investor_oppose', title: '投資家のピボット反対', description: '主要投資家が「ピボットには反対。もう少し今の事業で頑張るべき」と追加出資を凍結すると通告。', category: 'external', severity: 'negative', conditions: { minMonth: 6, probability: 0.04 },
    choices: [
      { label: 'データで投資家を説得', description: '市場分析と事業計画で論破', effect: { brandDelta: 5, moraleDelta: 5, message: 'データに基づく説得が成功。投資家が渋々了承' } },
      { label: 'ピボットを延期', description: '投資家の意向を尊重', effect: { moraleDelta: -10, message: 'ピボット延期。投資家との関係は維持したが、チームは不満' } },
    ],
  },
  { id: 'pv_media_comeback', title: 'ピボット成功後のメディア取材', description: '「死の淵から蘇ったSaaS企業」としてメディアから取材依頼が殺到。復活劇がストーリーに。', category: 'external', severity: 'positive', conditions: { minMonth: 12, probability: 0.04 },
    autoEffect: { brandDelta: 25, customersDelta: 15, cacMultiplier: 0.5, moraleDelta: 10, message: 'ピボット成功の復活劇がメディアに取り上げられ大反響！' },
  },
  { id: 'pv_second_pivot', title: 'ピボット先でも不調', description: 'ピボットした新事業でも思うように成果が出ない。二度目のピボットか撤退かの分水嶺。', category: 'internal', severity: 'critical', conditions: { minMonth: 12, probability: 0.04 },
    choices: [
      { label: 'もう一度ピボット', description: '三度目の正直を信じる', effect: { moraleDelta: -10, cash: -50000, message: '再ピボットを決断。チームの士気は低いが、まだ諦めない' } },
      { label: '現事業で粘る', description: 'これ以上の方向転換はリスク', effect: { moraleDelta: -5, message: '現事業で粘る決断。小さな改善を積み重ねる方針に' } },
    ],
  },
  { id: 'pv_asset_sale', title: '旧事業アセットの売却オファー', description: '旧事業で築いた技術やデータに興味を持つ企業から、アセット買取の提案が来た。', category: 'external', severity: 'positive', conditions: { minMonth: 6, probability: 0.04 },
    choices: [
      { label: 'アセットを売却', description: '¥200Kのキャッシュを獲得', effect: { cash: 200000, message: '旧事業のアセットを売却。ピボット後の資金に充当' } },
      { label: '保持する', description: '将来活用する可能性がある', effect: { message: '旧事業のアセットは保持。いつか活きるかもしれない' } },
    ],
  },
  { id: 'pv_acquihire', title: 'ピボット中にアクハイヤー提案', description: '大手企業から「チームごと来ないか」という提案。チームメンバーには好条件だが、夢は終わる。', category: 'external', severity: 'neutral', conditions: { minMonth: 12, probability: 0.03 },
    choices: [
      { label: 'アクハイヤーを受ける', description: 'チーム全員に好条件を保証', effect: { cash: 500000, moraleDelta: -20, message: 'アクハイヤーを受け入れ。会社としては終わりだが、チームは救われた' } },
      { label: '断固として断る', description: '独立を貫く', effect: { moraleDelta: 10, message: '独立を選択。自分たちの力で道を切り開く' } },
    ],
  },
  { id: 'pv_burn_acceleration', title: 'ピボット中のバーンレート加速', description: 'ピボットの開発投資でバーンレートが1.5倍に膨らんでいる。ランウェイが急速に縮小中。', category: 'internal', severity: 'negative', conditions: { minMonth: 6, probability: 0.05 },
    choices: [
      { label: '追加調達を急ぐ', description: 'ブリッジラウンドで凌ぐ', effect: { cash: 200000, message: 'ブリッジ調達でランウェイを延長。ただし条件は厳しめ' } },
      { label: 'コスト削減', description: '不要な出費を徹底カット', effect: { moraleDelta: -8, message: 'コスト削減で対応。チームに負担がかかる' } },
    ],
  },
];
