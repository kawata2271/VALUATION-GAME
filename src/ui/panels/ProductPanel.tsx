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

  const completedIds = state.completedFeatures.map(f => f.featureId);
  const inProgressIds = state.featuresInProgress.map(f => f.featureId);
  const available = getAvailableFeatures(completedIds).filter(f => !inProgressIds.includes(f.id));

  const engCount = state.employees.filter(e => e.role.startsWith('engineer_')).length +
    (state.founderType === 'engineer' && state.month <= 6 ? 1 : 0);

  return (
    <div>
      {/* Tech Debt */}
      <div style={{ marginBottom: 20 }}>
        <ProgressBar
          label="技術負債"
          value={state.techDebt}
          color={state.techDebt > 60 ? '#ef4444' : state.techDebt > 40 ? '#f59e0b' : '#00c896'}
        />
        {state.techDebt > 20 && (
          <button onClick={techDebtSprint} style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 6, padding: '6px 14px', fontSize: 11, color: '#ef4444', cursor: 'pointer',
            marginTop: 4,
          }}>
            技術負債スプリント (-20)
          </button>
        )}
        <div style={{ fontSize: 11, color: '#666', marginTop: 6 }}>
          開発リソース: エンジニア {engCount}人
        </div>
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
