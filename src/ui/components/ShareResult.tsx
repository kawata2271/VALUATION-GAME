import React, { useState } from 'react';
import { GameState } from '../../engine/types';
import { getGrade } from '../../engine/GameEngine';

interface Props {
  state: GameState;
}

const fmt = (n: number): string => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

const exitLabels: Record<string, string> = {
  ipo: 'IPO', mna: 'M&A', continue: '継続経営', bankrupt: '倒産',
};

function generateShareText(state: GameState): string {
  const { grade, title } = getGrade(state.finalScore);
  const exit = exitLabels[state.exitType || 'bankrupt'];
  const arr = state.mrr * 12;
  const bars = '█'.repeat(Math.min(10, Math.floor(state.finalScore / 50000)));
  const empty = '░'.repeat(10 - bars.length);

  return `VALUATION GAME 🎮

${state.companyName} | ${exit}
Grade: ${grade} 「${title}」
Score: ${state.finalScore.toLocaleString()} pts
${bars}${empty}

📊 ARR ${fmt(arr)} | 👥 ${state.customers}社
💰 評価額 ${fmt(state.valuation)}
📅 ${state.month}ヶ月経営
🏢 チーム${state.employees.length}人

#VALUATION_GAME`;
}

export const ShareResult: React.FC<Props> = ({ state }) => {
  const [copied, setCopied] = useState(false);
  const text = generateShareText(state);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'VALUATION GAME', text });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={handleShare}
        style={{
          background: 'rgba(0,200,150,0.15)',
          border: '1px solid rgba(0,200,150,0.3)', borderRadius: 8,
          padding: '10px 20px', fontSize: 13, fontWeight: 600,
          color: '#00c896', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        {copied ? '✓ コピー済み' : '📋 結果を共有'}
      </button>
    </div>
  );
};
