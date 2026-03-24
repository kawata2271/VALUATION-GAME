import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../../engine/types';
import { Sound } from '../hooks/useSound';

interface Milestone {
  id: string;
  icon: string;
  text: string;
  color: string;
}

const milestoneChecks: ((s: GameState) => Milestone | null)[] = [
  s => s.customers === 1 ? { id: 'cust_1', icon: '🎉', text: '最初の顧客を獲得！', color: '#00c896' } : null,
  s => s.customers === 10 ? { id: 'cust_10', icon: '📈', text: '顧客10社突破！', color: '#00c896' } : null,
  s => s.customers === 50 ? { id: 'cust_50', icon: '🚀', text: '顧客50社突破！', color: '#6366f1' } : null,
  s => s.customers === 100 ? { id: 'cust_100', icon: '💯', text: '顧客100社突破！', color: '#6366f1' } : null,
  s => s.customers === 500 ? { id: 'cust_500', icon: '🏆', text: '顧客500社突破！', color: '#ffd700' } : null,
  s => s.customers === 1000 ? { id: 'cust_1k', icon: '👑', text: '顧客1,000社突破！', color: '#ffd700' } : null,
  s => {
    const prev = s.history.length >= 2 ? s.history[s.history.length - 2].mrr : 0;
    if (prev < 10000 && s.mrr >= 10000) return { id: 'mrr_10k', icon: '💰', text: 'MRR $10K達成！', color: '#00c896' };
    return null;
  },
  s => {
    const prev = s.history.length >= 2 ? s.history[s.history.length - 2].mrr : 0;
    if (prev < 50000 && s.mrr >= 50000) return { id: 'mrr_50k', icon: '📊', text: 'MRR $50K達成！', color: '#6366f1' };
    return null;
  },
  s => {
    const prev = s.history.length >= 2 ? s.history[s.history.length - 2].mrr : 0;
    if (prev < 100000 && s.mrr >= 100000) return { id: 'mrr_100k', icon: '🎯', text: 'MRR $100K達成！', color: '#ec4899' };
    return null;
  },
  s => {
    const prev = s.history.length >= 2 ? s.history[s.history.length - 2].mrr * 12 : 0;
    if (prev < 1000000 && s.mrr * 12 >= 1000000) return { id: 'arr_1m', icon: '🏅', text: 'ARR $1M達成！', color: '#ffd700' };
    return null;
  },
  s => {
    const prev = s.history.length >= 2 ? s.history[s.history.length - 2].mrr * 12 : 0;
    if (prev < 10000000 && s.mrr * 12 >= 10000000) return { id: 'arr_10m', icon: '🦄', text: 'ARR $10M達成！IPO可能！', color: '#ffd700' };
    return null;
  },
  s => s.employees.length === 10 ? { id: 'team_10', icon: '👥', text: 'チーム10人に成長！', color: '#6366f1' } : null,
  s => s.employees.length === 50 ? { id: 'team_50', icon: '🏛️', text: 'チーム50人！大企業の仲間入り', color: '#ec4899' } : null,
  s => {
    if (!s.pmfAchieved) return null;
    const prev = s.history.length >= 2 ? s.history[s.history.length - 2] : null;
    // PMF just achieved this turn
    if (prev && s.pmfAchieved && s.eventLog.some(l => l.month === s.month && l.title === 'PMF達成！'))
      return { id: 'pmf', icon: '🎯', text: 'Product-Market Fit達成！', color: '#00c896' };
    return null;
  },
  s => {
    if (s.profitableMonth && s.mrr > s.burn) {
      const prev = s.history.length >= 2 ? s.history[s.history.length - 2] : null;
      if (prev && prev.mrr <= prev.burn)
        return { id: 'profitable', icon: '📗', text: '初の月次黒字化！', color: '#00c896' };
    }
    return null;
  },
];

interface Props {
  state: GameState;
}

export const MilestoneToast: React.FC<Props> = ({ state }) => {
  const [visible, setVisible] = useState<Milestone | null>(null);
  const shownRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    for (const check of milestoneChecks) {
      const m = check(state);
      if (m && !shownRef.current.has(m.id)) {
        shownRef.current.add(m.id);
        setVisible(m);
        Sound.achievement();
        const timer = setTimeout(() => setVisible(null), 3500);
        return () => clearTimeout(timer);
      }
    }
  }, [state.month, state.customers, state.mrr, state.employees.length]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed', bottom: 80, right: 16,
            background: `linear-gradient(135deg, ${visible.color}22, ${visible.color}08)`,
            border: `1px solid ${visible.color}44`,
            borderRadius: 10, padding: '12px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
            zIndex: 250, boxShadow: `0 4px 20px ${visible.color}33`,
          }}
        >
          <span style={{ fontSize: 28 }}>{visible.icon}</span>
          <div>
            <div style={{ fontSize: 9, color: visible.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>
              MILESTONE
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{visible.text}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
