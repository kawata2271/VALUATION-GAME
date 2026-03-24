import React from 'react';
import { useGameStore } from '../hooks/useGame';

export const LogPanel: React.FC = () => {
  const state = useGameStore(s => s.state)!;

  const reversed = [...state.eventLog].reverse();

  return (
    <div>
      <h4 style={{ fontSize: 13, color: '#888', margin: '0 0 12px' }}>イベントログ</h4>
      {reversed.length === 0 ? (
        <div style={{ color: '#555', fontSize: 12, textAlign: 'center', padding: 20 }}>
          まだイベントはありません
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {reversed.map((log, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, padding: '6px 8px',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
              fontSize: 12,
            }}>
              <span style={{ color: '#555', fontFamily: 'monospace', minWidth: 36 }}>M{log.month}</span>
              <span style={{ color: '#bbb', fontWeight: 600, minWidth: 100 }}>{log.title}</span>
              <span style={{ color: '#777' }}>{log.effect}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
