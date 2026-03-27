// ===== 面談イベント定義（全36種） =====
// 各面談ステージで6種以上のランダムイベントが発生する

import type { InterviewEvent } from './types';

export const interviewEvents: InterviewEvent[] = [

  // ============================================================
  // カジュアル面談（casual_talk）— 7種
  // ============================================================

  {
    id: 'ct_vision_question',
    stage: 'casual_talk',
    title: '事業ビジョンへの質問',
    description: '候補者が「御社はどんな世界を目指しているんですか？」と目を輝かせて聞いてきました。',
    choices: [
      {
        label: '熱意を込めてビジョンを語る',
        description: '創業からの想いとプロダクトの未来像を語る',
        effects: {
          interestDelta: 15,
          message: '候補者の目がさらに輝いた。「ぜひ詳しく聞かせてください」と前のめりに。',
        },
      },
      {
        label: '数字で事業を説明する',
        description: 'TAM・成長率・KPIなど定量的に説明',
        effects: {
          interestDelta: 5,
          revealAbility: 'analytics',
          message: '候補者は冷静に数字を分析。「面白いマーケットですね」と評価。analytics能力の片鱗が見えた。',
        },
      },
      {
        label: '曖昧に答える',
        description: '具体的なことはまだ言えないと濁す',
        effects: {
          interestDelta: -10,
          message: '候補者の表情が曇った。「もう少し方向性が見えてから改めて…」',
        },
      },
    ],
  },

  {
    id: 'ct_team_culture',
    stage: 'casual_talk',
    title: 'チーム文化への関心',
    description: '「チームの雰囲気ってどんな感じですか？」候補者が働き方について質問してきました。',
    choices: [
      {
        label: 'オープンなカルチャーを強調',
        description: 'フラットな組織、1on1文化、心理的安全性を説明',
        effects: {
          interestDelta: 10,
          revealAbility: 'communication',
          message: '候補者は安心した様子。コミュニケーション力の高さが感じられた。',
        },
      },
      {
        label: '成長機会を強調',
        description: 'スキルアップ、裁量権の大きさ、チャレンジ環境を説明',
        effects: {
          interestDelta: 8,
          revealAbility: 'growth',
          message: '候補者の目が輝いた。学習意欲の高さが伝わってきた。',
        },
      },
      {
        label: '正直に課題も伝える',
        description: '良い面だけでなく、組織の課題も率直に共有',
        effects: {
          interestDelta: 3,
          companyReputationDelta: 2,
          message: '候補者は「正直に話してくれてありがたい」と好印象。信頼関係が芽生えた。',
        },
      },
    ],
  },

  {
    id: 'ct_salary_early',
    stage: 'casual_talk',
    title: '早すぎる給与の話',
    description: '候補者が開口一番「年収はどのくらい出ますか？」と聞いてきました。少し早い気もしますが…',
    choices: [
      {
        label: 'レンジを正直に伝える',
        description: '「このポジションは○○〜○○万円です」と明確に',
        effects: {
          interestDelta: 5,
          salaryExpectationDelta: -20,
          message: '候補者は「なるほど、想定の範囲内です」と安心した様子。',
        },
      },
      {
        label: '先に仕事内容の話をしたいと切り返す',
        description: '「まず中身の話をさせてください」と丁寧に誘導',
        effects: {
          interestDelta: -5,
          message: '候補者はやや不満げ。「給与は大事な条件なのに…」という空気。',
        },
      },
      {
        label: '「成果次第で青天井」と匂わせる',
        description: 'パフォーマンスに応じた報酬体系を強調',
        effects: {
          interestDelta: 8,
          salaryExpectationDelta: 30,
          message: '候補者は期待が膨らんだ様子。ただし期待値も上がってしまった。',
        },
      },
    ],
  },

  {
    id: 'ct_personal_story',
    stage: 'casual_talk',
    title: '候補者の転職理由',
    description: '候補者が前職を離れた理由を話し始めました。どう深掘りしますか？',
    choices: [
      {
        label: '共感しながら傾聴する',
        description: '「大変でしたね」と寄り添いながら話を聞く',
        effects: {
          interestDelta: 12,
          revealAbility: 'stamina',
          message: '候補者は心を開いてくれた。メンタルの強さ（or 脆さ）が垣間見えた。',
        },
      },
      {
        label: '次にやりたいことを聞く',
        description: '過去より未来に焦点を当てる',
        effects: {
          interestDelta: 8,
          revealAbility: 'growth',
          message: '候補者は目を輝かせてキャリアプランを語った。成長意欲が伝わる。',
        },
      },
    ],
  },

  {
    id: 'ct_product_demo',
    stage: 'casual_talk',
    title: 'プロダクトデモの反応',
    description: 'プロダクトのデモを見せたところ、候補者がいくつか鋭い質問をしてきました。',
    choices: [
      {
        label: '技術的な詳細を説明する',
        description: 'アーキテクチャや技術スタックについて話す',
        effects: {
          interestDelta: 10,
          revealAbility: 'coding',
          message: '候補者は技術的な理解が深い。コーディング力の片鱗が見えた。',
        },
      },
      {
        label: 'ユーザー体験について議論する',
        description: '顧客の課題解決にフォーカスして説明',
        effects: {
          interestDelta: 8,
          revealAbility: 'domainKnowledge',
          message: '候補者は業界知識が豊富で、的確なフィードバックをくれた。',
        },
      },
    ],
  },

  {
    id: 'ct_competitor_mention',
    stage: 'casual_talk',
    title: '競合他社の話題',
    description: '候補者が「○○社さんとの違いは何ですか？」と競合について聞いてきました。',
    choices: [
      {
        label: '差別化ポイントを明確に説明',
        description: '自社の強みと競合の弱点を論理的に説明',
        effects: {
          interestDelta: 10,
          message: '候補者は「なるほど、クリアに理解できました」と納得の表情。',
        },
      },
      {
        label: '競合を褒めつつ自社の方向性を語る',
        description: '相手を尊重しながら独自路線を説明',
        effects: {
          interestDelta: 12,
          companyReputationDelta: 1,
          message: '候補者は「業界への理解が深い」と好印象。器の大きさが伝わった。',
        },
      },
      {
        label: '競合の悪口を言ってしまう',
        description: 'つい熱くなって競合を批判',
        effects: {
          interestDelta: -8,
          companyReputationDelta: -2,
          message: '候補者は引いている。「器の小さい会社かも…」という印象を与えてしまった。',
        },
      },
    ],
  },

  {
    id: 'ct_casual_vibe',
    stage: 'casual_talk',
    title: 'カジュアルすぎる雰囲気',
    description: '面談が盛り上がりすぎて、ビジネスの話がほとんどできていません。どうしますか？',
    choices: [
      {
        label: '自然にビジネスの話題に戻す',
        description: '「ところで、今のお仕事では…」とスムーズに誘導',
        effects: {
          interestDelta: 5,
          revealAbility: 'leadership',
          message: '自然な流れでビジネスの話に。候補者のリーダーシップについて聞けた。',
        },
      },
      {
        label: 'このまま楽しく話す',
        description: '関係構築を優先。仕事の話は次回に',
        effects: {
          interestDelta: 15,
          message: '候補者はすっかりリラックス。「楽しい会社ですね！」と好印象だが、能力は見えず。',
        },
      },
    ],
  },

  // ============================================================
  // 一次面接（first_interview）— 7種
  // ============================================================

  {
    id: 'fi_failure_experience',
    stage: 'first_interview',
    title: '失敗経験の共有',
    description: '候補者が前職での大きな失敗について話し始めました。どう対応しますか？',
    choices: [
      {
        label: '共感を示して深掘りする',
        description: '「どう乗り越えたか」を丁寧に聞く',
        effects: {
          interestDelta: 10,
          revealAbility: 'stamina',
          message: '候補者は安心して話してくれた。逆境でのメンタルの強さが見えた。',
        },
      },
      {
        label: '自社での活かし方を提案する',
        description: 'その経験がうちでどう活きるか具体的に説明',
        effects: {
          interestDelta: 8,
          revealAbility: 'leadership',
          message: '候補者は「この会社なら成長できそう」と前向きに。リーダー資質も感じた。',
        },
      },
      {
        label: 'さらっと流して次の質問へ',
        description: '時間が限られているので効率重視',
        effects: {
          interestDelta: -5,
          message: '候補者は少し残念そう。「話を聞いてもらえなかった」という印象。',
        },
      },
    ],
  },

  {
    id: 'fi_technical_deep',
    stage: 'first_interview',
    title: '技術的深掘り',
    description: '候補者が技術スタックについて質問してきました。「どんな技術使ってますか？」',
    choices: [
      {
        label: '最新技術を導入予定と伝える',
        description: '技術的な挑戦ができる環境をアピール',
        effects: {
          interestDelta: 10,
          salaryExpectationDelta: 20,
          revealAbility: 'coding',
          message: '候補者は技術への情熱を見せた。ただし期待値も上がった。コーディング力を確認。',
        },
      },
      {
        label: '正直に現状を伝える',
        description: 'レガシーな部分も含めて正直に説明',
        effects: {
          interestDelta: 0,
          revealAbility: 'coding',
          companyReputationDelta: 1,
          message: '候補者は「正直な会社だ」と評価。技術力は確認できた。信頼が少し増した。',
        },
      },
    ],
  },

  {
    id: 'fi_work_style',
    stage: 'first_interview',
    title: '働き方へのこだわり',
    description: '候補者が「リモートワークは可能ですか？残業は多いですか？」と働き方を重視している様子。',
    choices: [
      {
        label: '柔軟な働き方をアピール',
        description: 'リモート・フレックスの制度を説明',
        effects: {
          interestDelta: 12,
          revealAbility: 'stamina',
          message: '候補者は安心した様子。ワークライフバランスを重視するタイプと判明。',
        },
      },
      {
        label: '成長フェーズの現実を伝える',
        description: '忙しい時期もあるが、やりがいがあると説明',
        effects: {
          interestDelta: -3,
          revealAbility: 'stamina',
          message: '候補者はやや慎重に。スタミナへの期待値が見えた。',
        },
      },
      {
        label: '「成果主義なので時間は関係ない」',
        description: '結果を出せば自由というスタンス',
        effects: {
          interestDelta: 5,
          message: '候補者は「なるほど…」と考え込んでいる。合う人には合うスタイル。',
        },
      },
    ],
  },

  {
    id: 'fi_portfolio_review',
    stage: 'first_interview',
    title: 'ポートフォリオ/実績レビュー',
    description: '候補者が過去の実績やポートフォリオを見せてくれました。',
    choices: [
      {
        label: '具体的な成果について深掘り',
        description: '数字やインパクトを詳しく聞く',
        effects: {
          interestDelta: 5,
          revealAbility: 'analytics',
          bonusRevealCount: 1,
          message: '候補者の分析力と実績が見えた。追加で1つの能力も判明。',
        },
      },
      {
        label: 'チームでの役割を聞く',
        description: '個人の貢献とチームワークのバランスを確認',
        effects: {
          interestDelta: 5,
          revealAbility: 'communication',
          message: '候補者のチームでの立ち回りが見えた。コミュニケーション力を確認。',
        },
      },
    ],
  },

  {
    id: 'fi_culture_mismatch_sign',
    stage: 'first_interview',
    title: 'カルチャーミスマッチの兆候',
    description: '候補者の発言から、自社のカルチャーとのズレを感じる瞬間がありました。「前職ではトップダウンが当たり前で…」',
    choices: [
      {
        label: '自社のスタイルを丁寧に説明',
        description: '違いを理解した上で判断してもらう',
        effects: {
          interestDelta: 3,
          revealAbility: 'communication',
          message: '候補者は「新しい環境も面白そう」と前向き。適応力がありそう。',
        },
      },
      {
        label: '率直に懸念を伝える',
        description: '「正直、うちとは合わないかもしれません」と正直に',
        effects: {
          interestDelta: -8,
          companyReputationDelta: 2,
          message: '候補者は驚いたが「正直な方ですね」と一定の評価。ミスマッチは避けられるかも。',
        },
      },
    ],
  },

  {
    id: 'fi_question_quality',
    stage: 'first_interview',
    title: '鋭い逆質問',
    description: '候補者から「御社のユニットエコノミクスはどうなっていますか？」と鋭い質問が飛んできました。',
    choices: [
      {
        label: '詳細にデータを共有する',
        description: 'LTV/CAC、チャーンレート等を包み隠さず',
        effects: {
          interestDelta: 15,
          revealAbility: 'analytics',
          message: '候補者は「データドリブンな会社だ」と高評価。分析力の高さも確認。',
        },
      },
      {
        label: '概要だけ伝える',
        description: '詳細は入社後に共有すると説明',
        effects: {
          interestDelta: -3,
          message: '候補者はやや不満げ。「隠し事があるのでは…」という空気。',
        },
      },
    ],
  },

  {
    id: 'fi_unexpected_skill',
    stage: 'first_interview',
    title: '意外なスキルの発見',
    description: '面接中、候補者が応募職種とは別の分野で高い見識を示しました。「実は前職でデータ分析も…」',
    choices: [
      {
        label: '興味を持って深掘りする',
        description: 'その能力を自社でどう活かせるか一緒に考える',
        effects: {
          interestDelta: 10,
          revealAbility: 'domainKnowledge',
          revealBestFit: true,
          message: '候補者は嬉しそう。「そこを評価してくれるんですね！」隠し適職のヒントかもしれない。',
        },
      },
      {
        label: '応募職種に話を戻す',
        description: '今回のポジションに集中して評価',
        effects: {
          interestDelta: -3,
          message: '候補者は少しがっかり。多面的な評価を期待していた様子。',
        },
      },
    ],
  },

  // ============================================================
  // 二次面接（second_interview）— 7種
  // ============================================================

  {
    id: 'si_competitor_offer',
    stage: 'second_interview',
    title: '競合オファーの発覚',
    description: '候補者から「実は他社からもオファーをいただいていまして…」と告白がありました。',
    choices: [
      {
        label: '給与を上乗せ提示',
        description: '「条件面では負けません」とアピール',
        effects: {
          interestDelta: 8,
          salaryExpectationDelta: 50,
          message: '候補者は「ありがたい」と反応。ただし期待年収が大幅にアップ。',
        },
      },
      {
        label: '成長機会で勝負',
        description: 'キャリアの成長と裁量権をアピール',
        effects: {
          interestDelta: 10,
          message: '候補者は「確かに、成長できる環境が大事ですね」と考え直した様子。',
        },
      },
      {
        label: '急いで最終面接を設定',
        description: 'プロセスを加速して囲い込む',
        effects: {
          interestDelta: 3,
          revealAbility: 'creativity',
          message: '面接を前倒し。限られた時間で候補者の創造力を垣間見ることができた。',
        },
      },
    ],
  },

  {
    id: 'si_team_meeting',
    stage: 'second_interview',
    title: 'チームメンバーとの顔合わせ',
    description: '候補者が実際のチームメンバーと会話する機会を設けました。',
    choices: [
      {
        label: 'ランチ会を設定',
        description: 'リラックスした雰囲気でチームと交流',
        effects: {
          interestDelta: 12,
          revealAbility: 'communication',
          message: '候補者はチームと打ち解けた。「いい人たちですね！」コミュニケーション力も確認。',
        },
      },
      {
        label: '技術討論会を設定',
        description: '技術的なディスカッションで実力を確認',
        effects: {
          interestDelta: 5,
          revealAbility: 'coding',
          bonusRevealCount: 1,
          message: '候補者は議論で実力を発揮。技術力と追加の能力が見えた。',
        },
      },
    ],
  },

  {
    id: 'si_case_study',
    stage: 'second_interview',
    title: 'ケーススタディ課題',
    description: '候補者に実際の業務に近いケーススタディを出題しました。',
    choices: [
      {
        label: '難易度高めの課題を出す',
        description: '実力の上限を見極める',
        effects: {
          interestDelta: -3,
          revealAbility: 'analytics',
          bonusRevealCount: 2,
          message: '候補者は苦戦しつつも取り組んだ。分析力と他の能力も見えたが、プレッシャーを感じた様子。',
        },
      },
      {
        label: '実務レベルの課題を出す',
        description: '実際の業務に即した現実的な課題',
        effects: {
          interestDelta: 5,
          revealAbility: 'domainKnowledge',
          bonusRevealCount: 1,
          message: '候補者は自信を持って取り組んだ。業界知識の深さが確認できた。',
        },
      },
      {
        label: '課題は出さず対話ベースで評価',
        description: '候補者の思考プロセスを会話で見る',
        effects: {
          interestDelta: 8,
          revealAbility: 'creativity',
          message: 'リラックスした雰囲気で候補者の創造力が見えた。好印象を維持。',
        },
      },
    ],
  },

  {
    id: 'si_reference_mention',
    stage: 'second_interview',
    title: '前職の評判',
    description: '偶然にも、あなたの知人が候補者の前職の同僚でした。「あの人のこと？」',
    choices: [
      {
        label: 'リファレンスを依頼する',
        description: '知人に候補者の評判を聞く',
        effects: {
          interestDelta: 0,
          revealAbility: 'leadership',
          revealTrait: true,
          message: 'リファレンスの結果、リーダーシップの実態と特殊な特性が判明。',
        },
      },
      {
        label: '本人に直接聞く',
        description: '候補者自身に前職での評判を聞く',
        effects: {
          interestDelta: 5,
          revealAbility: 'communication',
          message: '候補者は正直に答えてくれた。コミュニケーション力を確認。',
        },
      },
    ],
  },

  {
    id: 'si_salary_probe',
    stage: 'second_interview',
    title: '待遇への本音',
    description: '候補者が「正直なところ、給与面はどこまで柔軟ですか？」と踏み込んできました。',
    choices: [
      {
        label: '予算の範囲内で最大限の条件を提示',
        description: '具体的な数字を出して誠意を見せる',
        effects: {
          interestDelta: 10,
          salaryExpectationDelta: -30,
          message: '候補者は「誠実に対応してくれる」と好印象。期待値も現実的に。',
        },
      },
      {
        label: 'SOや福利厚生も含めたパッケージで説明',
        description: '年収だけでなくトータルコンペンセーションを提示',
        effects: {
          interestDelta: 8,
          message: '候補者は「SOは魅力的ですね」と前向き。トータルでの検討に。',
        },
      },
      {
        label: '「オファー時に詳しく」と先送り',
        description: '今は詳細を詰めず先に進む',
        effects: {
          interestDelta: -5,
          message: '候補者はやや不安げ。「はぐらかされた？」という空気。',
        },
      },
    ],
  },

  {
    id: 'si_specialist_hint',
    stage: 'second_interview',
    title: '意外な専門性の発見',
    description: '面接の中で、候補者が応募職種の枠を超えた深い専門性を見せました。',
    triggerCondition: { isSpecialist: true },
    choices: [
      {
        label: '「その分野、もっと聞かせてください！」',
        description: '好奇心を示して深掘りする',
        effects: {
          interestDelta: 12,
          bonusRevealCount: 2,
          revealBestFit: true,
          message: '候補者は嬉しそうに語り出した。突出した専門性が明らかに。適職のヒントかも。',
        },
      },
      {
        label: 'メモだけして面接を進める',
        description: '今回のポジション評価を優先',
        effects: {
          interestDelta: 0,
          message: '面接は予定通り進行。スペシャリストの真価を見逃したかもしれない。',
        },
      },
    ],
  },

  {
    id: 'si_pressure_test',
    stage: 'second_interview',
    title: '圧迫質問の誘惑',
    description: '面接官の一人が「少し厳しめの質問をしてみましょうか？」と提案しています。',
    choices: [
      {
        label: '圧迫質問をする',
        description: 'ストレス耐性を見る',
        effects: {
          interestDelta: -10,
          revealAbility: 'stamina',
          bonusRevealCount: 1,
          message: '候補者は動揺しつつも対応。スタミナが見えたが、印象は悪化。',
        },
      },
      {
        label: '通常の質問を続ける',
        description: '候補者をリスペクトした面接を維持',
        effects: {
          interestDelta: 5,
          companyReputationDelta: 1,
          message: '丁寧な面接に候補者は好印象。「人を大切にする会社」という評価。',
        },
      },
    ],
  },

  // ============================================================
  // 最終面接（final_interview）— 8種
  // ============================================================

  {
    id: 'fn_culture_fit_deep',
    stage: 'final_interview',
    title: 'カルチャーフィットの最終確認',
    description: '最終面接。候補者の価値観と社風が合うかどうか、決定的な場面です。',
    choices: [
      {
        label: '自由な環境を強調',
        description: '裁量権と自律性をアピール',
        effects: {
          interestDelta: 10,
          revealAbility: 'creativity',
          message: '候補者は「自分で考えて動ける環境が理想」と共感。創造力も確認。',
        },
      },
      {
        label: '成長と挑戦を強調',
        description: '急成長企業ならではの機会をアピール',
        effects: {
          interestDelta: 8,
          revealAbility: 'growth',
          message: '候補者は「成長できそう」と前向き。成長ポテンシャルも見えた。',
        },
      },
      {
        label: '安定性と制度を強調',
        description: '福利厚生やワークライフバランスをアピール',
        effects: {
          interestDelta: 5,
          revealAbility: 'stamina',
          message: '候補者は安心感を得た。長期就労の意思が見えた。',
        },
      },
    ],
  },

  {
    id: 'fn_ceo_impression',
    stage: 'final_interview',
    title: 'CEO面接の印象',
    description: 'CEOとして最終面接に臨みます。あなたの立ち振る舞いが候補者の最終判断に直結します。',
    choices: [
      {
        label: 'ビジョナリーに未来を語る',
        description: '5年後の世界とそこでの自社の役割を熱く語る',
        effects: {
          interestDelta: 15,
          message: '候補者の目が輝いた。「こんなリーダーの下で働きたい」という表情。',
        },
      },
      {
        label: '候補者のキャリアに寄り添う',
        description: '「あなたのキャリアにとってベストな選択をしてほしい」と伝える',
        effects: {
          interestDelta: 12,
          companyReputationDelta: 2,
          message: '候補者は感動した様子。「人間として信頼できるCEO」という評価。',
        },
      },
      {
        label: '数字と実績で説得する',
        description: 'MRR成長率・資金調達状況・市場シェアを提示',
        effects: {
          interestDelta: 8,
          revealAbility: 'analytics',
          message: '候補者は「しっかりした経営」と安心感。分析派の候補者には効果的。',
        },
      },
    ],
  },

  {
    id: 'fn_trait_reveal',
    stage: 'final_interview',
    title: '候補者の本性が垣間見える瞬間',
    description: '長時間の面接の中で、候補者の隠れた一面が見えてきました。',
    triggerCondition: { hasSpecialTrait: true },
    choices: [
      {
        label: '深掘りして確認する',
        description: '気になる点を率直に聞く',
        effects: {
          interestDelta: 0,
          revealTrait: true,
          message: '候補者の特殊な特性が明らかになった。これが吉と出るか凶と出るか…',
        },
      },
      {
        label: '自然に流す',
        description: '気づかないふりをする',
        effects: {
          interestDelta: 5,
          message: '面接はスムーズに終了。ただし候補者の本質を見逃したかもしれない。',
        },
      },
    ],
  },

  {
    id: 'fn_team_presentation',
    stage: 'final_interview',
    title: '候補者からのプレゼン提案',
    description: '候補者が「入社後にやりたいことをまとめてきました」とプレゼンを始めました。',
    choices: [
      {
        label: '熱心に聞いてフィードバック',
        description: '建設的な議論で盛り上がる',
        effects: {
          interestDelta: 15,
          revealAbility: 'leadership',
          bonusRevealCount: 1,
          message: '候補者のリーダーシップと実行力が見えた。やる気も最高潮。',
        },
      },
      {
        label: '「良い提案ですが、まず現場を知ってから」と伝える',
        description: '現実的なアドバイスをする',
        effects: {
          interestDelta: 3,
          message: '候補者はやや残念そうだが「確かにその通りですね」と納得。',
        },
      },
    ],
  },

  {
    id: 'fn_last_doubt',
    stage: 'final_interview',
    title: '候補者の最後の迷い',
    description: '面接の最後に「実は一つだけ不安があって…」と候補者が切り出しました。',
    choices: [
      {
        label: '不安に正面から向き合う',
        description: '「何でも聞いてください」と受け止める',
        effects: {
          interestDelta: 12,
          revealAbility: 'stamina',
          message: '候補者の不安が解消された。「話を聞いてくれてありがとうございます」',
        },
      },
      {
        label: '他のメンバーの体験談を共有',
        description: '似たような不安を持って入社した人の話をする',
        effects: {
          interestDelta: 10,
          message: '候補者は「自分だけじゃないんですね」と安心。具体的なイメージが湧いた様子。',
        },
      },
      {
        label: '「入社してから一緒に解決しましょう」',
        description: '将来志向でポジティブに締める',
        effects: {
          interestDelta: 8,
          message: '候補者は「前向きな会社」と好印象。ただし不安は完全には消えていない。',
        },
      },
    ],
  },

  {
    id: 'fn_hidden_job_hint',
    stage: 'final_interview',
    title: '意外な適性の発見',
    description: '面接を通じて、この候補者は応募職種とは別の領域で大きな力を発揮しそうだと感じました。',
    choices: [
      {
        label: '別職種での活躍可能性を提案',
        description: '「実は○○のポジションの方が合うかもしれません」',
        effects: {
          interestDelta: 8,
          revealBestFit: true,
          message: '候補者は驚きつつも「実は自分もそう思っていて…」と告白。隠し適職が判明！',
        },
      },
      {
        label: '応募職種のまま進める',
        description: '本人の希望を尊重',
        effects: {
          interestDelta: 5,
          message: '候補者は希望通りのポジションで進行。満足している様子。',
        },
      },
    ],
  },

  {
    id: 'fn_deadline_pressure',
    stage: 'final_interview',
    title: '他社の最終面接が迫っている',
    description: '候補者から「実は来週、他社の最終面接がありまして…できれば今週中に結論を」と言われました。',
    choices: [
      {
        label: '即日でオファーを出す',
        description: '迅速な意思決定で囲い込む',
        effects: {
          interestDelta: 15,
          salaryExpectationDelta: 20,
          message: '候補者は「こんなに早く！」と感激。ただし急いだ分、条件交渉の余地が減った。',
        },
      },
      {
        label: '「いい判断をしてほしい」と伝える',
        description: '候補者の判断を尊重し、無理に引き留めない',
        effects: {
          interestDelta: 5,
          companyReputationDelta: 2,
          message: '候補者は「器の大きい会社」と評価。ただし他社に取られるリスクは残る。',
        },
      },
      {
        label: '条件を上乗せして急かす',
        description: '特別ボーナスを提示して即決を迫る',
        effects: {
          interestDelta: 10,
          salaryExpectationDelta: 50,
          message: '候補者は揺れている。「急かされている感じ」という懸念も。期待年収は上昇。',
        },
      },
    ],
  },

  {
    id: 'fn_s_rank_challenge',
    stage: 'final_interview',
    title: 'Sランク候補者の挑戦状',
    description: '超優秀な候補者から「御社に何ができるか、逆にプレゼンしてもらえますか？」と逆面接を仕掛けられました。',
    triggerCondition: { minRank: 'S' },
    choices: [
      {
        label: '堂々とプレゼンする',
        description: 'CEOとして会社の魅力を全力でアピール',
        effects: {
          interestDelta: 20,
          message: '候補者は「素晴らしい。この会社で働きたくなりました」と大きく前進。',
        },
      },
      {
        label: '「一緒に作る会社です」と伝える',
        description: '候補者を共同創業者のようなパートナーとして招く姿勢',
        effects: {
          interestDelta: 15,
          companyReputationDelta: 3,
          message: '候補者は感銘を受けた。「こういうCEOの下で働きたい」という反応。',
        },
      },
      {
        label: '正直に「まだ足りない部分がある」と認める',
        description: '等身大の姿を見せる',
        effects: {
          interestDelta: 10,
          message: '候補者は「正直で信頼できる」と評価。ただし不安材料にもなった。',
        },
      },
    ],
  },

  // ============================================================
  // オファー（offer）— 7種
  // ============================================================

  {
    id: 'of_salary_negotiation',
    stage: 'offer',
    title: '給与交渉の攻防',
    description: 'オファーを提示したところ、候補者が「もう少し上がりませんか…」と交渉を始めました。',
    choices: [
      {
        label: '年収を10%上乗せ',
        description: '候補者の希望に近づける',
        effects: {
          interestDelta: 12,
          salaryExpectationDelta: 30,
          message: '候補者は「ありがたいです」と前向き。ただしコストは増加。',
        },
      },
      {
        label: 'ストックオプションで補填提案',
        description: '年収は据え置きだがSOを追加',
        effects: {
          interestDelta: 8,
          message: '候補者は「将来性に賭けます」と前向き。SOの魅力が伝わった。',
        },
      },
      {
        label: '「これが最終提示です」と伝える',
        description: '予算の限界を正直に伝える',
        effects: {
          interestDelta: -5,
          message: '候補者は考え込んでいる。「他社と比較して検討します」',
        },
      },
    ],
  },

  {
    id: 'of_counter_from_current',
    stage: 'offer',
    title: '現職からのカウンターオファー',
    description: '候補者の現職から引き留めのカウンターオファーが出たようです。「現職から年収20%アップの提案が…」',
    choices: [
      {
        label: '条件を上回る提案をする',
        description: '現職のカウンターオファーを超える条件を提示',
        effects: {
          interestDelta: 10,
          salaryExpectationDelta: 60,
          message: '候補者は「こちらの方が魅力的」と傾いた。ただし高コスト。',
        },
      },
      {
        label: 'キャリアの成長性で勝負',
        description: '「年収だけでなく、3年後のキャリアを考えてほしい」',
        effects: {
          interestDelta: 8,
          message: '候補者は「確かにキャリアは大事…」と悩んでいる。五分五分の状況。',
        },
      },
      {
        label: '「最終判断はお任せします」と引く',
        description: '無理に引き留めない姿勢',
        effects: {
          interestDelta: -3,
          companyReputationDelta: 2,
          message: '候補者は「大人な対応」と評価。ただし離脱リスクは高まった。',
        },
      },
    ],
  },

  {
    id: 'of_start_date',
    stage: 'offer',
    title: '入社日の調整',
    description: '候補者が「できれば3ヶ月後からでないと…」と入社日を遅らせたいようです。',
    choices: [
      {
        label: '快く受け入れる',
        description: '「大丈夫です、お待ちしています」',
        effects: {
          interestDelta: 10,
          message: '候補者は安心した様子。「きちんと引き継ぎをして、万全の状態で入社します」',
        },
      },
      {
        label: '「できれば1ヶ月以内に」と交渉',
        description: '早期入社のメリットを説明',
        effects: {
          interestDelta: -5,
          message: '候補者はプレッシャーを感じている。「前職に迷惑をかけたくない…」',
        },
      },
    ],
  },

  {
    id: 'of_benefits_request',
    stage: 'offer',
    title: '福利厚生の追加リクエスト',
    description: '候補者が「リモートワークと学習支援制度は可能ですか？」と追加条件を求めています。',
    choices: [
      {
        label: '全て受け入れる',
        description: '要望通りの条件を追加',
        effects: {
          interestDelta: 15,
          message: '候補者は大満足。「ここまで対応してくれるとは」と感激。',
        },
      },
      {
        label: '一部のみ受け入れる',
        description: 'リモートワークは可、学習支援は要検討と回答',
        effects: {
          interestDelta: 5,
          message: '候補者は「まあ、リモートが使えるならいいか」と一定の満足。',
        },
      },
      {
        label: '制度として導入予定と伝える',
        description: '「今はないが、導入を検討中」と将来を示す',
        effects: {
          interestDelta: 0,
          message: '候補者は半信半疑。「本当に導入されるかな…」という表情。',
        },
      },
    ],
  },

  {
    id: 'of_family_concern',
    stage: 'offer',
    title: '家族の反対',
    description: '候補者が「実は家族がスタートアップへの転職に不安を感じていて…」と打ち明けました。',
    choices: [
      {
        label: '家族向けの会社説明会を提案',
        description: '会社の安定性と将来性を家族にも説明',
        effects: {
          interestDelta: 15,
          companyReputationDelta: 2,
          message: '候補者は「そこまでしてくれるんですか！」と感動。家族も納得した様子。',
        },
      },
      {
        label: '安定性を示す資料を提供',
        description: '財務状況や成長実績のデータを共有',
        effects: {
          interestDelta: 8,
          message: '候補者は資料を家族に見せた。「数字を見て少し安心したみたい」',
        },
      },
      {
        label: '「最終的にはご本人の判断」と伝える',
        description: '干渉しすぎないスタンス',
        effects: {
          interestDelta: -3,
          message: '候補者は「そうですよね…」と困った様子。家族の説得は自力で。',
        },
      },
    ],
  },

  {
    id: 'of_title_request',
    stage: 'offer',
    title: '役職名へのこだわり',
    description: '候補者が「タイトルをもう少し上位にしていただけませんか？」と要望しています。',
    choices: [
      {
        label: 'タイトルを上げる',
        description: '「シニア○○」や「リード○○」に変更',
        effects: {
          interestDelta: 10,
          message: '候補者は満足。「対外的にも説明しやすい」と喜んでいる。',
        },
      },
      {
        label: '成果次第で昇格を約束',
        description: '半年後のレビューで昇格を検討すると伝える',
        effects: {
          interestDelta: 5,
          message: '候補者は「まあ、成果を出せばいいですよね」と前向き。',
        },
      },
    ],
  },

  {
    id: 'of_final_push',
    stage: 'offer',
    title: '最後のひと押し',
    description: '候補者は悩んでいます。あと一押しで決まりそうですが…',
    choices: [
      {
        label: 'チームからの歓迎メッセージを送る',
        description: 'チームメンバーからの動画メッセージ',
        effects: {
          interestDelta: 15,
          message: '候補者は感動。「こんなに歓迎してくれるなら…」と心が決まった様子。',
        },
      },
      {
        label: 'サインオンボーナスを提示',
        description: '入社一時金で最後の後押し',
        effects: {
          interestDelta: 10,
          salaryExpectationDelta: 20,
          message: '候補者は「ありがたい。これで決めます」と前向きに。',
        },
      },
      {
        label: '時間を与える',
        description: '「急がなくていいですよ。じっくり考えてください」',
        effects: {
          interestDelta: 3,
          companyReputationDelta: 1,
          message: '候補者は感謝しつつも、まだ迷っている。良い会社だとは思っている。',
        },
      },
    ],
  },
];

/** ステージ別にイベントを取得 */
export function getEventsForStage(stage: string): InterviewEvent[] {
  return interviewEvents.filter(e => e.stage === stage);
}

/** 条件に合うイベントをフィルタリング */
export function filterEvents(
  events: InterviewEvent[],
  candidateRank: string,
  candidateJobType: string,
  interestLevel: number,
  hasSpecialTrait: boolean,
  isSpecialist: boolean,
): InterviewEvent[] {
  const rankOrder = ['D', 'C', 'B', 'A', 'S'];

  return events.filter(event => {
    const cond = event.triggerCondition;
    if (!cond) return true;

    if (cond.minRank) {
      const minIdx = rankOrder.indexOf(cond.minRank);
      const candIdx = rankOrder.indexOf(candidateRank);
      if (candIdx < minIdx) return false;
    }
    if (cond.maxRank) {
      const maxIdx = rankOrder.indexOf(cond.maxRank);
      const candIdx = rankOrder.indexOf(candidateRank);
      if (candIdx > maxIdx) return false;
    }
    if (cond.jobTypes && !cond.jobTypes.includes(candidateJobType as any)) return false;
    if (cond.minInterest !== undefined && interestLevel < cond.minInterest) return false;
    if (cond.maxInterest !== undefined && interestLevel > cond.maxInterest) return false;
    if (cond.hasSpecialTrait !== undefined && hasSpecialTrait !== cond.hasSpecialTrait) return false;
    if (cond.isSpecialist !== undefined && isSpecialist !== cond.isSpecialist) return false;

    return true;
  });
}
