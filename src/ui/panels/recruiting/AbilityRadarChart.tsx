// ===== 能力レーダーチャート（マスキング対応）=====
// 開示済み能力のみ描画し、未開示は霧がかかった状態で表示

import React, { useMemo } from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import type { AbilityKey } from '../../../engine/recruiting';
import { ABILITY_LABELS } from '../../../engine/recruiting';

interface AbilityDisplay {
  value: number;
  isEstimate: boolean;
  range?: [number, number];
}

interface Props {
  abilities: Partial<Record<AbilityKey, AbilityDisplay>>;
  size?: number;
  showLabels?: boolean;
  animate?: boolean;
}

const ALL_KEYS: AbilityKey[] = [
  'coding', 'communication', 'leadership', 'analytics',
  'creativity', 'domainKnowledge', 'stamina', 'growth',
];

const SHORT_LABELS: Record<AbilityKey, string> = {
  coding: 'Code',
  communication: 'Comm',
  leadership: 'Lead',
  analytics: 'Anly',
  creativity: 'Crea',
  domainKnowledge: 'Dom',
  stamina: 'Stam',
  growth: 'Grow',
};

// Custom tooltip
const ChartTooltip: React.FC<any> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;
  const key = data.key as AbilityKey;
  const fullLabel = ABILITY_LABELS[key] ?? key;

  if (!data.revealed) {
    return (
      <div style={{
        background: 'rgba(20,20,30,0.95)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6, padding: '6px 10px', fontSize: 11,
      }}>
        <span style={{ color: '#666' }}>{fullLabel}: ???（未開示）</span>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(20,20,30,0.95)', border: '1px solid rgba(99,102,241,0.3)',
      borderRadius: 6, padding: '6px 10px', fontSize: 11,
    }}>
      <div style={{ color: '#e0e0e0', fontWeight: 600, marginBottom: 2 }}>{fullLabel}</div>
      {data.isEstimate ? (
        <span style={{ color: '#f59e0b' }}>推定: {data.range?.[0]}〜{data.range?.[1]}</span>
      ) : (
        <span style={{ color: '#4ade80' }}>確定: {data.value}</span>
      )}
    </div>
  );
};

export const AbilityRadarChart: React.FC<Props> = ({
  abilities,
  size = 220,
  showLabels = true,
  animate = true,
}) => {
  const chartData = useMemo(() => {
    return ALL_KEYS.map(key => {
      const ability = abilities[key];
      const revealed = !!ability;
      return {
        key,
        label: SHORT_LABELS[key],
        fullLabel: ABILITY_LABELS[key],
        value: revealed ? ability!.value : 0,
        displayValue: revealed ? ability!.value : 15, // 未開示は薄く表示
        revealed,
        isEstimate: ability?.isEstimate ?? false,
        range: ability?.range,
      };
    });
  }, [abilities]);

  const revealedCount = chartData.filter(d => d.revealed).length;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid
            stroke="rgba(255,255,255,0.08)"
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="label"
            tick={showLabels ? {
              fill: '#888',
              fontSize: 9,
              fontFamily: 'monospace',
            } : false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />

          {/* 未開示領域（霧） */}
          <Radar
            name="unknown"
            dataKey="displayValue"
            stroke="rgba(255,255,255,0.05)"
            fill="rgba(255,255,255,0.02)"
            fillOpacity={0.5}
            isAnimationActive={false}
          />

          {/* 開示済み領域 */}
          <Radar
            name="revealed"
            dataKey="value"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{
              r: 3,
              fill: '#6366f1',
              stroke: '#6366f1',
              strokeWidth: 1,
            }}
            isAnimationActive={animate}
            animationDuration={800}
            animationEasing="ease-out"
          />

          <Tooltip content={<ChartTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      {/* 未開示の霧エフェクト */}
      {revealedCount < ALL_KEYS.length && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'pulse 3s ease-in-out infinite',
        }} />
      )}

      {/* 開示カウンター */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 9,
        color: '#666',
        whiteSpace: 'nowrap',
      }}>
        {revealedCount}/{ALL_KEYS.length} 開示済み
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// ===== 能力開示リビールアニメーション =====

interface RevealAnimationProps {
  abilityKey: AbilityKey;
  value: number;
  isEstimate: boolean;
  range?: [number, number];
  onComplete?: () => void;
}

export const AbilityRevealAnimation: React.FC<RevealAnimationProps> = ({
  abilityKey, value, isEstimate, range, onComplete,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onAnimationComplete={onComplete}
        style={{
          position: 'fixed',
          top: '40%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(15,15,25,0.95)',
          border: '1px solid rgba(99,102,241,0.4)',
          borderRadius: 12,
          padding: '16px 24px',
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(99,102,241,0.2)',
        }}
      >
        {/* 霧が晴れるエフェクト */}
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 12,
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
            filter: 'blur(10px)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          style={{ fontSize: 10, color: '#6366f1', fontWeight: 600, marginBottom: 4 }}
        >
          能力判明
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          style={{ fontSize: 14, fontWeight: 700, color: '#e0e0e0', marginBottom: 4 }}
        >
          {ABILITY_LABELS[abilityKey]}
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          style={{
            height: 6,
            background: isEstimate
              ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
              : 'linear-gradient(90deg, #4ade80, #22c55e)',
            borderRadius: 3,
            marginBottom: 6,
            maxWidth: 150,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
          style={{
            fontSize: 16,
            fontWeight: 900,
            fontFamily: 'monospace',
            color: isEstimate ? '#f59e0b' : '#4ade80',
          }}
        >
          {isEstimate && range ? `${range[0]}〜${range[1]}` : value}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AbilityRadarChart;
