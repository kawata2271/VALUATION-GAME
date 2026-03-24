import React from 'react';
import { getUnlocks, unlockConditions } from '../../engine/data/unlocks';
import { getLeaderboard, LeaderboardEntry } from '../../engine/data/leaderboard';
import { achievements as achievementDefs } from '../../engine/data/achievements';

const fmt = (n: number): string => {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

const gradeColors: Record<string, string> = {
  SSS: '#ffd700', SS: '#ff9500', S: '#ec4899', A: '#6366f1',
  B: '#00c896', C: '#f59e0b', D: '#888', F: '#ef4444',
};

interface Props {
  onBack: () => void;
}

export const StatsScreen: React.FC<Props> = ({ onBack }) => {
  const unlocks = getUnlocks();
  const leaderboard = getLeaderboard();

  const totalUnlockable = unlockConditions.length;
  const totalUnlocked = unlockConditions.filter(c => {
    if (c.type === 'vertical') return unlocks.verticals.includes(c.id);
    if (c.type === 'founder') return unlocks.founders.includes(c.id);
    if (c.type === 'scenario') return unlocks.scenarios.includes(c.id);
    return false;
  }).length;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: 24,
      background: 'radial-gradient(ellipse at center, #0f0f2e 0%, #0a0a0f 70%)',
    }}>
      <div style={{ maxWidth: 700, width: '100%' }}>
        <button onClick={onBack} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6, padding: '6px 16px', color: '#888',
          cursor: 'pointer', fontSize: 12, marginBottom: 24,
        }}>
          ← 戻る
        </button>

        <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 24px', color: '#fff' }}>
          プレイ統計
        </h2>

        {/* Overview */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120, 1fr))',
          gap: 10, marginBottom: 24,
        }}>
          <StatBox label="プレイ回数" value={`${unlocks.totalPlaythroughs}`} />
          <StatBox label="最高スコア" value={unlocks.bestScore.toLocaleString()} color="#ffd700" />
          <StatBox label="最高グレード" value={unlocks.bestGrade} color={gradeColors[unlocks.bestGrade] || '#888'} />
          <StatBox label="EXIT種類" value={`${unlocks.exitTypes.length}/4`} />
          <StatBox label="アンロック" value={`${totalUnlocked + 6 + 4 + 2}/${totalUnlockable + 6 + 4 + 2}`} />
        </div>

        {/* Unlock Progress */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 20,
          border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24,
        }}>
          <h3 style={{ fontSize: 15, color: '#ffd700', margin: '0 0 16px' }}>アンロック進捗</h3>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, marginBottom: 8 }}>追加領域</div>
            {unlockConditions.filter(c => c.type === 'vertical').map(c => (
              <UnlockRow key={c.id} name={c.nameJa} condition={c.condition}
                unlocked={unlocks.verticals.includes(c.id)} />
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: '#ec4899', fontWeight: 600, marginBottom: 8 }}>追加創業者</div>
            {unlockConditions.filter(c => c.type === 'founder').map(c => (
              <UnlockRow key={c.id} name={c.nameJa} condition={c.condition}
                unlocked={unlocks.founders.includes(c.id)} />
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, color: '#f59e0b', fontWeight: 600, marginBottom: 8 }}>追加シナリオ</div>
            {unlockConditions.filter(c => c.type === 'scenario').map(c => (
              <UnlockRow key={c.id} name={c.nameJa} condition={c.condition}
                unlocked={unlocks.scenarios.includes(c.id)} />
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 20,
            border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24,
          }}>
            <h3 style={{ fontSize: 15, color: '#ffd700', margin: '0 0 16px' }}>ランキング Top 20</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, minWidth: 500 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={thStyle}>#</th>
                    <th style={{ ...thStyle, textAlign: 'left' }}>会社名</th>
                    <th style={{ ...thStyle, textAlign: 'left' }}>領域</th>
                    <th style={{ ...thStyle, textAlign: 'left' }}>創業者</th>
                    <th style={thStyle}>期間</th>
                    <th style={thStyle}>最終MRR</th>
                    <th style={thStyle}>スコア</th>
                    <th style={thStyle}>グレード</th>
                    <th style={thStyle}>EXIT</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((e: LeaderboardEntry, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={tdStyle}>{i + 1}</td>
                      <td style={{ ...tdStyle, textAlign: 'left', fontWeight: 600 }}>{e.companyName}</td>
                      <td style={{ ...tdStyle, textAlign: 'left', color: '#888' }}>{e.vertical}</td>
                      <td style={{ ...tdStyle, textAlign: 'left', color: '#888' }}>{e.founderType}</td>
                      <td style={tdStyle}>{e.month}M</td>
                      <td style={tdStyle}>{fmt(e.mrr)}</td>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>{e.score.toLocaleString()}</td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: gradeColors[e.grade] || '#888' }}>{e.grade}</td>
                      <td style={{ ...tdStyle, color: '#888' }}>{e.exitType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Achievements catalog */}
        <div style={{
          background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 20,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <h3 style={{ fontSize: 15, color: '#00c896', margin: '0 0 16px' }}>実績一覧</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200, 1fr))', gap: 8 }}>
            {achievementDefs.map(a => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', borderRadius: 6,
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                opacity: 0.6,
              }}>
                <span style={{ fontSize: 18 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#ccc' }}>{a.title}</div>
                  <div style={{ fontSize: 9, color: '#666' }}>{a.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = '#fff' }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '12px 14px',
    border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center',
  }}>
    <div style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'monospace' }}>{value}</div>
  </div>
);

const UnlockRow: React.FC<{ name: string; condition: string; unlocked: boolean }> = ({ name, condition, unlocked }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '5px 8px', borderBottom: '1px solid rgba(255,255,255,0.03)',
    fontSize: 12,
  }}>
    <span style={{ color: unlocked ? '#fff' : '#555' }}>
      {unlocked ? '🔓' : '🔒'} {name}
    </span>
    <span style={{ color: unlocked ? '#00c896' : '#444', fontSize: 10 }}>
      {unlocked ? '解放済み' : condition}
    </span>
  </div>
);

const thStyle: React.CSSProperties = { padding: '6px 4px', color: '#666', textAlign: 'center', fontWeight: 400 };
const tdStyle: React.CSSProperties = { padding: '5px 4px', color: '#bbb', textAlign: 'center', fontFamily: 'monospace' };
