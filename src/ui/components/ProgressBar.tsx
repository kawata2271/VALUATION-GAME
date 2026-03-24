import React from 'react';

interface Props {
  label: string;
  value: number;
  max?: number;
  color?: string;
  showValue?: boolean;
}

export const ProgressBar: React.FC<Props> = ({ label, value, max = 100, color = '#00c896', showValue = true }) => {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 3 }}>
        <span style={{ color: '#aaa' }}>{label}</span>
        {showValue && <span style={{ color, fontFamily: 'monospace' }}>{Math.round(value)}</span>}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 4,
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
};
