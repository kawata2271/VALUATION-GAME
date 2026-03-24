import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { achievements as achievementDefs } from '../../engine/data/achievements';

interface Props {
  achievementIds: string[];
  previousCount: number;
}

export const AchievementToast: React.FC<Props> = ({ achievementIds, previousCount }) => {
  const [visible, setVisible] = useState<string | null>(null);

  useEffect(() => {
    if (achievementIds.length > previousCount) {
      const newId = achievementIds[achievementIds.length - 1];
      setVisible(newId);
      const timer = setTimeout(() => setVisible(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [achievementIds.length]);

  const achievement = visible ? achievementDefs.find(a => a.id === visible) : null;

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -60, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -60, x: '-50%' }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed', top: 16, left: '50%',
            background: 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,215,0,0.05))',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: 10, padding: '10px 20px',
            display: 'flex', alignItems: 'center', gap: 12,
            zIndex: 300, boxShadow: '0 4px 20px rgba(255,215,0,0.2)',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ fontSize: 24 }}>{achievement.icon}</span>
          <div>
            <div style={{ fontSize: 10, color: '#ffd700', letterSpacing: 2, textTransform: 'uppercase' }}>
              Achievement Unlocked
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{achievement.title}</div>
            <div style={{ fontSize: 11, color: '#888' }}>{achievement.description}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
