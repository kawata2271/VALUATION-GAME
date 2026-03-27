import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { InterviewEvent, InterviewChoiceEffect, InterviewStage } from '../../../engine/recruiting';
import { INTERVIEW_STAGE_LABELS } from '../../../engine/recruiting';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  candidateId: string;
  candidateName: string;
  event: InterviewEvent;
  onChoice: (choiceIndex: number) => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STAGE_ICONS: Record<string, string> = {
  casual_talk: '\u2615',      // ☕
  first_interview: '\uD83D\uDCCB',  // 📋
  second_interview: '\uD83D\uDD0D', // 🔍
  final_interview: '\uD83C\uDFAF',  // 🎯
  offer: '\uD83D\uDCB0',            // 💰
};

const ABILITY_HINT_LABELS: Record<string, string> = {
  coding: 'コーディング',
  communication: 'コミュニケーション',
  leadership: 'リーダーシップ',
  analytics: '分析力',
  creativity: '創造力',
  domainKnowledge: '業界知識',
  stamina: 'スタミナ',
  growth: '成長性',
};

// ---------------------------------------------------------------------------
// Helpers — build human-readable hint from effects
// ---------------------------------------------------------------------------

function buildEffectHints(effects: InterviewChoiceEffect): string[] {
  const hints: string[] = [];

  if (effects.interestDelta > 0) hints.push('興味度UP');
  if (effects.interestDelta < 0) hints.push('興味度DOWN');

  if (effects.revealAbility) {
    const label = ABILITY_HINT_LABELS[effects.revealAbility] ?? effects.revealAbility;
    hints.push(`${label}開示`);
  }
  if (effects.bonusRevealCount && effects.bonusRevealCount > 0) {
    hints.push(`追加${effects.bonusRevealCount}項目開示`);
  }
  if (effects.revealTrait) hints.push('特性ヒント開示');
  if (effects.revealBestFit) hints.push('適職ヒント開示');

  if (effects.salaryExpectationDelta && effects.salaryExpectationDelta < 0) {
    hints.push('年収期待↓');
  }
  if (effects.salaryExpectationDelta && effects.salaryExpectationDelta > 0) {
    hints.push('年収期待↑');
  }

  if (effects.companyReputationDelta && effects.companyReputationDelta > 0) {
    hints.push('企業評判UP');
  }
  if (effects.companyReputationDelta && effects.companyReputationDelta < 0) {
    hints.push('企業評判DOWN');
  }

  return hints;
}

function isPositiveHint(hint: string): boolean {
  return (
    hint.includes('UP') ||
    hint.includes('開示') ||
    hint.includes('年収期待↓') // lower salary expectation is good for employer
  );
}

function isNegativeHint(hint: string): boolean {
  return (
    hint.includes('DOWN') ||
    hint.includes('年収期待↑')
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 9000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
  },

  modal: {
    position: 'relative' as const,
    width: '90%',
    maxWidth: 500,
    maxHeight: '85vh',
    overflowY: 'auto' as const,
    background: '#12121a',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: '28px 24px 24px',
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
  },

  stageLabel: {
    fontSize: 14,
    fontWeight: 600 as const,
    color: '#a78bfa',
    marginBottom: 16,
    textAlign: 'center' as const,
    letterSpacing: '0.02em',
  },

  candidateName: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center' as const,
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    lineHeight: 1.7,
    color: '#c8c8d0',
    fontStyle: 'italic' as const,
    textAlign: 'center' as const,
    margin: '0 auto 24px',
    maxWidth: 420,
  },

  choiceCard: {
    width: '100%',
    textAlign: 'left' as const,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '14px 16px',
    marginBottom: 10,
    cursor: 'pointer',
    outline: 'none',
    color: '#e0e0e0',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },

  choiceCardHover: {
    borderColor: 'rgba(167,139,250,0.5)',
    boxShadow: '0 0 16px rgba(167,139,250,0.15)',
  },

  choiceLabel: {
    fontSize: 14,
    fontWeight: 600 as const,
    marginBottom: 4,
  },

  choiceDescription: {
    fontSize: 12,
    color: '#999',
    marginBottom: 6,
    lineHeight: 1.5,
  },

  hintsRow: {
    display: 'flex' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
  },

  hintBadge: {
    fontSize: 11,
    padding: '2px 8px',
    borderRadius: 4,
    fontWeight: 500 as const,
  },
} as const;

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 26, stiffness: 300 },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    transition: { duration: 0.2 },
  },
};

const choiceVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.35, ease: 'easeOut' },
  }),
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const InterviewEventModal: React.FC<Props> = ({
  candidateId: _candidateId,
  candidateName,
  event,
  onChoice,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [chosen, setChosen] = useState(false);

  const stageIcon = STAGE_ICONS[event.stage] ?? '📝';
  const stageLabel = INTERVIEW_STAGE_LABELS[event.stage] ?? event.stage;

  const handleChoice = useCallback(
    (index: number) => {
      if (chosen) return;
      setChosen(true);
      // Small delay so the user sees the press feedback before the modal closes
      setTimeout(() => onChoice(index), 180);
    },
    [chosen, onChoice],
  );

  return (
    <AnimatePresence>
      <motion.div
        style={styles.overlay}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.25 }}
      >
        {/* Overlay click guard — intentionally no close-on-click; player must choose */}
        <motion.div
          style={styles.modal}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Stage icon + label */}
          <div style={styles.stageLabel}>
            <span style={{ fontSize: 22, marginRight: 8, verticalAlign: 'middle' }}>
              {stageIcon}
            </span>
            {stageLabel}イベント
          </div>

          {/* Candidate name */}
          <div style={styles.candidateName}>{candidateName}</div>

          {/* Event description */}
          <p style={styles.description}>{event.description}</p>

          {/* Choices */}
          <div>
            {event.choices.map((choice, index) => {
              const hints = buildEffectHints(choice.effects);
              const isHovered = hoveredIndex === index;

              return (
                <motion.button
                  key={index}
                  custom={index}
                  variants={choiceVariants}
                  initial="hidden"
                  animate="visible"
                  whileTap={{ scale: 0.98 }}
                  disabled={chosen}
                  style={{
                    ...styles.choiceCard,
                    ...(isHovered ? styles.choiceCardHover : {}),
                    opacity: chosen ? 0.5 : 1,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => handleChoice(index)}
                >
                  <div style={styles.choiceLabel}>{choice.label}</div>

                  {choice.description && (
                    <div style={styles.choiceDescription}>{choice.description}</div>
                  )}

                  {hints.length > 0 && (
                    <div style={styles.hintsRow}>
                      {hints.map((hint) => (
                        <span
                          key={hint}
                          style={{
                            ...styles.hintBadge,
                            color: isNegativeHint(hint)
                              ? '#f87171'
                              : isPositiveHint(hint)
                                ? '#4ade80'
                                : '#a78bfa',
                            background: isNegativeHint(hint)
                              ? 'rgba(248,113,113,0.1)'
                              : isPositiveHint(hint)
                                ? 'rgba(74,222,128,0.1)'
                                : 'rgba(167,139,250,0.1)',
                          }}
                        >
                          → {hint}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InterviewEventModal;
