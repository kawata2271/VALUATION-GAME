import React, { useState } from 'react';
import { useGameStore } from '../hooks/useGame';
import { verticals } from '../../engine/data/verticals';
import { founders } from '../../engine/data/founders';
import { techStacks } from '../../engine/data/techstacks';
import { cofounders } from '../../engine/data/cofounders';
import { VerticalId, FounderType, TechStack, CofounderType, GameMode } from '../../engine/types';
import { scenarios } from '../../engine/data/scenarios';
import { getUnlocks } from '../../engine/data/unlocks';

export const SetupScreen: React.FC = () => {
  const startGame = useGameStore(s => s.startGame);
  const unlocks = getUnlocks();
  const setScreen = useGameStore(s => s.setScreen);
  const [step, setStep] = useState<'mode' | 'name' | 'vertical' | 'founder' | 'techstack' | 'cofounder'>('mode');
  const [companyName, setCompanyName] = useState('');
  const [selectedVertical, setSelectedVertical] = useState<VerticalId | null>(null);
  const [selectedFounder, setSelectedFounder] = useState<FounderType | null>(null);
  const [selectedTechStack, setSelectedTechStack] = useState<TechStack>('monolith');
  const [gameMode, setGameMode] = useState<GameMode>('normal');
  const [scenarioId, setScenarioId] = useState<string | null>(null);

  const stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

  if (step === 'mode') {
    return (
      <div style={containerStyle}>
        <h2 style={headingStyle}>ゲームモードを選択</h2>
        <p style={subStyle}>どのモードでプレイしますか？</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200, 1fr))', gap: 12, maxWidth: 700, width: '100%', marginBottom: 24 }}>
          {([
            { mode: 'normal' as GameMode, label: 'ノーマル', emoji: '🎮', desc: '標準的なSaaS経営体験。バランスの取れた難易度。' },
            { mode: 'hard' as GameMode, label: 'ハード', emoji: '💀', desc: '初期資金半減、顧客獲得-30%。真の経営者だけが生き残る。' },
            { mode: 'sandbox' as GameMode, label: 'サンドボックス', emoji: '🏖️', desc: '初期資金$10M。自由に実験できるモード。' },
          ]).map(m => (
            <button
              key={m.mode}
              onClick={() => { setGameMode(m.mode); setScenarioId(null); setStep('name'); }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: 20, cursor: 'pointer',
                textAlign: 'left', color: '#e0e0e0', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#00c896'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{m.emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{m.label}</div>
              <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{m.desc}</div>
            </button>
          ))}
        </div>

        <h3 style={{ fontSize: 16, color: '#ffd700', margin: '0 0 12px' }}>歴史シナリオ</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240, 1fr))', gap: 10, maxWidth: 800, width: '100%' }}>
          {scenarios.map(sc => {
            const locked = !unlocks.scenarios.includes(sc.id);
            return (
            <button
              key={sc.id}
              onClick={() => {
                if (locked) return;
                setScenarioId(sc.id);
                setGameMode('normal');
                if (sc.verticalLock) setSelectedVertical(sc.verticalLock);
                if (sc.founderLock) setSelectedFounder(sc.founderLock);
                if (sc.techStackLock) setSelectedTechStack(sc.techStackLock);
                setStep('name');
              }}
              disabled={locked}
              style={{
                background: locked ? 'rgba(255,255,255,0.01)' : 'rgba(255,215,0,0.03)',
                border: `1px solid ${locked ? 'rgba(255,255,255,0.04)' : 'rgba(255,215,0,0.1)'}`,
                borderRadius: 10, padding: 14, cursor: locked ? 'not-allowed' : 'pointer',
                textAlign: 'left', color: locked ? '#444' : '#e0e0e0',
                transition: 'all 0.15s', opacity: locked ? 0.4 : 1,
              }}
              onMouseEnter={e => { if (!locked) e.currentTarget.style.borderColor = '#ffd700'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,215,0,0.1)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>{locked ? '🔒' : sc.icon}</span>
                <span style={{ fontSize: 10, color: '#f59e0b' }}>{stars(sc.difficulty)}</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{locked ? '???' : sc.nameJa}</div>
              {locked ? (
                <div style={{ fontSize: 11, color: '#555' }}>条件を満たすと解放</div>
              ) : (
                <>
                  <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5, marginBottom: 6 }}>{sc.description}</div>
                  {sc.specialRules && (
                    <div style={{ fontSize: 9, color: '#666' }}>
                      {sc.specialRules.slice(0, 2).join(' | ')}
                    </div>
                  )}
                </>
              )}
            </button>
            );
          })}
        </div>

        <button onClick={() => setScreen('title')} style={{ ...btnSecondary, marginTop: 16 }}>戻る</button>
      </div>
    );
  }

  if (step === 'name') {
    return (
      <div style={containerStyle}>
        <h2 style={headingStyle}>会社名を決める</h2>
        <p style={subStyle}>あなたのSaaS企業の名前を入力してください</p>
        <input
          type="text"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          placeholder="例: CloudSync, DataFlow..."
          maxLength={20}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 8, padding: '14px 20px', fontSize: 18, color: '#fff',
            width: '100%', maxWidth: 400, outline: 'none', textAlign: 'center',
            fontFamily: 'JetBrains Mono, monospace',
          }}
          onFocus={e => e.target.style.borderColor = '#00c896'}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter' && companyName.trim()) setStep('vertical');
          }}
        />
        <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
          <button onClick={() => setStep('mode')} style={btnSecondary}>戻る</button>
          <button
            onClick={() => {
              if (!companyName.trim()) return;
              // For scenarios with locked settings, skip to cofounder
              const scenario = scenarioId ? scenarios.find(s => s.id === scenarioId) : null;
              if (scenario?.verticalLock && scenario?.founderLock && scenario?.techStackLock) {
                setStep('cofounder');
              } else if (scenario?.verticalLock) {
                setStep('founder');
              } else {
                setStep('vertical');
              }
            }}
            disabled={!companyName.trim()}
            style={{ ...btnPrimary, opacity: companyName.trim() ? 1 : 0.4 }}
          >
            次へ
          </button>
        </div>
      </div>
    );
  }

  if (step === 'vertical') {
    return (
      <div style={containerStyle}>
        <h2 style={headingStyle}>事業領域を選択</h2>
        <p style={subStyle}>どの市場で戦いますか？</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280, 1fr))', gap: 12, maxWidth: 900, width: '100%' }}>
          {Object.values(verticals).map(v => {
            const locked = !unlocks.verticals.includes(v.id);
            return (
            <button
              key={v.id}
              onClick={() => { if (!locked) { setSelectedVertical(v.id); setStep('founder'); } }}
              disabled={locked}
              style={{
                background: locked ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${locked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 10, padding: 16, cursor: locked ? 'not-allowed' : 'pointer',
                textAlign: 'left', color: locked ? '#444' : '#e0e0e0',
                transition: 'all 0.15s', opacity: locked ? 0.5 : 1,
              }}
              onMouseEnter={e => {
                if (locked) return;
                e.currentTarget.style.borderColor = '#00c896';
                e.currentTarget.style.background = 'rgba(0,200,150,0.05)';
              }}
              onMouseLeave={e => {
                if (locked) return;
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{locked ? '🔒 ' : ''}{v.nameJa}</span>
                <span style={{ fontSize: 12, color: '#888' }}>{v.name}</span>
              </div>
              {locked ? (
                <div style={{ fontSize: 12, color: '#555' }}>条件を満たすと解放されます</div>
              ) : (
                <>
                  <div style={{ fontSize: 12, color: '#f59e0b', marginBottom: 8 }}>
                    難易度: {stars(v.difficulty)}
                  </div>
                  <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>
                    {v.description}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 11, color: '#666' }}>
                    <span>TAM: ${(v.tam / 1e9).toFixed(0)}B</span>
                    <span>基本チャーン: {v.baseChurn}%</span>
                    <span>CAC: ${v.baseCac}</span>
                  </div>
                </>
              )}
            </button>
            );
          })}
        </div>
        <button onClick={() => setStep('name')} style={{ ...btnSecondary, marginTop: 16 }}>戻る</button>
      </div>
    );
  }

  // founder selection
  if (step === 'founder') {
  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>創業者タイプを選択</h2>
      <p style={subStyle}>{companyName} の創業者はどんな人物？</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240, 1fr))', gap: 12, maxWidth: 800, width: '100%' }}>
        {Object.values(founders).map(f => {
          const locked = !unlocks.founders.includes(f.type);
          return (
          <button
            key={f.type}
            onClick={() => { if (!locked) { setSelectedFounder(f.type); setStep('techstack'); } }}
            disabled={locked}
            style={{
              background: locked ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${locked ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 10, padding: 20, cursor: locked ? 'not-allowed' : 'pointer',
              textAlign: 'left', color: locked ? '#444' : '#e0e0e0',
              transition: 'all 0.15s', opacity: locked ? 0.5 : 1,
            }}
            onMouseEnter={e => {
              if (locked) return;
              e.currentTarget.style.borderColor = '#6366f1';
              e.currentTarget.style.background = 'rgba(99,102,241,0.05)';
            }}
            onMouseLeave={e => {
              if (locked) return;
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{locked ? '🔒' : f.emoji}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{locked ? '???' : f.nameJa}</div>
            {locked ? (
              <div style={{ fontSize: 12, color: '#555' }}>条件を満たすと解放されます</div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: 10 }}>{f.description}</div>
                <div style={{ fontSize: 11, color: '#6366f1' }}>{f.specialAbility}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  <StatBadge label="開発" value={f.devSpeedBonus} />
                  <StatBadge label="品質" value={f.qualityBonus} />
                  <StatBadge label="営業" value={f.salesBonus} />
                  <StatBadge label="調達" value={f.fundingBonus} />
                </div>
              </>
            )}
          </button>
          );
        })}
      </div>
      <button onClick={() => setStep('vertical')} style={{ ...btnSecondary, marginTop: 16 }}>戻る</button>
    </div>
  );
  }

  if (step === 'techstack') {
    return (
      <div style={containerStyle}>
        <h2 style={headingStyle}>技術スタックを選択</h2>
        <p style={subStyle}>プロダクトの技術基盤を決めましょう</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220, 1fr))', gap: 12, maxWidth: 900, width: '100%' }}>
          {Object.values(techStacks).map(ts => (
            <button
              key={ts.id}
              onClick={() => { setSelectedTechStack(ts.id); setStep('cofounder'); }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10, padding: 16, cursor: 'pointer',
                textAlign: 'left', color: '#e0e0e0', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.background = 'rgba(245,158,11,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{ts.nameJa}</div>
              <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: 10 }}>{ts.description}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: 10 }}>
                <span style={{ padding: '2px 6px', borderRadius: 3, background: 'rgba(0,200,150,0.15)', color: '#00c896' }}>
                  初期速度 x{ts.devSpeedEarly}
                </span>
                <span style={{ padding: '2px 6px', borderRadius: 3, background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                  後期速度 x{ts.devSpeedLate}
                </span>
                <span style={{ padding: '2px 6px', borderRadius: 3, background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                  負債率 x{ts.techDebtRate}
                </span>
                {ts.scalingLimit > 0 && (
                  <span style={{ padding: '2px 6px', borderRadius: 3, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                    上限 {ts.scalingLimit}社
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        <button onClick={() => setStep('founder')} style={{ ...btnSecondary, marginTop: 16 }}>戻る</button>
      </div>
    );
  }

  // cofounder selection
  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>共同創業者を選ぶ</h2>
      <p style={subStyle}>共同創業者は能力を補完するが、株式を分割する必要がある</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220, 1fr))', gap: 12, maxWidth: 900, width: '100%' }}>
        {/* No cofounder option */}
        <button
          onClick={() => startGame(companyName.trim(), selectedVertical!, selectedFounder!, selectedTechStack, null, gameMode, scenarioId)}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 10, padding: 16, cursor: 'pointer',
            textAlign: 'left', color: '#e0e0e0', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#00c896'; e.currentTarget.style.background = 'rgba(0,200,150,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🚀</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>ソロ創業</div>
          <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: 8 }}>
            共同創業者なし。株式100%を維持。全ての決定権はあなたに。
          </div>
          <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(0,200,150,0.15)', color: '#00c896' }}>
            持分 100%
          </span>
        </button>

        {cofounders.map(cf => (
          <button
            key={cf.type}
            onClick={() => startGame(companyName.trim(), selectedVertical!, selectedFounder!, selectedTechStack, cf.type, gameMode, scenarioId)}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10, padding: 16, cursor: 'pointer',
              textAlign: 'left', color: '#e0e0e0', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#ec4899'; e.currentTarget.style.background = 'rgba(236,72,153,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>{cf.emoji}</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{cf.nameJa}</div>
            <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5, marginBottom: 8 }}>{cf.description}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(236,72,153,0.15)', color: '#ec4899' }}>
                持分 70%
              </span>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 3, background: 'rgba(99,102,241,0.15)', color: '#6366f1' }}>
                {cf.effect}
              </span>
            </div>
          </button>
        ))}
      </div>
      <button onClick={() => setStep('techstack')} style={{ ...btnSecondary, marginTop: 16 }}>戻る</button>
    </div>
  );
};

const StatBadge: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const color = value > 0 ? '#00c896' : value < 0 ? '#ef4444' : '#666';
  const text = value > 0 ? `+${(value * 100).toFixed(0)}%` : value < 0 ? `${(value * 100).toFixed(0)}%` : '±0';
  return (
    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${color}22`, color, border: `1px solid ${color}44` }}>
      {label} {text}
    </span>
  );
};

const containerStyle: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', flexDirection: 'column',
  alignItems: 'center', justifyContent: 'center', padding: 24,
  background: 'radial-gradient(ellipse at center, #0f0f2e 0%, #0a0a0f 70%)',
};

const headingStyle: React.CSSProperties = {
  fontSize: 24, fontWeight: 700, margin: '0 0 8px', color: '#fff',
};

const subStyle: React.CSSProperties = {
  fontSize: 14, color: '#888', margin: '0 0 24px',
};

const btnPrimary: React.CSSProperties = {
  background: '#00c896', border: 'none', borderRadius: 8,
  padding: '10px 32px', fontSize: 14, fontWeight: 600,
  color: '#000', cursor: 'pointer',
};

const btnSecondary: React.CSSProperties = {
  background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 8, padding: '10px 32px', fontSize: 14,
  color: '#888', cursor: 'pointer',
};
