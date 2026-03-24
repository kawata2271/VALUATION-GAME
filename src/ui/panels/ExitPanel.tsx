import React from 'react';
import { useGameStore } from '../hooks/useGame';

export const ExitPanel: React.FC = () => {
  const state = useGameStore(s => s.state)!;
  const doIPO = useGameStore(s => s.doIPO);
  const doMnA = useGameStore(s => s.doMnA);
  const doContinue = useGameStore(s => s.doContinue);

  const arr = state.mrr * 12;
  const hasCFO = state.employees.some(e => e.role === 'cfo');

  return (
    <div>
      <h4 style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>EXIT戦略</h4>

      {/* IPO */}
      <ExitOption
        title="IPO（新規株式公開）"
        description="株式市場に上場し、最大のバリュエーションを目指す。"
        conditions={[
          { label: 'ARR $10M以上', met: arr >= 10_000_000 },
          { label: 'CFO在籍', met: hasCFO },
        ]}
        buttonLabel="IPOを実行"
        color="#ffd700"
        onClick={doIPO}
        enabled={arr >= 10_000_000 && hasCFO}
      />

      {/* M&A */}
      <ExitOption
        title="M&A（企業売却）"
        description="戦略的買い手に会社を売却する。IPOより低い倍率だが確実性が高い。"
        conditions={[
          { label: 'ARR $1M以上', met: arr >= 1_000_000 },
        ]}
        buttonLabel="M&Aを実行"
        color="#6366f1"
        onClick={doMnA}
        enabled={arr >= 1_000_000}
      />

      {/* Continue */}
      <ExitOption
        title="継続経営（プライベート維持）"
        description="上場せず、自律的な経営を続ける。いつでも選択可能。"
        conditions={[]}
        buttonLabel="ゲームを終了（現在のスコアで評価）"
        color="#00c896"
        onClick={doContinue}
        enabled={true}
      />

      <div style={{ marginTop: 20, padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 6, fontSize: 11, color: '#666', lineHeight: 1.6 }}>
        <strong>スコア倍率:</strong><br />
        IPO: x1.0 / M&A: x0.8 / 継続: x0.6<br />
        ブートストラップIPO（外部資金なし）: +200%ボーナス
      </div>
    </div>
  );
};

interface ExitOptionProps {
  title: string;
  description: string;
  conditions: { label: string; met: boolean }[];
  buttonLabel: string;
  color: string;
  onClick: () => void;
  enabled: boolean;
}

const ExitOption: React.FC<ExitOptionProps> = ({ title, description, conditions, buttonLabel, color, onClick, enabled }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 16,
    border: `1px solid ${enabled ? `${color}33` : 'rgba(255,255,255,0.06)'}`,
    marginBottom: 12, opacity: enabled ? 1 : 0.6,
  }}>
    <h5 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 6px', color }}>{title}</h5>
    <p style={{ fontSize: 12, color: '#888', margin: '0 0 10px' }}>{description}</p>
    {conditions.length > 0 && (
      <div style={{ marginBottom: 10 }}>
        {conditions.map((c, i) => (
          <div key={i} style={{ fontSize: 11, color: c.met ? '#00c896' : '#ef4444', marginBottom: 2 }}>
            {c.met ? '✓' : '✗'} {c.label}
          </div>
        ))}
      </div>
    )}
    <button
      onClick={onClick}
      disabled={!enabled}
      style={{
        background: enabled ? color : '#333',
        border: 'none', borderRadius: 6, padding: '8px 20px',
        fontSize: 12, fontWeight: 600, color: enabled ? '#000' : '#666',
        cursor: enabled ? 'pointer' : 'not-allowed', width: '100%',
      }}
    >
      {buttonLabel}
    </button>
  </div>
);
