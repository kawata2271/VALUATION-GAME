import React from 'react';
import { useGameStore } from '../hooks/useGame';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const AnalyticsPanel: React.FC = () => {
  const state = useGameStore(s => s.state)!;

  const data = state.history.map(h => ({
    ...h,
    mrrK: Math.round(h.mrr / 1000),
    cashK: Math.round(h.cash / 1000),
    burnK: Math.round(h.burn / 1000),
  }));

  const chartStyle = {
    background: '#1a1a2e',
    border: '1px solid #333',
    borderRadius: 6,
    fontSize: 11,
  };

  return (
    <div>
      <h4 style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>分析</h4>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: '#00c896', marginBottom: 8 }}>MRR推移 (¥K)</div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 10 }} />
            <YAxis stroke="#555" tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={chartStyle} />
            <Line type="monotone" dataKey="mrrK" stroke="#00c896" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: '#6366f1', marginBottom: 8 }}>顧客数推移</div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 10 }} />
            <YAxis stroke="#555" tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={chartStyle} />
            <Line type="monotone" dataKey="customers" stroke="#6366f1" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, color: '#f59e0b', marginBottom: 8 }}>キャッシュ / バーン (¥K)</div>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 10 }} />
            <YAxis stroke="#555" tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={chartStyle} />
            <Line type="monotone" dataKey="cashK" stroke="#00c896" strokeWidth={2} dot={false} name="キャッシュ" />
            <Line type="monotone" dataKey="burnK" stroke="#ef4444" strokeWidth={2} dot={false} name="バーン" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Metrics Table */}
      {state.history.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>主要指標</div>
          <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
            <tbody>
              <MetricRow label="LTV/CAC" value={state.cac > 0 ? ((state.arpu / (state.churnRate / 100)) / state.cac).toFixed(1) : '-'} target="> 3.0" />
              <MetricRow label="NDR" value={`${state.ndr.toFixed(0)}%`} target="> 120%" />
              <MetricRow label="CAC回収" value={state.arpu > 0 ? `${(state.cac / state.arpu).toFixed(0)}ヶ月` : '-'} target="< 12ヶ月" />
              <MetricRow label="Rule of 40" value="計算中" target="> 40%" />
              <MetricRow label="バーンマルチプル" value={state.mrr > 0 ? (state.burn / state.mrr).toFixed(1) : '-'} target="< 2.0" />
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const MetricRow: React.FC<{ label: string; value: string; target: string }> = ({ label, value, target }) => (
  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
    <td style={{ padding: '5px 0', color: '#888' }}>{label}</td>
    <td style={{ padding: '5px 0', color: '#fff', fontFamily: 'monospace', textAlign: 'right' }}>{value}</td>
    <td style={{ padding: '5px 0', color: '#555', textAlign: 'right' }}>{target}</td>
  </tr>
);
