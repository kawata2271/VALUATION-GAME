import React, { useEffect, useState } from 'react';
import { useGameStore } from '../hooks/useGame';
import { getGrade, verticals, founders } from '../../engine/GameEngine';
import { ShareResult } from '../components/ShareResult';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getUnlocks, saveUnlocks, processUnlocks } from '../../engine/data/unlocks';
import { addToLeaderboard, getLeaderboard, LeaderboardEntry } from '../../engine/data/leaderboard';
import { formatCurrency } from '../../utils/currency';

const exitLabels: Record<string, { label: string; color: string }> = {
  ipo: { label: 'IPO達成', color: '#ffd700' },
  mna: { label: 'M&A成立', color: '#6366f1' },
  continue: { label: '継続経営', color: '#00c896' },
  bankrupt: { label: '倒産', color: '#ef4444' },
};

const gradeColors: Record<string, string> = {
  SSS: '#ffd700',
  SS: '#ff9500',
  S: '#ec4899',
  A: '#6366f1',
  B: '#00c896',
  C: '#f59e0b',
  D: '#888',
  F: '#ef4444',
};

export const GameOverScreen: React.FC = () => {
  const state = useGameStore(s => s.state)!;
  const resetGame = useGameStore(s => s.resetGame);

  const exit = exitLabels[state.exitType || 'bankrupt'];
  const { grade, title } = getGrade(state.finalScore);
  const gradeColor = gradeColors[grade];
  const [newUnlocks, setNewUnlocks] = useState<string[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const leaderboard = getLeaderboard();

  const mrrData = state.history.map(h => ({ month: h.month, mrr: Math.round(h.mrr / 1000) }));

  // Process unlocks and leaderboard on mount
  useEffect(() => {
    // Update unlocks
    const unlocks = getUnlocks();
    unlocks.totalPlaythroughs += 1;
    if (state.finalScore > unlocks.bestScore) unlocks.bestScore = state.finalScore;
    if (gradeRank(grade) > gradeRank(unlocks.bestGrade)) unlocks.bestGrade = grade;
    if (state.exitType && !unlocks.exitTypes.includes(state.exitType)) {
      unlocks.exitTypes.push(state.exitType);
    }
    const { updated, newUnlocks: nu } = processUnlocks(unlocks);
    saveUnlocks(updated);
    setNewUnlocks(nu);

    // Add to leaderboard
    if (state.finalScore > 0) {
      addToLeaderboard({
        companyName: state.companyName,
        vertical: verticals[state.vertical]?.nameJa || state.vertical,
        founderType: founders[state.founderType]?.nameJa || state.founderType,
        score: state.finalScore,
        grade,
        exitType: exit.label,
        month: state.month,
        mrr: state.mrr,
        valuation: state.valuation,
        date: new Date().toISOString(),
      });
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: 'radial-gradient(ellipse at center, #0f0f2e 0%, #0a0a0f 70%)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 600, width: '100%' }}>
        {/* Exit Type */}
        <div style={{
          fontSize: 14, letterSpacing: 4, color: exit.color,
          textTransform: 'uppercase', marginBottom: 8,
        }}>
          {exit.label}
        </div>

        {/* Company Name */}
        <h2 style={{ fontSize: 28, margin: '0 0 24px', color: '#fff' }}>
          {state.companyName}
        </h2>

        {/* Grade */}
        <div style={{
          fontSize: 80, fontWeight: 900, color: gradeColor,
          textShadow: `0 0 40px ${gradeColor}66`,
          lineHeight: 1,
          marginBottom: 8,
        }}>
          {grade}
        </div>
        <div style={{ fontSize: 18, color: gradeColor, marginBottom: 4 }}>
          「{title}」
        </div>
        <div style={{ fontSize: 32, fontWeight: 700, color: '#fff', fontFamily: 'monospace', marginBottom: 32 }}>
          {state.finalScore.toLocaleString()} pts
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
          marginBottom: 24,
        }}>
          <StatCard label="最終MRR" value={formatCurrency(state.mrr)} />
          <StatCard label="最終ARR" value={formatCurrency(state.mrr * 12)} />
          <StatCard label="評価額" value={formatCurrency(state.valuation)} color="#ffd700" />
          <StatCard label="顧客数" value={`${state.customers}社`} />
          <StatCard label="チーム" value={`${state.employees.length}人`} />
          <StatCard label="持分" value={`${state.founderEquity.toFixed(0)}%`} color="#ec4899" />
          <StatCard label="経営期間" value={`${state.month}ヶ月`} />
          <StatCard label="調達回数" value={`${state.fundingRounds.length}回`} />
          <StatCard label="NPS" value={`${state.nps.toFixed(0)}`} />
        </div>

        {/* MRR Chart */}
        {mrrData.length > 2 && (
          <div style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 16,
            marginBottom: 24, border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>MRR推移 (¥K)</div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={mrrData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#555" tick={{ fontSize: 10 }} />
                <YAxis stroke="#555" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid #333', borderRadius: 6, fontSize: 11 }} />
                <Line type="monotone" dataKey="mrr" stroke="#00c896" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Journey Timeline */}
        {state.eventLog.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 16,
            marginBottom: 24, border: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'left', maxHeight: 200, overflow: 'auto',
          }}>
            <div style={{ fontSize: 12, color: '#6366f1', marginBottom: 10, fontWeight: 600 }}>会社の軌跡</div>
            <div style={{ position: 'relative', paddingLeft: 16 }}>
              <div style={{
                position: 'absolute', left: 4, top: 0, bottom: 0, width: 2,
                background: 'linear-gradient(to bottom, #00c896, #6366f1, #ec4899)',
                borderRadius: 1,
              }} />
              {state.eventLog
                .filter(e => !['選択結果'].includes(e.title))
                .filter((_, i, arr) => {
                  // Show max ~15 key events
                  if (arr.length <= 15) return true;
                  return i % Math.ceil(arr.length / 15) === 0 || i === arr.length - 1;
                })
                .map((e, i) => (
                  <div key={i} style={{
                    position: 'relative', paddingBottom: 8, paddingLeft: 12,
                  }}>
                    <div style={{
                      position: 'absolute', left: -4, top: 4, width: 8, height: 8,
                      borderRadius: '50%', background: '#6366f1',
                      border: '2px solid #12121f',
                    }} />
                    <div style={{ fontSize: 10, color: '#555', fontFamily: 'monospace' }}>Month {e.month}</div>
                    <div style={{ fontSize: 11, color: '#ccc' }}>{e.title}</div>
                    <div style={{ fontSize: 10, color: '#666' }}>{e.effect}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Bonuses/Penalties */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 16,
          marginBottom: 24, border: '1px solid rgba(255,255,255,0.05)',
          textAlign: 'left',
        }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>スコア修正</div>
          <BonusLine positive={state.profitableMonth} label="黒字化達成" value="+20%" />
          <BonusLine positive={state.highNpsStreak >= 12} label="NPS70以上を12ヶ月維持" value="+15%" />
          <BonusLine positive={state.highMoraleStreak >= 12} label="士気80以上を12ヶ月維持" value="+10%" />
          <BonusLine positive={state.techDebt <= 30} label="技術負債30以下維持" value="+10%" />
          <BonusLine positive={!state.downRound} label="ダウンラウンドなし" value="+25%" />
          {state.fundingRounds.length === 0 && state.exitType === 'ipo' && (
            <BonusLine positive label="ブートストラップIPO" value="+30%" />
          )}
          {state.pivotCount >= 3 && <BonusLine positive={false} label="ピボット3回以上" value="-15%" />}
          {state.layoffDone && <BonusLine positive={false} label="大規模レイオフ" value="-10%" />}
          {state.securityBreachIgnored && <BonusLine positive={false} label="セキュリティ侵害放置" value="-20%" />}
          {state.founderEquity < 20 && <BonusLine positive={false} label="持分20%以下" value="-10%" />}
        </div>

        {/* New Unlocks */}
        {newUnlocks.length > 0 && (
          <div style={{
            background: 'rgba(255,215,0,0.05)', borderRadius: 8, padding: 16,
            marginBottom: 24, border: '1px solid rgba(255,215,0,0.2)',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: 13, color: '#ffd700', fontWeight: 700, marginBottom: 8 }}>
              NEW UNLOCK!
            </div>
            {newUnlocks.map((u, i) => (
              <div key={i} style={{ fontSize: 12, color: '#ffd700', padding: '2px 0' }}>
                🔓 {u}
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard Toggle */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button
            onClick={resetGame}
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: 'none', borderRadius: 8,
              padding: '14px 36px', fontSize: 15, fontWeight: 600,
              color: '#fff', cursor: 'pointer', letterSpacing: 2,
              boxShadow: '0 0 20px rgba(99,102,241,0.3)',
            }}
          >
            もう一度プレイ
          </button>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            style={{
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.3)', borderRadius: 8,
              padding: '14px 24px', fontSize: 14, fontWeight: 600,
              color: '#ffd700', cursor: 'pointer',
            }}
          >
            {showLeaderboard ? '閉じる' : 'ランキング'}
          </button>
          <ShareResult state={state} />
        </div>

        {/* Leaderboard */}
        {showLeaderboard && leaderboard.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: 16,
            border: '1px solid rgba(255,255,255,0.06)', width: '100%',
          }}>
            <div style={{ fontSize: 13, color: '#ffd700', fontWeight: 700, marginBottom: 10 }}>
              Top Scores
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '4px 0', textAlign: 'left', color: '#666' }}>#</th>
                  <th style={{ padding: '4px 0', textAlign: 'left', color: '#666' }}>会社名</th>
                  <th style={{ padding: '4px 0', textAlign: 'left', color: '#666' }}>領域</th>
                  <th style={{ padding: '4px 0', textAlign: 'right', color: '#666' }}>スコア</th>
                  <th style={{ padding: '4px 0', textAlign: 'right', color: '#666' }}>グレード</th>
                  <th style={{ padding: '4px 0', textAlign: 'right', color: '#666' }}>EXIT</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 10).map((entry: LeaderboardEntry, i: number) => (
                  <tr key={i} style={{
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    color: entry.companyName === state.companyName && entry.score === state.finalScore ? '#ffd700' : '#bbb',
                  }}>
                    <td style={{ padding: '4px 0' }}>{i + 1}</td>
                    <td style={{ padding: '4px 0', fontWeight: 600 }}>{entry.companyName}</td>
                    <td style={{ padding: '4px 0', color: '#888' }}>{entry.vertical}</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontFamily: 'monospace' }}>{entry.score.toLocaleString()}</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', fontWeight: 700, color: gradeColors[entry.grade as keyof typeof gradeColors] || '#888' }}>{entry.grade}</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', color: '#888' }}>{entry.exitType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

function gradeRank(g: string): number {
  const ranks: Record<string, number> = { F: 0, D: 1, C: 2, B: 3, A: 4, S: 5, SS: 6, SSS: 7 };
  return ranks[g] ?? 0;
}

const StatCard: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = '#e0e0e0' }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '10px 12px',
    border: '1px solid rgba(255,255,255,0.05)',
  }}>
    <div style={{ fontSize: 10, color: '#666', marginBottom: 3 }}>{label}</div>
    <div style={{ fontSize: 16, fontWeight: 700, color, fontFamily: 'monospace' }}>{value}</div>
  </div>
);

const BonusLine: React.FC<{ positive: boolean; label: string; value: string }> = ({ positive, label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0' }}>
    <span style={{ color: positive ? '#00c896' : '#888' }}>
      {positive ? '✓' : '✗'} {label}
    </span>
    <span style={{ color: positive ? '#00c896' : '#666', fontFamily: 'monospace' }}>{value}</span>
  </div>
);
