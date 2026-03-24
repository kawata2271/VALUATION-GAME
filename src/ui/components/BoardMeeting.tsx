import React, { useState } from 'react';
import { GameState } from '../../engine/types';

interface Props {
  state: GameState;
  onComplete: (moraleDelta: number, brandDelta: number, message: string) => void;
}

interface BoardQuestion {
  question: string;
  choices: { label: string; morale: number; brand: number; message: string }[];
}

function generateQuestions(state: GameState): BoardQuestion[] {
  const questions: BoardQuestion[] = [];
  const arr = state.mrr * 12;
  const prevArr = state.history.length >= 4 ? state.history[state.history.length - 4].mrr * 12 : 0;
  const growthRate = prevArr > 0 ? ((arr - prevArr) / prevArr) * 100 : 100;

  // Growth question
  if (growthRate < 30) {
    questions.push({
      question: `成長率が${growthRate.toFixed(0)}%に鈍化しています。どう対処しますか？`,
      choices: [
        { label: '新市場への展開を計画', morale: 3, brand: 5, message: '新市場展開の計画を発表。投資家の期待が高まった' },
        { label: '既存顧客の深堀りに集中', morale: 5, brand: 0, message: '既存顧客重視の方針に投資家は慎重な反応' },
        { label: 'マーケティング予算を倍増', morale: -3, brand: 8, message: '攻めの投資を約束。プレッシャーが増した' },
      ],
    });
  } else {
    questions.push({
      question: `成長率${growthRate.toFixed(0)}%、好調ですね。次の一手は？`,
      choices: [
        { label: 'この勢いで上場準備を', morale: 5, brand: 10, message: 'IPOの話題に投資家が湧いた' },
        { label: '利益率の改善を優先', morale: 3, brand: 3, message: '堅実な方針に一定の理解' },
        { label: '新プロダクトラインを発表', morale: 0, brand: 8, message: 'マルチプロダクト戦略に投資家は興味津々' },
      ],
    });
  }

  // Burn rate question
  if (state.burn > state.mrr * 2) {
    questions.push({
      question: 'バーンレートが売上の2倍以上です。持続可能ですか？',
      choices: [
        { label: '成長のための投資', morale: 0, brand: -3, message: '投資家は不満そうだが、成長期として許容' },
        { label: 'コスト削減計画を提示', morale: -5, brand: 3, message: '削減計画に投資家は安心したが、チームに不安' },
        { label: '次のラウンドで手当て', morale: 3, brand: 0, message: '調達で乗り切る計画を提示' },
      ],
    });
  }

  // Team question
  if (state.employees.length > 20) {
    questions.push({
      question: 'チームが拡大していますが、組織の生産性は維持できていますか？',
      choices: [
        { label: 'OKR導入で整備中', morale: 5, brand: 3, message: '組織化の取り組みを評価された' },
        { label: 'まだカオスだが成長を優先', morale: -3, brand: -3, message: '投資家は組織力に懸念を示した' },
        { label: 'VP採用で強化する', morale: 3, brand: 5, message: '経営チーム強化の計画に好感触' },
      ],
    });
  }

  // Churn question
  if (state.churnRate > 4) {
    questions.push({
      question: `チャーン率${state.churnRate.toFixed(1)}%は高いですね。プロダクトに問題がありますか？`,
      choices: [
        { label: 'CS強化で対応中', morale: 3, brand: 0, message: 'カスタマーサクセス施策に一定の理解' },
        { label: 'プロダクト改善にフォーカス', morale: 5, brand: 3, message: 'プロダクト品質への投資を評価' },
        { label: '顧客セグメントの見直し', morale: 0, brand: 5, message: 'ターゲット再設定の計画を提示' },
      ],
    });
  }

  // Pick 2-3 questions
  return questions.slice(0, 3);
}

export const BoardMeeting: React.FC<Props> = ({ state, onComplete }) => {
  const questions = React.useMemo(() => generateQuestions(state), [state]);
  const [currentQ, setCurrentQ] = useState(0);
  const [totalMorale, setTotalMorale] = useState(0);
  const [totalBrand, setTotalBrand] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const arr = state.mrr * 12;

  const handleChoice = (choice: { morale: number; brand: number; message: string }) => {
    const newMorale = totalMorale + choice.morale;
    const newBrand = totalBrand + choice.brand;
    const newMessages = [...messages, choice.message];
    setTotalMorale(newMorale);
    setTotalBrand(newBrand);
    setMessages(newMessages);

    if (currentQ + 1 >= questions.length) {
      setShowResults(true);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  if (showResults) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <h3 style={{ margin: '0 0 16px', fontSize: 18, color: '#ffd700' }}>ボードミーティング完了</h3>
          <div style={{ marginBottom: 16 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ fontSize: 12, color: '#bbb', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                {m}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 14 }}>
            <span style={{ color: totalMorale >= 0 ? '#00c896' : '#ef4444' }}>
              士気 {totalMorale >= 0 ? '+' : ''}{totalMorale}
            </span>
            <span style={{ color: totalBrand >= 0 ? '#00c896' : '#ef4444' }}>
              ブランド {totalBrand >= 0 ? '+' : ''}{totalBrand}
            </span>
          </div>
          <button
            onClick={() => onComplete(totalMorale, totalBrand, messages.join(' / '))}
            style={{
              background: '#ffd700', border: 'none', borderRadius: 6,
              padding: '10px 24px', fontSize: 13, fontWeight: 600,
              color: '#000', cursor: 'pointer', width: '100%',
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ fontSize: 11, color: '#ffd700', letterSpacing: 2, marginBottom: 4, textTransform: 'uppercase' }}>
          Board Meeting
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 18, color: '#fff' }}>
          Q{Math.ceil(state.month / 3)} ボードミーティング
        </h3>

        {/* KPI Summary */}
        <div style={{
          display: 'flex', gap: 12, marginBottom: 16, padding: '8px 12px',
          background: 'rgba(255,215,0,0.05)', borderRadius: 6,
          fontSize: 11, color: '#888',
        }}>
          <span>ARR: <strong style={{ color: '#fff' }}>${(arr / 1e6).toFixed(1)}M</strong></span>
          <span>顧客: <strong style={{ color: '#fff' }}>{state.customers}</strong></span>
          <span>チーム: <strong style={{ color: '#fff' }}>{state.employees.length}人</strong></span>
          <span>NPS: <strong style={{ color: '#fff' }}>{state.nps.toFixed(0)}</strong></span>
        </div>

        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>
          質問 {currentQ + 1}/{questions.length}
        </div>
        <p style={{ color: '#ddd', fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' }}>
          {q.question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {q.choices.map((c, i) => (
            <button
              key={i}
              onClick={() => handleChoice(c)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8, padding: '10px 14px',
                color: '#e0e0e0', cursor: 'pointer', textAlign: 'left',
                fontSize: 13, transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#ffd700';
                e.currentTarget.style.background = 'rgba(255,215,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 150,
};

const modalStyle: React.CSSProperties = {
  background: '#12121f', borderRadius: 12, padding: 24,
  maxWidth: 500, width: '90%',
  border: '1px solid rgba(255,215,0,0.2)',
  boxShadow: '0 0 30px rgba(255,215,0,0.1)',
};
