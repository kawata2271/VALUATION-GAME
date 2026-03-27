import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AbilityRadarChart } from './AbilityRadarChart';
import {
  useRecruitingStore,
  ABILITY_LABELS,
  ABILITY_KEYS,
  INTERVIEW_STAGE_LABELS,
  INTERVIEW_STAGE_ORDER,
} from '../../../engine/recruiting';
import type {
  CandidateProfile,
  CandidateRank,
  InterviewStage,
  AbilityKey,
} from '../../../engine/recruiting';

// ─── Color Constants ───────────────────────────────────────────

const RANK_COLORS: Record<CandidateRank, string> = {
  S: '#FFD700',
  A: '#9B59B6',
  B: '#3498DB',
  C: '#27AE60',
  D: '#95A5A6',
};

const STAGE_COLORS: Record<InterviewStage, string> = {
  discovered: '#95A5A6',
  casual_talk: '#F1C40F',
  first_interview: '#E67E22',
  second_interview: '#3498DB',
  final_interview: '#9B59B6',
  offer: '#27AE60',
  offer_accepted: '#FFD700',
  offer_rejected: '#E74C3C',
  withdrawn: '#E74C3C',
};

const JOB_TYPE_LABELS: Record<string, string> = {
  engineer: 'エンジニア',
  sales: '営業',
  marketing: 'マーケティング',
  cs: 'カスタマーサクセス',
  product: 'プロダクト',
  design: 'デザイン',
  hr: '人事',
  finance: '経理・財務',
};

const INTEREST_EMOJI = [
  { min: 80, emoji: '\u{1F929}', label: '非常に前向き' },
  { min: 60, emoji: '\u{1F60A}', label: '前向き' },
  { min: 40, emoji: '\u{1F610}', label: '検討中' },
  { min: 20, emoji: '\u{1F615}', label: '消極的' },
  { min: 0, emoji: '\u{1F636}', label: 'ほぼ興味なし' },
];

// ─── Sub-Components ────────────────────────────────────────────

const RankBadge: React.FC<{ rank: CandidateRank }> = ({ rank }) => {
  const color = RANK_COLORS[rank];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 900,
        width: 26,
        height: 26,
        borderRadius: 4,
        background: `${color}18`,
        color,
        border: `1.5px solid ${color}55`,
        letterSpacing: 0,
        lineHeight: 1,
        fontFamily: 'monospace',
      }}
    >
      {rank}
    </span>
  );
};

const InterviewStageBadge: React.FC<{ stage: InterviewStage }> = ({ stage }) => {
  const color = STAGE_COLORS[stage];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        color,
        background: `${color}14`,
        border: `1px solid ${color}33`,
        borderRadius: 10,
        padding: '2px 8px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {INTERVIEW_STAGE_LABELS[stage]}
    </span>
  );
};

const StageProgressBar: React.FC<{ currentStage: InterviewStage }> = ({ currentStage }) => {
  const currentIndex = INTERVIEW_STAGE_ORDER.indexOf(currentStage);
  // For terminal stages not in the progress order
  const isTerminal = currentStage === 'offer_accepted' || currentStage === 'offer_rejected' || currentStage === 'withdrawn';

  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {INTERVIEW_STAGE_ORDER.map((stage, i) => {
        const isComplete = isTerminal || i <= currentIndex;
        const isCurrent = !isTerminal && i === currentIndex;
        const stageColor = STAGE_COLORS[stage];

        return (
          <motion.div
            key={stage}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            title={INTERVIEW_STAGE_LABELS[stage]}
            style={{
              width: isCurrent ? 18 : 10,
              height: 5,
              borderRadius: 3,
              background: isComplete ? stageColor : 'rgba(255,255,255,0.08)',
              transition: 'width 0.3s ease, background 0.3s ease',
            }}
          />
        );
      })}
    </div>
  );
};

interface AbilityBarProps {
  abilityKey: AbilityKey;
  revealed: boolean;
  estimatedValue: number;
  trueValue?: number;
  compact?: boolean;
}

const AbilityBar: React.FC<AbilityBarProps> = ({
  abilityKey,
  revealed,
  estimatedValue,
  trueValue,
  compact,
}) => {
  const label = ABILITY_LABELS[abilityKey];
  const barHeight = compact ? 5 : 7;

  // For revealed abilities, show a range based on estimation noise
  const rangeMin = revealed ? Math.max(0, estimatedValue - 8) : 0;
  const rangeMax = revealed ? Math.min(100, estimatedValue + 8) : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: compact ? 2 : 3 }}>
      <span
        style={{
          width: compact ? 50 : 62,
          fontSize: compact ? 9 : 10,
          color: revealed ? '#aaa' : '#555',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: barHeight,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: barHeight / 2,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {revealed ? (
          <>
            {/* Range background (lighter) */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rangeMax}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: `${rangeMin}%`,
                width: `${rangeMax - rangeMin}%`,
                height: '100%',
                background: 'rgba(52, 152, 219, 0.2)',
                borderRadius: barHeight / 2,
              }}
            />
            {/* Estimated value bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${estimatedValue}%` }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              style={{
                position: 'absolute',
                left: 0,
                height: '100%',
                background: estimatedValue >= 70
                  ? 'linear-gradient(90deg, #3498DB, #2ECC71)'
                  : estimatedValue >= 40
                    ? 'linear-gradient(90deg, #3498DB, #5DADE2)'
                    : 'linear-gradient(90deg, #7F8C8D, #95A5A6)',
                borderRadius: barHeight / 2,
              }}
            />
          </>
        ) : (
          /* Unrevealed: animated fog/shimmer effect */
          <motion.div
            animate={{
              background: [
                'linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 100%)',
                'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.06) 100%)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: barHeight / 2,
              filter: 'blur(1px)',
            }}
          />
        )}
      </div>
      <span
        style={{
          width: compact ? 42 : 50,
          fontSize: compact ? 9 : 10,
          fontFamily: 'monospace',
          color: revealed ? '#ccc' : '#444',
          textAlign: 'right',
          flexShrink: 0,
          filter: revealed ? 'none' : 'blur(2px)',
          userSelect: revealed ? 'auto' : 'none',
        }}
      >
        {revealed ? `${rangeMin}-${rangeMax}` : '???'}
      </span>
    </div>
  );
};

const InterestIndicator: React.FC<{ level: number }> = ({ level }) => {
  const info = INTEREST_EMOJI.find(e => level >= e.min) ?? INTEREST_EMOJI[INTEREST_EMOJI.length - 1];

  const barColor = level >= 80
    ? '#2ECC71'
    : level >= 60
      ? '#27AE60'
      : level >= 40
        ? '#F1C40F'
        : level >= 20
          ? '#E67E22'
          : '#E74C3C';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ fontSize: 16, lineHeight: 1 }}>{info.emoji}</span>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 2,
          }}
        >
          <span style={{ fontSize: 9, color: '#888' }}>{info.label}</span>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: barColor, fontWeight: 700 }}>
            {level}
          </span>
        </div>
        <div
          style={{
            height: 4,
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${level}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: barColor,
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const TurnsRemaining: React.FC<{ turns: number }> = ({ turns }) => {
  const isUrgent = turns <= 2;
  const color = isUrgent ? '#E74C3C' : turns <= 4 ? '#E67E22' : '#888';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: 10,
        color,
        fontWeight: isUrgent ? 700 : 400,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="6" r="5" stroke={color} strokeWidth="1.2" />
        <path d="M6 3v3.5l2.5 1.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span>
        {isUrgent && (
          <motion.span
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            {'! '}
          </motion.span>
        )}
        {turns}ターン
      </span>
    </div>
  );
};

// ─── Action Button ─────────────────────────────────────────────

interface ActionButtonProps {
  label: string;
  color: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

const ActionButton: React.FC<ActionButtonProps> = ({ label, color, onClick, variant = 'secondary' }) => {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        flex: isPrimary ? 2 : 1,
        padding: '7px 0',
        fontSize: 11,
        fontWeight: isPrimary ? 700 : 500,
        color: isPrimary ? '#0a0a0f' : isDanger ? '#E74C3C' : color,
        background: isPrimary ? color : 'transparent',
        border: `1px solid ${isPrimary ? color : isDanger ? '#E74C3C33' : `${color}44`}`,
        borderRadius: 6,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        fontFamily: 'inherit',
      }}
    >
      {label}
    </motion.button>
  );
};

// ─── Main Component ────────────────────────────────────────────

interface Props {
  candidate: CandidateProfile;
  onAdvance: (id: string) => void;
  onHold: (id: string) => void;
  onReject: (id: string) => void;
  compact?: boolean;
}

export const CandidateCard: React.FC<Props> = ({
  candidate,
  onAdvance,
  onHold,
  onReject,
  compact = false,
}) => {
  const {
    id,
    name,
    rank,
    currentJobType,
    interviewStage,
    revealedAbility,
    estimatedAbility,
    interestLevel,
    availableTurns,
    isExclusive,
    traitHintRevealed,
    specialTrait,
  } = candidate;

  const rankColor = RANK_COLORS[rank];
  const isTerminal = interviewStage === 'offer_accepted' || interviewStage === 'offer_rejected' || interviewStage === 'withdrawn';

  const [showRadar, setShowRadar] = useState(false);

  const revealedKeys = useMemo(
    () => new Set(Object.keys(revealedAbility) as AbilityKey[]),
    [revealedAbility],
  );

  const abilityEntries = compact
    ? ABILITY_KEYS.filter(k => revealedKeys.has(k)).slice(0, 4)
    : ABILITY_KEYS;

  // レーダーチャート用データ
  const radarAbilities = useMemo(() => {
    const result: Partial<Record<AbilityKey, { value: number; isEstimate: boolean; range?: [number, number] }>> = {};
    for (const key of ABILITY_KEYS) {
      if (revealedKeys.has(key)) {
        const val = revealedAbility[key] ?? estimatedAbility[key];
        result[key] = { value: val, isEstimate: true, range: [Math.max(0, val - 15), Math.min(100, val + 15)] };
      }
    }
    return result;
  }, [revealedAbility, estimatedAbility, revealedKeys]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.96 }}
      transition={{ duration: 0.3 }}
      style={{
        width: compact ? 280 : 340,
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 12,
        padding: compact ? 14 : 18,
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 10 : 14,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Rank glow accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${rankColor}66, transparent)`,
        }}
      />

      {/* ── Header: Name + Rank + Job ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <RankBadge rank={rank} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginBottom: 3,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#e0e0e0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {name}
            </span>
            {isExclusive && (
              <span
                style={{
                  fontSize: 9,
                  color: '#E74C3C',
                  background: '#E74C3C18',
                  border: '1px solid #E74C3C33',
                  borderRadius: 3,
                  padding: '0px 4px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                競合中
              </span>
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: 11, color: '#888' }}>
              {JOB_TYPE_LABELS[currentJobType] ?? currentJobType}
            </span>
            <InterviewStageBadge stage={interviewStage} />
          </div>
        </div>
        <TurnsRemaining turns={availableTurns} />
      </div>

      {/* ── Stage Progress ── */}
      {!compact && <StageProgressBar currentStage={interviewStage} />}

      {/* ── Ability Bars / Radar ── */}
      <div>
        <div
          style={{
            fontSize: 9,
            color: '#666',
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>
            {compact ? '' : '能力値'}
            {!compact && (
              <span style={{ marginLeft: 6, color: '#555', fontWeight: 400, letterSpacing: 0, textTransform: 'none' }}>
                ({revealedKeys.size}/{ABILITY_KEYS.length} 開示済)
              </span>
            )}
          </span>
          {!compact && revealedKeys.size >= 2 && (
            <button
              onClick={() => setShowRadar(!showRadar)}
              style={{
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.2)',
                borderRadius: 3,
                padding: '1px 6px',
                fontSize: 9,
                color: '#6366f1',
                cursor: 'pointer',
                textTransform: 'none',
                letterSpacing: 0,
              }}
            >
              {showRadar ? 'バー表示' : 'レーダー'}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {showRadar && !compact ? (
            <motion.div
              key="radar"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
            >
              <AbilityRadarChart abilities={radarAbilities} size={200} />
            </motion.div>
          ) : (
            <motion.div
              key="bars"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {abilityEntries.map(key => (
                <AbilityBar
                  key={key}
                  abilityKey={key}
                  revealed={revealedKeys.has(key)}
                  estimatedValue={estimatedAbility[key]}
                  compact={compact}
                />
              ))}
              {compact && revealedKeys.size < ABILITY_KEYS.length && (
                <div style={{ fontSize: 9, color: '#555', marginTop: 2 }}>
                  +{ABILITY_KEYS.length - abilityEntries.length} 未開示
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Trait Hint ── */}
      {traitHintRevealed && specialTrait && !compact && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{
            fontSize: 10,
            color: '#C39BD3',
            background: 'rgba(155, 89, 182, 0.08)',
            border: '1px solid rgba(155, 89, 182, 0.2)',
            borderRadius: 6,
            padding: '6px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ fontSize: 13 }}>{'\u2728'}</span>
          <span>特殊属性の気配を感じる...</span>
        </motion.div>
      )}

      {/* ── Interest Level ── */}
      <InterestIndicator level={interestLevel} />

      {/* ── Action Buttons ── */}
      {!isTerminal && (
        <div style={{ display: 'flex', gap: 6, marginTop: compact ? 0 : 2 }}>
          <ActionButton
            label="次の面接へ進む"
            color="#3498DB"
            variant="primary"
            onClick={() => onAdvance(id)}
          />
          <ActionButton
            label="保留"
            color="#888"
            variant="secondary"
            onClick={() => onHold(id)}
          />
          <ActionButton
            label="見送り"
            color="#E74C3C"
            variant="danger"
            onClick={() => onReject(id)}
          />
        </div>
      )}

      {/* Terminal state overlay label */}
      {isTerminal && (
        <div
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 700,
            color: STAGE_COLORS[interviewStage],
            padding: '6px 0',
            background: `${STAGE_COLORS[interviewStage]}10`,
            borderRadius: 6,
            border: `1px solid ${STAGE_COLORS[interviewStage]}22`,
          }}
        >
          {INTERVIEW_STAGE_LABELS[interviewStage]}
        </div>
      )}
    </motion.div>
  );
};

export default CandidateCard;
