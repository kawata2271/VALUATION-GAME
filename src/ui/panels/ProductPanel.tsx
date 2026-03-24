import React from 'react';
import { useGameStore } from '../hooks/useGame';
import { features, getAvailableFeatures } from '../../engine/data/features';
import { ProgressBar } from '../components/ProgressBar';

const categoryColors: Record<string, string> = {
  core: '#00c896',
  differentiation: '#6366f1',
  infrastructure: '#f59e0b',
  experience: '#ec4899',
};
const categoryLabels: Record<string, string> = {
  core: 'コア',
  differentiation: '差別化',
  infrastructure: 'インフラ',
  experience: '体験向上',
};

export const ProductPanel: React.FC = () => {
  const state = useGameStore(s => s.state)!;
  const startFeature = useGameStore(s => s.startFeature);
  const techDebtSprint = useGameStore(s => s.techDebtSprint);
  const setAllocation = useGameStore(s => s.setAllocation);

  const completedIds = state.completedFeatures.map(f => f.featureId);
  const inProgressIds = state.featuresInProgress.map(f => f.featureId);
  const available = getAvailableFeatures(completedIds).filter(f => !inProgressIds.includes(f.id));

  const engCount = state.employees.filter(e => e.role.startsWith('engineer_')).length +
    (state.founderType === 'engineer' && state.month <= 6 ? 1 : 0);

  const alloc = state.devAllocation ?? 0.8;
  const td = state.techDebtCategories ?? { infrastructure: 0, codeQuality: 0, security: 0, scalability: 0 };
  const debtColor = state.techDebt > 60 ? '#ef4444' : state.techDebt > 40 ? '#f59e0b' : '#00c896';
  const incidentProb = Math.round(state.techDebt * 0.5);
  const devPenalty = Math.round(state.techDebt * 0.5);
  const churnPenalty = (state.techDebt * 0.03).toFixed(1);

  return (
    <div>
      {/* Resource Allocation Slider */}
      <div style={{ marginBottom: 16, background: 'rgba(99,102,241,0.05)', borderRadius: 8, padding: 12, border: '1px solid rgba(99,102,241,0.15)' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', marginBottom: 8 }}>開発リソース配分</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#888', marginBottom: 4 }}>
          <span>新機能開発 {Math.round(alloc * 100)}%</span>
          <span>負債返済 {Math.round((1 - alloc) * 100)}%</span>
        </div>
        <input
          type="range" min="0" max="100" value={Math.round(alloc * 100)}
          onChange={e => setAllocation(parseInt(e.target.value) / 100)}
          style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#555', marginTop: 4 }}>
          <span>🔧 機能開発が速い</span>
          <span>🛡️ 負債が減る</span>
        </div>
        <div style={{ fontSize: 10, color: '#666', marginTop: 6 }}>
          エンジニア {engCount}人 × 配分 → 機能開発{Math.round(engCount * alloc)}人相当 / 返済{Math.round(engCount * (1 - alloc))}人相当
        </div>
      </div>

      {/* Tech Debt Dashboard */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: debtColor }}>技術負債 {state.techDebt.toFixed(0)}/100</span>
          {state.techDebt > 20 && (
            <button onClick={techDebtSprint} style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 4, padding: '3px 10px', fontSize: 10, color: '#ef4444', cursor: 'pointer',
            }}>
              スプリント
            </button>
          )}
        </div>
        <ProgressBar label="総合" value={state.techDebt} color={debtColor} />

        {/* Category breakdown */}
        <div style={{ marginTop: 6 }}>
          <CatBar label="🏗️ インフラ" value={td.infrastructure} max={25} />
          <CatBar label="💻 コード品質" value={td.codeQuality} max={25} />
          <CatBar label="🔒 セキュリティ" value={td.security} max={25} />
          <CatBar label="📈 スケーラビリティ" value={td.scalability} max={25} />
        </div>

        {/* Impact display */}
        {state.techDebt > 10 && (
          <div style={{ marginTop: 8, fontSize: 10, color: '#888', background: 'rgba(239,68,68,0.05)', borderRadius: 4, padding: '4px 8px' }}>
            <div>障害確率: <span style={{ color: debtColor }}>{incidentProb}%/月</span></div>
            <div>開発速度低下: <span style={{ color: debtColor }}>-{devPenalty}%</span></div>
            <div>解約率上乗せ: <span style={{ color: debtColor }}>+{churnPenalty}%</span></div>
          </div>
        )}

        {state.techDebt >= 70 && (
          <div style={{ marginTop: 6, fontSize: 11, color: '#ef4444', fontWeight: 700, padding: '4px 8px', background: 'rgba(239,68,68,0.1)', borderRadius: 4, textAlign: 'center' }}>
            ⚠️ 技術負債が危険域！エンジニア退職・重大障害のリスク
          </div>
        )}
      </div>

      {/* In Progress */}
      {state.featuresInProgress.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 13, color: '#6366f1', margin: '0 0 8px' }}>開発中</h4>
          {state.featuresInProgress.map(fip => {
            const feat = features.find(f => f.id === fip.featureId)!;
            const progress = ((fip.totalMonths - fip.monthsRemaining) / fip.totalMonths) * 100;
            return (
              <div key={fip.featureId} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 12px',
                marginBottom: 6, border: '1px solid rgba(99,102,241,0.2)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13 }}>{feat.name}</span>
                  <span style={{ fontSize: 11, color: '#888' }}>
                    残り{Math.ceil(fip.monthsRemaining)}ヶ月
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 3, height: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: '#6366f1', borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completed */}
      {state.completedFeatures.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h4 style={{ fontSize: 13, color: '#00c896', margin: '0 0 8px' }}>リリース済み</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {state.completedFeatures.map(cf => {
              const feat = features.find(f => f.id === cf.featureId)!;
              return (
                <span key={cf.featureId} style={{
                  fontSize: 11, padding: '3px 8px', borderRadius: 4,
                  background: `${categoryColors[feat.category]}15`,
                  color: categoryColors[feat.category],
                  border: `1px solid ${categoryColors[feat.category]}33`,
                }}>
                  {feat.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Features */}
      <div>
        <h4 style={{ fontSize: 13, color: '#888', margin: '0 0 8px' }}>開発可能な機能</h4>
        {available.length === 0 ? (
          <div style={{ color: '#555', fontSize: 12, padding: 12, textAlign: 'center' }}>
            現在開発可能な機能はありません
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {available.map(feat => (
              <div key={feat.id} style={{
                background: 'rgba(255,255,255,0.02)', borderRadius: 6, padding: '8px 12px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13 }}>{feat.name}</span>
                    <span style={{
                      fontSize: 9, padding: '1px 5px', borderRadius: 3,
                      background: `${categoryColors[feat.category]}20`,
                      color: categoryColors[feat.category],
                    }}>
                      {categoryLabels[feat.category]}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 3 }}>{feat.description}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 10, color: '#555' }}>
                    <span>NPS+{feat.npsBonus}</span>
                    <span>チャーン-{feat.churnReduction}%</span>
                    {feat.arpuBonus > 0 && <span>ARPU+${feat.arpuBonus}</span>}
                    <span>{feat.months}ヶ月</span>
                  </div>
                </div>
                <button
                  onClick={() => startFeature(feat.id)}
                  disabled={engCount === 0}
                  style={{
                    background: engCount > 0 ? '#6366f1' : '#333',
                    border: 'none', borderRadius: 4, padding: '5px 14px',
                    fontSize: 11, fontWeight: 600, color: '#fff',
                    cursor: engCount > 0 ? 'pointer' : 'not-allowed',
                    whiteSpace: 'nowrap', marginLeft: 8,
                  }}
                >
                  開発開始
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CatBar: React.FC<{ label: string; value: number; max: number }> = ({ label, value, max }) => {
  const pct = Math.min(100, (value / max) * 100);
  const color = pct > 70 ? '#ef4444' : pct > 50 ? '#f59e0b' : '#00c896';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
      <span style={{ width: 80, fontSize: 9, color: '#888' }}>{label}</span>
      <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.3s' }} />
      </div>
      <span style={{ width: 24, fontSize: 9, color: '#888', textAlign: 'right', fontFamily: 'monospace' }}>{value.toFixed(0)}</span>
    </div>
  );
};
