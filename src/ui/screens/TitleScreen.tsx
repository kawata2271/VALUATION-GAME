import React, { useState } from 'react';
import { useGameStore } from '../hooks/useGame';
import { getSaveSlots, SaveSlot } from '../hooks/useSave';
import { getLang, setLang, t } from '../../engine/data/i18n';

const fmt = (n: number): string => {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
};

export const TitleScreen: React.FC = () => {
  const setScreen = useGameStore(s => s.setScreen);
  const resumeAutoSave = useGameStore(s => s.resumeAutoSave);
  const hasAutoSave = useGameStore(s => s.hasAutoSave);
  const loadGame = useGameStore(s => s.loadGame);
  const [showSlots, setShowSlots] = useState(false);

  const canResume = hasAutoSave();
  const slots = getSaveSlots();

  return (
    <div style={{
      height: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #0f0f2e 0%, #0a0a0f 70%)',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 14, letterSpacing: 6, color: '#00c896',
          marginBottom: 16, textTransform: 'uppercase',
        }}>
          SaaS Management Simulation
        </div>
        <h1 style={{
          fontSize: 64, fontWeight: 800, margin: 0,
          background: 'linear-gradient(135deg, #00c896 0%, #6366f1 50%, #ec4899 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: 4,
        }}>
          VALUATION
        </h1>
        <h2 style={{
          fontSize: 28, fontWeight: 300, margin: '4px 0 0',
          color: '#fff', letterSpacing: 12,
        }}>
          GAME
        </h2>

        <p style={{ color: '#666', margin: '32px 0', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {t('title.subtitle')}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => setScreen('setup')}
            style={{
              background: 'linear-gradient(135deg, #00c896, #00a87a)',
              border: 'none', borderRadius: 8,
              padding: '14px 48px', fontSize: 16, fontWeight: 600,
              color: '#000', cursor: 'pointer', letterSpacing: 2,
              boxShadow: '0 0 20px rgba(0,200,150,0.3)',
              transition: 'all 0.2s', width: 240,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,200,150,0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,200,150,0.3)';
            }}
          >
            {t('title.newgame')}
          </button>

          {canResume && (
            <button
              onClick={resumeAutoSave}
              style={{
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid #6366f1', borderRadius: 8,
                padding: '12px 48px', fontSize: 14, fontWeight: 600,
                color: '#6366f1', cursor: 'pointer', letterSpacing: 2,
                transition: 'all 0.2s', width: 240,
              }}
            >
              {t('title.continue')}
            </button>
          )}

          {slots.length > 0 && (
            <button
              onClick={() => setShowSlots(!showSlots)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
                padding: '10px 48px', fontSize: 13,
                color: '#888', cursor: 'pointer', letterSpacing: 1,
                width: 240,
              }}
            >
              {t('title.loadsave')}
            </button>
          )}

          <button
            onClick={() => setScreen('stats')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
              padding: '10px 48px', fontSize: 13,
              color: '#888', cursor: 'pointer', letterSpacing: 1,
              width: 240,
            }}
          >
            STATS
          </button>
        </div>

        {/* Save Slots */}
        {showSlots && slots.length > 0 && (
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
            {slots.map((slot: SaveSlot) => (
              <button
                key={slot.id}
                onClick={() => loadGame(slot.id)}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6,
                  padding: '8px 16px', color: '#ccc', cursor: 'pointer',
                  width: 280, textAlign: 'left', fontSize: 12,
                  display: 'flex', justifyContent: 'space-between',
                }}
              >
                <span>
                  <strong>{slot.companyName}</strong>
                  <span style={{ color: '#666', marginLeft: 8 }}>Month {slot.month}</span>
                </span>
                <span style={{ color: '#00c896' }}>{fmt(slot.mrr)} MRR</span>
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop: 48, color: '#444', fontSize: 12 }}>
          <button
            onClick={() => { setLang(getLang() === 'ja' ? 'en' : 'ja'); window.location.reload(); }}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 4, padding: '3px 10px', cursor: 'pointer',
              fontSize: 11, color: '#666', marginBottom: 8,
            }}
          >
            {getLang() === 'ja' ? 'English' : '日本語'}
          </button>
          <br />
          v1.0
        </div>
      </div>
    </div>
  );
};
