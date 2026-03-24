import React from 'react';

interface Props {
  items: string[];
}

export const NewsTicker: React.FC<Props> = ({ items }) => {
  if (items.length === 0) return null;

  const text = items.join('　｜　');

  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(0,0,0,0.3)',
      overflow: 'hidden',
      height: 24,
      display: 'flex',
      alignItems: 'center',
      flexShrink: 0,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        whiteSpace: 'nowrap',
        animation: `ticker ${Math.max(15, text.length * 0.15)}s linear infinite`,
        fontSize: 11, color: '#555',
      }}>
        <span style={{ color: '#6366f1', fontSize: 10, fontWeight: 600, marginRight: 4 }}>NEWS</span>
        <span>{text}</span>
        <span style={{ marginLeft: 60 }}>{text}</span>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};
