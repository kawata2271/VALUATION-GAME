import React from 'react';

interface Props {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  warn?: boolean;
  delta?: number;
  deltaFmt?: string;
}

export const KPICard: React.FC<Props> = ({ label, value, sub, color = '#00c896', warn, delta, deltaFmt }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${warn ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 8,
    padding: '12px 16px',
    minWidth: 120,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
      <span style={{ fontSize: 11, color: '#888' }}>{label}</span>
      {delta !== undefined && delta !== 0 && (
        <span style={{
          fontSize: 10, fontFamily: 'monospace', fontWeight: 600,
          color: delta > 0 ? '#00c896' : '#ef4444',
          animation: 'fadeIn 0.3s ease',
        }}>
          {delta > 0 ? '+' : ''}{deltaFmt || delta.toFixed(0)}
        </span>
      )}
    </div>
    <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace' }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>{sub}</div>}
  </div>
);
