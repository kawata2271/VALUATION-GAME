import React, { useState } from 'react';
import { useGameStore } from '../hooks/useGame';
import { techStacks } from '../../engine/data/techstacks';
import { archetypeLabels } from '../../engine/data/investors';
import { achievements as achievementDefs } from '../../engine/data/achievements';
import { ProgressBar } from '../components/ProgressBar';
import { Acquisition } from '../../engine/types';

const fmt = (n: number): string => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

export const StrategyPanel: React.FC = () => {
  const state = useGameStore(s => s.state)!;
  const expandGlobal = useGameStore(s => s.expandGlobal);
  const buyCompany = useGameStore(s => s.buyCompany);
  const newProduct = useGameStore(s => s.newProduct);
  const getAcqTargets = useGameStore(s => s.getAcqTargets);
  const ts = techStacks[state.techStack];
  const [acqTargets, setAcqTargets] = useState<Acquisition[]>([]);
  const arr = state.mrr * 12;

  return (
    <div>
      {/* Cofounder */}
      {state.cofounder && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 13, color: '#ec4899', margin: '0 0 8px' }}>共同創業者</h4>
          <div style={{
            background: 'rgba(236,72,153,0.05)', borderRadius: 6, padding: 10,
            border: '1px solid rgba(236,72,153,0.15)', fontSize: 12,
          }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {state.cofounder === 'tech' ? '💻 技術共同創業者' :
               state.cofounder === 'business' ? '📈 ビジネス共同創業者' :
               '🎯 ドメインエキスパート'}
            </div>
            <div style={{ color: '#888' }}>持分: 30% | トラブル回数: {state.cofounderTroubleCount}</div>
          </div>
        </div>
      )}

      {/* Tech Stack */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 13, color: '#f59e0b', margin: '0 0 8px' }}>技術スタック</h4>
        <div style={{
          background: 'rgba(245,158,11,0.05)', borderRadius: 6, padding: 10,
          border: '1px solid rgba(245,158,11,0.15)', fontSize: 12,
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{ts.nameJa}</div>
          <div style={{ color: '#888', lineHeight: 1.5 }}>{ts.description}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6, fontSize: 10 }}>
            <span style={{ color: '#00c896' }}>開発速度: x{state.month <= 18 ? ts.devSpeedEarly : ts.devSpeedLate}</span>
            <span style={{ color: '#f59e0b' }}>負債率: x{ts.techDebtRate}</span>
            {ts.infraCostExtra > 0 && <span style={{ color: '#ef4444' }}>追加コスト: ${(ts.infraCostExtra/12).toFixed(0)}/月</span>}
          </div>
          {ts.scalingLimit > 0 && state.customers > ts.scalingLimit * 0.7 && (
            <div style={{ color: '#ef4444', marginTop: 6, fontSize: 11 }}>
              ⚠ スケーリング限界に近づいています ({state.customers}/{ts.scalingLimit})
            </div>
          )}
        </div>
      </div>

      {/* Investors */}
      {state.investors.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 13, color: '#ffd700', margin: '0 0 8px' }}>投資家</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {state.investors.map(inv => (
              <div key={inv.id} style={{
                background: 'rgba(255,215,0,0.03)', borderRadius: 6, padding: '6px 10px',
                border: '1px solid rgba(255,215,0,0.1)', fontSize: 12,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <span>{inv.emoji} {inv.name}</span>
                  <span style={{ color: '#888', marginLeft: 6, fontSize: 10 }}>{archetypeLabels[inv.archetype]}</span>
                </div>
                <div style={{
                  fontSize: 10, padding: '2px 6px', borderRadius: 3,
                  background: inv.satisfaction >= 70 ? 'rgba(0,200,150,0.15)' : inv.satisfaction >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                  color: inv.satisfaction >= 70 ? '#00c896' : inv.satisfaction >= 40 ? '#f59e0b' : '#ef4444',
                }}>
                  満足度 {inv.satisfaction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Founder Skills */}
      <div style={{ marginBottom: 20 }}>
        <h4 style={{ fontSize: 13, color: '#6366f1', margin: '0 0 8px' }}>創業者スキル</h4>
        <ProgressBar label="リーダーシップ" value={state.founderSkills.leadership} max={50} color="#6366f1" />
        <ProgressBar label="資金調達" value={state.founderSkills.fundraising} max={50} color="#ffd700" />
        <ProgressBar label="プロダクト" value={state.founderSkills.product} max={50} color="#00c896" />
        <ProgressBar label="セールス" value={state.founderSkills.sales} max={50} color="#ec4899" />
        <ProgressBar label="危機管理" value={state.founderSkills.crisis} max={50} color="#ef4444" />
      </div>

      {/* Achievements */}
      <div>
        <h4 style={{ fontSize: 13, color: '#888', margin: '0 0 8px' }}>
          実績 ({state.achievements.length}/{achievementDefs.length})
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {achievementDefs.map(a => {
            const unlocked = state.achievements.includes(a.id);
            return (
              <div
                key={a.id}
                title={unlocked ? `${a.title}: ${a.description}` : '???'}
                style={{
                  fontSize: 18, width: 32, height: 32,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 4,
                  background: unlocked ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${unlocked ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.05)'}`,
                  opacity: unlocked ? 1 : 0.3,
                  cursor: 'default',
                }}
              >
                {unlocked ? a.icon : '?'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rivals */}
      {state.rivals && state.rivals.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: 13, color: '#ef4444', margin: '0 0 8px' }}>競合マップ</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Player */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(0,200,150,0.06)', borderRadius: 6, padding: '6px 10px',
              borderLeft: '3px solid #00c896',
            }}>
              <span style={{ fontSize: 12, color: '#00c896', fontWeight: 700 }}>{state.companyName} (YOU)</span>
              <span style={{ fontSize: 11, color: '#00c896', fontFamily: 'monospace' }}>{fmt(state.mrr)} MRR</span>
            </div>
            {/* Rivals */}
            {state.rivals.map((r, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'rgba(255,255,255,0.02)', borderRadius: 6, padding: '6px 10px',
                borderLeft: `3px solid ${r.status === 'active' ? (r.mrr > state.mrr ? '#ef4444' : '#888') : '#333'}`,
                opacity: r.status === 'active' ? 1 : 0.4,
              }}>
                <div>
                  <span style={{ fontSize: 12, color: r.status === 'active' ? '#ccc' : '#555' }}>{r.name}</span>
                  {r.status !== 'active' && (
                    <span style={{ fontSize: 9, color: '#555', marginLeft: 6 }}>
                      {r.status === 'acquired' ? '買収済' : '撤退'}
                    </span>
                  )}
                </div>
                <span style={{
                  fontSize: 11, fontFamily: 'monospace',
                  color: r.mrr > state.mrr ? '#ef4444' : '#888',
                }}>
                  {r.status === 'active' ? `${fmt(r.mrr)} MRR` : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Expansion */}
      <div style={{ marginTop: 20 }}>
        <h4 style={{ fontSize: 13, color: '#00c896', margin: '0 0 8px' }}>グローバル展開</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {state.globalRegions.map(r => (
            <div key={r.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'rgba(255,255,255,0.02)', borderRadius: 6, padding: '6px 10px',
              borderLeft: `3px solid ${r.unlocked ? '#00c896' : r.expanding ? '#f59e0b' : '#333'}`,
            }}>
              <div>
                <span style={{ fontSize: 12, color: r.unlocked ? '#fff' : '#888' }}>{r.nameJa}</span>
                {r.expanding && (
                  <span style={{ fontSize: 10, color: '#f59e0b', marginLeft: 6 }}>展開中 ({r.expandingMonthsLeft}ヶ月)</span>
                )}
                {r.unlocked && r.id !== 'north_america' && (
                  <span style={{ fontSize: 10, color: '#00c896', marginLeft: 6 }}>x{r.marketMultiplier}</span>
                )}
              </div>
              {!r.unlocked && !r.expanding && (
                <button
                  onClick={() => expandGlobal(r.id)}
                  disabled={state.cash < r.setupCost}
                  style={{
                    background: state.cash >= r.setupCost ? '#00c896' : '#333',
                    border: 'none', borderRadius: 4, padding: '3px 10px',
                    fontSize: 10, color: state.cash >= r.setupCost ? '#000' : '#666',
                    cursor: state.cash >= r.setupCost ? 'pointer' : 'not-allowed',
                  }}
                >
                  {fmt(r.setupCost)} / {r.setupMonths}ヶ月
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* M&A (buying) */}
      {arr >= 5_000_000 && (
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: 13, color: '#ec4899', margin: '0 0 8px' }}>M&A（買収）</h4>
          {state.acquisitions.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              {state.acquisitions.map((a, i) => (
                <div key={i} style={{ fontSize: 11, color: '#888', padding: '2px 0' }}>
                  ✓ {a.targetName} ({a.synergy})
                </div>
              ))}
            </div>
          )}
          {acqTargets.length === 0 ? (
            <button
              onClick={() => setAcqTargets(getAcqTargets())}
              style={{
                background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)',
                borderRadius: 6, padding: '6px 14px', fontSize: 11, color: '#ec4899',
                cursor: 'pointer', width: '100%',
              }}
            >
              買収ターゲットを探す
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {acqTargets.map(t => (
                <div key={t.id} style={{
                  background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 10,
                  border: '1px solid rgba(236,72,153,0.15)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{t.targetName}</span>
                    <span style={{ fontSize: 11, color: '#ec4899' }}>{fmt(t.cost)}</span>
                  </div>
                  <div style={{ fontSize: 10, color: '#888', marginBottom: 6 }}>
                    MRR+{fmt(t.monthlyRevenue)} | {t.teamSize}人 | 負債+{t.techDebtAdded} | {t.synergy}
                  </div>
                  <button
                    onClick={() => { buyCompany(t); setAcqTargets([]); }}
                    disabled={state.cash < t.cost}
                    style={{
                      background: state.cash >= t.cost ? '#ec4899' : '#333',
                      border: 'none', borderRadius: 4, padding: '4px 12px',
                      fontSize: 10, color: state.cash >= t.cost ? '#000' : '#666',
                      cursor: state.cash >= t.cost ? 'pointer' : 'not-allowed', width: '100%',
                    }}
                  >
                    買収する
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Multi-product */}
      {arr >= 5_000_000 && (
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: 13, color: '#6366f1', margin: '0 0 8px' }}>マルチプロダクト</h4>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
            プロダクト数: {1 + state.multiProductCount}
          </div>
          <button
            onClick={newProduct}
            disabled={state.cash < 500000}
            style={{
              background: state.cash >= 500000 ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${state.cash >= 500000 ? '#6366f1' : 'rgba(255,255,255,0.06)'}`,
              borderRadius: 6, padding: '8px 14px', fontSize: 11,
              color: state.cash >= 500000 ? '#6366f1' : '#555',
              cursor: state.cash >= 500000 ? 'pointer' : 'not-allowed', width: '100%',
            }}
          >
            新プロダクトを立ち上げ ($500K | MRR+10% | 負債+15)
          </button>
        </div>
      )}

      {/* Market Info */}
      <div style={{ marginTop: 20 }}>
        <h4 style={{ fontSize: 13, color: '#888', margin: '0 0 8px' }}>市場環境</h4>
        <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>経済サイクル</span>
            <span style={{
              color: state.economyCycle > 0.05 ? '#00c896' : state.economyCycle < -0.05 ? '#ef4444' : '#888',
              fontFamily: 'monospace',
            }}>
              {state.economyCycle > 0.05 ? '好景気' : state.economyCycle < -0.05 ? '不景気' : '安定'}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>競合圧力</span>
            <span style={{ color: '#f59e0b', fontFamily: 'monospace' }}>{state.competitorPressure.toFixed(0)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#888' }}>PMF</span>
            <span style={{ color: state.pmfAchieved ? '#00c896' : '#ef4444' }}>
              {state.pmfAchieved ? '達成済み' : '未達成'}
            </span>
          </div>
          {state.gameMode !== 'normal' && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#888' }}>モード</span>
              <span style={{ color: state.gameMode === 'hard' ? '#ef4444' : '#ffd700' }}>
                {state.gameMode === 'hard' ? 'ハード' : 'サンドボックス'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
