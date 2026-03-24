import React from 'react';
import { motion } from 'framer-motion';
import { GameState, MonthlySnapshot } from '../../engine/types';

interface Props {
  state: GameState;
  onClose: () => void;
}

const fmt = (n: number): string => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

const pctChange = (curr: number, prev: number): string => {
  if (prev === 0) return curr > 0 ? '+∞' : '±0';
  const pct = ((curr - prev) / prev) * 100;
  return `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`;
};

export const QuarterlySummary: React.FC<Props> = ({ state, onClose }) => {
  const quarter = Math.ceil(state.month / 3);
  const quarterStart = (quarter - 1) * 3;

  // Get snapshots for this quarter
  const thisQ = state.history.filter(h => h.month > quarterStart && h.month <= quarter * 3);
  const prevQ = state.history.filter(h => h.month > quarterStart - 3 && h.month <= quarterStart);

  const latest = thisQ[thisQ.length - 1] || state.history[state.history.length - 1];
  const prevEnd = prevQ[prevQ.length - 1];

  // Events this quarter
  const quarterEvents = state.eventLog.filter(e => e.month > quarterStart && e.month <= quarter * 3);

  // Key metrics
  const mrrChange = prevEnd ? pctChange(latest.mrr, prevEnd.mrr) : '-';
  const custChange = prevEnd ? (latest.customers - prevEnd.customers) : latest.customers;
  const cashChange = prevEnd ? latest.cash - prevEnd.cash : latest.cash;

  // Highlights
  const highlights: string[] = [];
  if (!prevEnd || latest.mrr > prevEnd.mrr * 1.2) highlights.push('MRRが力強く成長');
  if (latest.nps >= 70) highlights.push('NPSが高水準を維持');
  if (latest.techDebt > 60) highlights.push('⚠ 技術負債が高水準');
  if (latest.morale < 50) highlights.push('⚠ チーム士気が低下中');
  if (state.pmfAchieved && (!prevEnd || !state.history.slice(0, -3).some(() => state.pmfAchieved)))
    highlights.push('PMFを達成！');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 140,
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        style={{
          background: '#12121f', borderRadius: 12, padding: 24,
          maxWidth: 480, width: '90%',
          border: '1px solid rgba(99,102,241,0.2)',
          boxShadow: '0 0 40px rgba(99,102,241,0.1)',
        }}
      >
        <div style={{ fontSize: 11, color: '#6366f1', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
          Quarterly Report
        </div>
        <h3 style={{ margin: '0 0 16px', fontSize: 20, color: '#fff' }}>
          Q{quarter} サマリー
        </h3>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          <MetricBox label="MRR" value={fmt(latest.mrr)} change={mrrChange} />
          <MetricBox label="顧客" value={`${latest.customers}社`} change={`${custChange >= 0 ? '+' : ''}${custChange}`} />
          <MetricBox label="キャッシュ" value={fmt(latest.cash)} change={fmt(cashChange)} positive={cashChange >= 0} />
          <MetricBox label="NPS" value={`${latest.nps.toFixed(0)}`} />
          <MetricBox label="チーム" value={`${latest.teamSize}人`} />
          <MetricBox label="技術負債" value={`${latest.techDebt.toFixed(0)}`} positive={latest.techDebt < 40} />
        </div>

        {/* Highlights */}
        {highlights.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            {highlights.map((h, i) => (
              <div key={i} style={{
                fontSize: 12, padding: '4px 0', color: h.startsWith('⚠') ? '#f59e0b' : '#00c896',
              }}>
                {h.startsWith('⚠') ? '' : '✓ '}{h}
              </div>
            ))}
          </div>
        )}

        {/* Key Events */}
        {quarterEvents.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>主なイベント</div>
            <div style={{ maxHeight: 100, overflow: 'auto' }}>
              {quarterEvents.slice(-5).map((e, i) => (
                <div key={i} style={{
                  fontSize: 11, color: '#777', padding: '2px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                }}>
                  <span style={{ color: '#555', fontFamily: 'monospace' }}>M{e.month}</span>{' '}
                  <span style={{ color: '#aaa' }}>{e.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          style={{
            width: '100%', padding: '10px 0',
            background: '#6366f1', border: 'none', borderRadius: 6,
            fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer',
          }}
        >
          続ける
        </button>
      </motion.div>
    </motion.div>
  );
};

const MetricBox: React.FC<{ label: string; value: string; change?: string; positive?: boolean }> = ({
  label, value, change, positive,
}) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 10px',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: 9, color: '#666', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{value}</div>
    {change && (
      <div style={{
        fontSize: 10, fontFamily: 'monospace', marginTop: 2,
        color: positive === false ? '#ef4444' : positive === true || change.startsWith('+') ? '#00c896' : change.startsWith('-') ? '#ef4444' : '#888',
      }}>
        {change}
      </div>
    )}
  </div>
);
