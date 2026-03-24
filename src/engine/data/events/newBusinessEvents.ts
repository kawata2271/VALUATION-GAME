import { GameEvent } from '../../types';

export const newBusinessEvents: GameEvent[] = [
  { id: 'nb_cannibalize', title: 'カニバリゼーション発生', description: '新規事業がメイン事業の顧客を食い始めている。社内で「共食い」の懸念が広がる。', category: 'internal', severity: 'negative', conditions: { minMonth: 18, probability: 0.05 },
    choices: [
      { label: 'ターゲットを明確に分ける', description: 'セグメント分けで共食いを防止', effect: { cash: -30000, npsDelta: 3, moraleDelta: 5, message: 'ターゲットの棲み分けに成功。カニバリゼーションを最小化' } },
      { label: '統合プランで解決', description: 'バンドル販売でARPU向上', effect: { cash: -40000, mrrMultiplier: 1.05, customersDelta: 3, message: 'バンドル販売で両事業のARPU向上。Win-Winに' } },
    ],
  },
  { id: 'nb_spinout_demand', title: '新規事業チームの独立要求', description: '新規事業のリーダーが「スピンアウトして独立会社にしたい」と申し出た。チームの士気は高い。', category: 'internal', severity: 'neutral', conditions: { minMonth: 24, probability: 0.04 },
    choices: [
      { label: 'スピンアウトを認める', description: '一部持分を保持して独立させる', effect: { cash: 100000, moraleDelta: -5, brandDelta: 5, message: '新規事業をスピンアウト。持分を維持しつつ独立会社に' } },
      { label: '社内事業として継続', description: 'シナジーを重視', effect: { cash: -20000, moraleDelta: -8, message: '独立を認めず。リーダーの不満が残る' } },
    ],
  },
  { id: 'nb_surprise_pmf', title: '新規事業で予想外のPMF達成', description: '新規事業が予想を大幅に上回るペースでPMFを達成。顧客からの引き合いが処理しきれないほど。', category: 'product', severity: 'positive', conditions: { minMonth: 12, probability: 0.05 },
    autoEffect: { cash: 100000, moraleDelta: 15, brandDelta: 10, customersDelta: 10, message: '新規事業が爆速でPMF達成！リソース再配分の好機' },
  },
  { id: 'nb_main_stagnation', title: 'メイン事業の停滞 vs 新規事業の成長', description: 'メイン事業の成長率が鈍化する一方、新規事業が急成長。経営の軸足をどちらに置くか、重大な判断の時。', category: 'internal', severity: 'neutral', conditions: { minMonth: 24, probability: 0.04 },
    choices: [
      { label: '新規事業を主力に据える', description: '大胆なリソースシフト', effect: { cash: -100000, brandDelta: 10, moraleDelta: 5, customersDelta: 5, message: '新規事業を主力事業にシフト。大胆な経営判断' } },
      { label: 'メイン事業の立て直しを優先', description: '基盤を固める', effect: { cash: -50000, moraleDelta: -3, message: 'メイン事業のテコ入れに注力。新規事業は現状維持' } },
    ],
  },
  { id: 'nb_overinvest', title: '新規事業への過剰投資', description: '新規事業に予算を注ぎ込みすぎた結果、メイン事業のキャッシュフローが圧迫されている。', category: 'internal', severity: 'negative', conditions: { minMonth: 18, probability: 0.05 },
    choices: [
      { label: '新規事業の予算をカット', description: 'メイン事業の資金繰りを優先', effect: { cash: 50000, moraleDelta: -8, message: '新規事業の予算を30%カット。成長は鈍化するが本体は安定' } },
      { label: '追加調達で対応', description: '両立のために資金を増やす', effect: { cash: 300000, message: '追加調達で両事業に投資継続。ただし希薄化は進む' } },
    ],
  },
  { id: 'nb_retreat_decision', title: '新規事業の撤退判断', description: '6ヶ月経っても新規事業のPMFが見えない。追加投資するか、撤退してサンクコストを切るか。', category: 'internal', severity: 'negative', conditions: { minMonth: 12, probability: 0.05 },
    choices: [
      { label: '撤退する', description: 'サンクコストに囚われない', effect: { moraleDelta: -10, cash: 50000, message: '新規事業から撤退。痛みは大きいが、リソースをメイン事業に集中' } },
      { label: 'もう3ヶ月だけ続ける', description: 'あと少しで芽が出るかも', effect: { cash: -100000, moraleDelta: -3, message: '新規事業を継続。結果を出すまでの猶予はあと3ヶ月' } },
    ],
  },
  { id: 'nb_crosssell_success', title: '新旧事業のクロスセル成功', description: '既存顧客への新規事業プロダクトの提案が大好評。ARPUが一気に向上。', category: 'customer', severity: 'positive', conditions: { minMonth: 18, probability: 0.05 },
    autoEffect: { cash: 150000, mrrMultiplier: 1.08, npsDelta: 5, moraleDelta: 5, customersDelta: 5, message: 'クロスセル大成功！既存顧客のARPUが大幅向上' },
  },
  { id: 'nb_new_cto', title: '新規事業専任CTOの採用', description: '新規事業の技術責任者として業界の著名エンジニアを口説き落とすチャンス。ただし年俸は¥400K。', category: 'internal', severity: 'positive', conditions: { minMonth: 12, probability: 0.04 },
    choices: [
      { label: '採用する', description: '¥400Kの投資', effect: { cash: -400000, moraleDelta: 10, techDebtDelta: -5, brandDelta: 5, message: '新規事業専任CTOを採用。技術力が一気に向上' } },
      { label: '見送る', description: 'コストが高すぎる', effect: { cash: -10000, message: '予算の都合で見送り。社内メンバーで進める' } },
    ],
  },
  { id: 'nb_market_dominant', title: '新規事業の競合が市場を独占', description: '新規事業が参入を狙っていた市場で、強力な競合が圧倒的なシェアを確立。後発参入の壁が高い。', category: 'competitor', severity: 'negative', conditions: { minMonth: 12, probability: 0.05 },
    choices: [
      { label: 'ニッチ戦略で攻める', description: '競合がカバーしない隙間を狙う', effect: { cash: -50000, brandDelta: 5, customersDelta: 3, message: 'ニッチ市場でポジション確立。大手の死角を突く戦略' } },
      { label: '別市場に切り替え', description: 'この市場は諦める', effect: { cash: -40000, moraleDelta: -5, message: '市場変更を決断。時間は失ったが、判断は早いほうがいい' } },
    ],
  },
  { id: 'nb_buyout_offer', title: '新規事業のバイアウトオファー', description: '新規事業に対して、大手企業から¥5Mでの事業買収オファー。部分的エグジットの機会。', category: 'external', severity: 'positive', conditions: { minMonth: 24, probability: 0.03 },
    choices: [
      { label: '売却する', description: '¥5Mのキャッシュを獲得', effect: { cash: 5000000, moraleDelta: -5, message: '新規事業を¥5Mで売却。メイン事業に集中する資金を獲得' } },
      { label: '保持する', description: 'まだ成長の余地がある', effect: { cash: -30000, moraleDelta: 5, message: '売却オファーを拒否。自分たちで大きく育てる' } },
    ],
  },
];
