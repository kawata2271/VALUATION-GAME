import React from 'react';
import { useGameStore } from '../hooks/useGame';

export const FundingPanel: React.FC = () => {
  const state = useGameStore(s => s.state)!;
  const getOptions = useGameStore(s => s.getAvailableFundingOptions);
  const raiseFunding = useGameStore(s => s.raiseFunding);

  const options = getOptions();

  return (
    <div>
      {/* Cap Table */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, color: '#ec4899', margin: '0 0 10px' }}>キャップテーブル</h4>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 100, height: 100, position: 'relative' }}>
            <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle cx="18" cy="18" r="16" fill="none" stroke="#ec4899"
                strokeWidth="3" strokeDasharray={`${state.founderEquity} ${100 - state.founderEquity}`} />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#ec4899',
            }}>
              {state.founderEquity.toFixed(0)}%
            </div>
          </div>
          <div style={{ fontSize: 12 }}>
            <div style={{ color: '#ec4899', marginBottom: 4 }}>創業者持分: {state.founderEquity.toFixed(1)}%</div>
            <div style={{ color: '#888', marginBottom: 4 }}>オプションプール: {state.optionPool.toFixed(1)}%</div>
            <div style={{ color: '#666' }}>投資家: {(100 - state.founderEquity - state.optionPool).toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Funding History */}
      {state.fundingRounds.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 13, color: '#ffd700', margin: '0 0 10px' }}>調達履歴</h4>
          {state.fundingRounds.map((r, i) => (
            <div key={i} style={{
              background: 'rgba(255,215,0,0.03)', borderRadius: 6, padding: '8px 12px',
              marginBottom: 6, border: '1px solid rgba(255,215,0,0.1)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{r.type.toUpperCase()}</span>
                <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>Month {r.month}</span>
              </div>
              <div style={{ fontSize: 12, color: '#ffd700' }}>
                ¥{(r.amount / 1e6).toFixed(1)}M @ ¥{(r.valuation / 1e6).toFixed(0)}M
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Available Rounds */}
      <div>
        <h4 style={{ fontSize: 13, color: '#888', margin: '0 0 10px' }}>調達オプション</h4>
        {options.length === 0 ? (
          <div style={{ color: '#555', fontSize: 12, padding: 12, textAlign: 'center' }}>
            現在利用可能な調達オプションはありません。<br />
            トラクションを伸ばしましょう。
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {options.map(opt => (
              <div key={opt.type} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 14,
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{opt.nameJa}</span>
                  <span style={{ fontSize: 12, color: '#f59e0b' }}>成功率: {(opt.successRate * 100).toFixed(0)}%</span>
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#888', marginBottom: 10 }}>
                  <span>¥{(opt.minAmount / 1e6).toFixed(1)}M - ¥{(opt.maxAmount / 1e6).toFixed(0)}M</span>
                  <span>希薄化: ~{opt.dilution}%</span>
                </div>
                <button
                  onClick={() => raiseFunding(opt.type)}
                  style={{
                    background: 'linear-gradient(135deg, #ffd700, #f59e0b)',
                    border: 'none', borderRadius: 6, padding: '8px 20px',
                    fontSize: 12, fontWeight: 700, color: '#000', cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  調達を試みる
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Valuation */}
      <div style={{
        marginTop: 24, background: 'rgba(255,215,0,0.05)',
        borderRadius: 8, padding: 14, border: '1px solid rgba(255,215,0,0.15)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>現在の評価額</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#ffd700', fontFamily: 'monospace' }}>
          ¥{(state.valuation / 1e6).toFixed(1)}M
        </div>
      </div>
    </div>
  );
};
