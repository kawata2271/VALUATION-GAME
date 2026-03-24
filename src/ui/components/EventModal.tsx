import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameEvent, EventChoice, EventEffect } from '../../engine/types';
import { formatCurrency } from '../../utils/currency';

interface Props {
  event: GameEvent;
  onChoice: (choice: EventChoice) => void;
  onDismiss: () => void;
}

const severityColors = {
  positive: '#00c896',
  neutral: '#6366f1',
  negative: '#f59e0b',
  critical: '#ef4444',
};

const severityEmoji = {
  positive: '✨',
  neutral: '📢',
  negative: '⚠️',
  critical: '🚨',
};

export const EventModal: React.FC<Props> = ({ event, onChoice, onDismiss }) => {
  const color = severityColors[event.severity];
  const emoji = severityEmoji[event.severity];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{
          background: '#12121f', border: `1px solid ${color}`,
          borderRadius: 12, padding: 24, maxWidth: 500, width: '90%',
          boxShadow: `0 0 30px ${color}33`,
        }}
      >
        <div style={{ fontSize: 13, color, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          {event.category}
        </div>
        <h3 style={{ margin: '0 0 12px', fontSize: 20 }}>
          {emoji} {event.title}
        </h3>
        <p style={{ color: '#bbb', lineHeight: 1.6, margin: '0 0 20px', fontSize: 14 }}>
          {event.description}
        </p>

        {event.choices ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {event.choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => onChoice(choice)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8, padding: '12px 16px',
                  color: '#e0e0e0', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = color;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{choice.label}</div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{choice.description}</div>
                <ImpactPreview effect={choice.effect} />
              </button>
            ))}
          </div>
        ) : (
          <div>
            {event.autoEffect && <ImpactPreview effect={event.autoEffect} />}
            <button
              onClick={onDismiss}
              style={{
                background: color, border: 'none', borderRadius: 8,
                padding: '10px 24px', color: '#000', fontWeight: 600,
                cursor: 'pointer', fontSize: 14, width: '100%', marginTop: 8,
              }}
            >
              了解
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const ImpactPreview: React.FC<{ effect: EventEffect }> = ({ effect }) => {
  const items: { label: string; value: string; color: string }[] = [];

  if (effect.cash) {
    const positive = effect.cash > 0;
    items.push({
      label: '💰',
      value: `${positive ? '+' : ''}${formatCurrency(effect.cash)}`,
      color: positive ? '#00c896' : '#ef4444',
    });
  }
  if (effect.customersDelta) {
    const positive = effect.customersDelta > 0;
    items.push({
      label: '👥',
      value: `${positive ? '+' : ''}${effect.customersDelta}社`,
      color: positive ? '#00c896' : '#ef4444',
    });
  }
  if (effect.mrrMultiplier && effect.mrrMultiplier !== 1) {
    const pct = Math.round((effect.mrrMultiplier - 1) * 100);
    items.push({
      label: '📊',
      value: `MRR ${pct >= 0 ? '+' : ''}${pct}%`,
      color: pct >= 0 ? '#00c896' : '#ef4444',
    });
  }
  if (effect.churnDelta) {
    items.push({
      label: '📉',
      value: `チャーン ${effect.churnDelta > 0 ? '+' : ''}${effect.churnDelta.toFixed(1)}%`,
      color: effect.churnDelta > 0 ? '#ef4444' : '#00c896',
    });
  }
  if (effect.npsDelta) {
    items.push({
      label: '⭐',
      value: `NPS ${effect.npsDelta > 0 ? '+' : ''}${effect.npsDelta}`,
      color: effect.npsDelta > 0 ? '#00c896' : '#ef4444',
    });
  }
  if (effect.moraleDelta) {
    items.push({
      label: '😊',
      value: `士気 ${effect.moraleDelta > 0 ? '+' : ''}${effect.moraleDelta}`,
      color: effect.moraleDelta > 0 ? '#00c896' : '#ef4444',
    });
  }
  if (effect.techDebtDelta) {
    items.push({
      label: '🔧',
      value: `負債 ${effect.techDebtDelta > 0 ? '+' : ''}${effect.techDebtDelta}`,
      color: effect.techDebtDelta > 0 ? '#ef4444' : '#00c896',
    });
  }
  if (effect.brandDelta) {
    items.push({
      label: '🏷️',
      value: `ブランド ${effect.brandDelta > 0 ? '+' : ''}${effect.brandDelta}`,
      color: effect.brandDelta > 0 ? '#00c896' : '#ef4444',
    });
  }

  if (items.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {items.map((item, i) => (
        <span key={i} style={{
          fontSize: 10, padding: '1px 5px', borderRadius: 3,
          background: `${item.color}15`, color: item.color,
          fontFamily: 'monospace',
        }}>
          {item.label} {item.value}
        </span>
      ))}
    </div>
  );
};
