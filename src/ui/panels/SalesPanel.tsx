import React from 'react';
import { useGameStore } from '../hooks/useGame';
import { formatCurrency } from '../../utils/currency';

export const SalesPanel: React.FC = () => {
  const state = useGameStore(s => s.state)!;
  const adjustPrice = useGameStore(s => s.adjustPrice);
  const addTier = useGameStore(s => s.addTier);

  const effectiveChurn = state.churnRate / 100;
  const ltv = effectiveChurn > 0 ? state.arpu / effectiveChurn : 0;
  const ltvCac = state.cac > 0 ? ltv / state.cac : 0;
  const cacPayback = state.arpu > 0 ? state.cac / state.arpu : 0;

  return (
    <div>
      {/* Customer Segments */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 13, color: '#6366f1', margin: '0 0 10px' }}>顧客セグメント</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <SegmentRow label="SMB (中小)" count={state.customersSmb} color="#00c896" />
          <SegmentRow label="Mid-Market (中堅)" count={state.customersMidmarket} color="#6366f1" />
          <SegmentRow label="Enterprise (大企業)" count={state.customersEnterprise} color="#f59e0b" />
          <SegmentRow label="Strategic (超大企業)" count={state.customersStrategic} color="#ec4899" />
        </div>
      </div>

      {/* Unit Economics */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 13, color: '#00c896', margin: '0 0 10px' }}>ユニットエコノミクス</h4>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '5px 0', color: '#888' }}>ARPU</td>
              <td style={{ textAlign: 'right', color: '#fff', fontFamily: 'monospace' }}>{formatCurrency(state.arpu)}/月</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '5px 0', color: '#888' }}>CAC</td>
              <td style={{ textAlign: 'right', color: '#fff', fontFamily: 'monospace' }}>{formatCurrency(state.cac)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '5px 0', color: '#888' }}>LTV</td>
              <td style={{ textAlign: 'right', color: '#fff', fontFamily: 'monospace' }}>{formatCurrency(ltv)}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '5px 0', color: '#888' }}>LTV/CAC</td>
              <td style={{
                textAlign: 'right', fontFamily: 'monospace',
                color: ltvCac >= 3 ? '#00c896' : ltvCac >= 1 ? '#f59e0b' : '#ef4444',
              }}>
                {ltvCac.toFixed(1)}x {ltvCac >= 3 ? '(健全)' : ltvCac >= 1 ? '(改善必要)' : '(危険)'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '5px 0', color: '#888' }}>CAC回収期間</td>
              <td style={{ textAlign: 'right', color: '#fff', fontFamily: 'monospace' }}>
                {cacPayback.toFixed(0)}ヶ月
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '5px 0', color: '#888' }}>NDR</td>
              <td style={{
                textAlign: 'right', fontFamily: 'monospace',
                color: state.ndr >= 120 ? '#00c896' : state.ndr >= 100 ? '#f59e0b' : '#ef4444',
              }}>
                {state.ndr.toFixed(0)}%
              </td>
            </tr>
            <tr>
              <td style={{ padding: '5px 0', color: '#888' }}>チャーン率</td>
              <td style={{
                textAlign: 'right', fontFamily: 'monospace',
                color: state.churnRate < 3 ? '#00c896' : state.churnRate < 5 ? '#f59e0b' : '#ef4444',
              }}>
                {state.churnRate.toFixed(1)}%/月
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pricing Controls */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 13, color: '#f59e0b', margin: '0 0 10px' }}>プライシング調整</h4>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
          現在のARPU: <strong style={{ color: '#fff' }}>¥{state.arpu.toFixed(0)}/月</strong>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <PriceBtn label="値上げ +10%" color="#00c896" onClick={() => adjustPrice('up', 10)} />
          <PriceBtn label="値上げ +20%" color="#00c896" onClick={() => adjustPrice('up', 20)} />
          <PriceBtn label="値下げ -10%" color="#ef4444" onClick={() => adjustPrice('down', 10)} />
          <PriceBtn label="値下げ -20%" color="#ef4444" onClick={() => adjustPrice('down', 20)} />
        </div>
        <div style={{ fontSize: 10, color: '#555', marginTop: 6 }}>
          値上げ: ARPU上昇 + チャーンリスク | 値下げ: ARPU低下 + CAC改善
        </div>
      </div>

      {/* Pricing Tiers */}
      <div>
        <h4 style={{ fontSize: 13, color: '#ec4899', margin: '0 0 10px' }}>料金プラン</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {state.pricingTiers.map((tier, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 12px',
              border: `1px solid ${tier.enabled ? 'rgba(0,200,150,0.2)' : 'rgba(255,255,255,0.06)'}`,
            }}>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: tier.enabled ? '#fff' : '#666' }}>
                  {tier.name}
                </span>
                {tier.enabled && <span style={{ fontSize: 10, color: '#00c896', marginLeft: 8 }}>有効</span>}
              </div>
              {!tier.enabled && i > 0 && (
                <button
                  onClick={() => addTier(i)}
                  style={{
                    background: '#6366f1', border: 'none', borderRadius: 4,
                    padding: '4px 12px', fontSize: 11, color: '#fff', cursor: 'pointer',
                  }}
                >
                  追加
                </button>
              )}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: '#555', marginTop: 6 }}>
          プランを追加するとアップセル機会が増加し、NDRが向上します
        </div>
      </div>
    </div>
  );
};

const SegmentRow: React.FC<{ label: string; count: number; color: string }> = ({ label, count, color }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', padding: '4px 8px',
    background: 'rgba(255,255,255,0.02)', borderRadius: 4,
    borderLeft: `3px solid ${color}`,
  }}>
    <span style={{ fontSize: 12, color: '#aaa' }}>{label}</span>
    <span style={{ fontSize: 12, color, fontFamily: 'monospace', fontWeight: 600 }}>{count}社</span>
  </div>
);

const PriceBtn: React.FC<{ label: string; color: string; onClick: () => void }> = ({ label, color, onClick }) => (
  <button onClick={onClick} style={{
    background: `${color}15`, border: `1px solid ${color}33`, borderRadius: 4,
    padding: '5px 10px', fontSize: 11, color, cursor: 'pointer',
  }}>
    {label}
  </button>
);
