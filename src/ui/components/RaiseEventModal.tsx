import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RaiseRequest } from '../../engine/types';
import { GRADE_COLORS } from '../../engine/data/employeeBalance';
import { formatSalary } from '../../utils/currency';

interface Props {
  requests: RaiseRequest[];
  onSubmit: (decisions: Record<string, 'approved' | 'negotiated' | 'rejected'>) => void;
}


export const RaiseEventModal: React.FC<Props> = ({ requests, onSubmit }) => {
  const [decisions, setDecisions] = useState<Record<string, 'approved' | 'negotiated' | 'rejected'>>({});

  const setDecision = (id: string, d: 'approved' | 'negotiated' | 'rejected') => {
    setDecisions(prev => ({ ...prev, [id]: d }));
  };

  const allDecided = requests.every(r => decisions[r.employeeId]);

  const totalIncrease = requests.reduce((sum, r) => {
    const d = decisions[r.employeeId];
    if (!d || d === 'rejected') return sum;
    if (d === 'approved') return sum + (r.requestedSalary - r.currentSalary);
    return sum + (r.requestedSalary - r.currentSalary) * 0.5;
  }, 0);

  const approveAll = () => {
    const all: Record<string, 'approved'> = {};
    requests.forEach(r => all[r.employeeId] = 'approved');
    setDecisions(all);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 160,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background: '#12121f', borderRadius: 12, padding: 24,
          maxWidth: 560, width: '92%', maxHeight: '85vh', overflow: 'auto',
          border: '1px solid rgba(255,215,0,0.2)',
          boxShadow: '0 0 40px rgba(255,215,0,0.1)',
        }}
      >
        <div style={{ fontSize: 11, color: '#ffd700', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
          Salary Review
        </div>
        <h3 style={{ margin: '0 0 6px', fontSize: 20, color: '#fff' }}>半期昇給レビュー</h3>
        <p style={{ fontSize: 12, color: '#888', margin: '0 0 16px' }}>
          社員から昇給リクエストが届いています。各社員に対して判断してください。
        </p>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button onClick={approveAll} style={{
            background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)',
            borderRadius: 6, padding: '6px 14px', fontSize: 11, color: '#00c896', cursor: 'pointer',
          }}>
            全員承認
          </button>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: '#888' }}>
            年間コスト増: <span style={{ color: totalIncrease > 0 ? '#f59e0b' : '#00c896', fontFamily: 'monospace' }}>
              +{formatSalary(totalIncrease)}/年
            </span>
          </div>
        </div>

        {/* Requests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {requests.map(r => {
            const d = decisions[r.employeeId];
            return (
              <div key={r.employeeId} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12,
                border: `1px solid ${d ? 'rgba(255,255,255,0.08)' : 'rgba(255,215,0,0.15)'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 800, padding: '1px 6px', borderRadius: 3,
                      background: `${GRADE_COLORS[r.grade]}22`, color: GRADE_COLORS[r.grade],
                    }}>{r.grade}</span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{r.employeeName}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} style={{ fontSize: 10, color: i < r.contributionScore ? '#ffd700' : '#333' }}>★</span>
                    ))}
                  </div>
                </div>

                <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>
                  {formatSalary(r.currentSalary)} → <span style={{ color: '#f59e0b' }}>{formatSalary(r.requestedSalary)}</span>
                  <span style={{ color: '#666', marginLeft: 8 }}>({r.raiseRate.toFixed(1)}%)</span>
                </div>

                <div style={{ display: 'flex', gap: 6 }}>
                  {(['approved', 'negotiated', 'rejected'] as const).map(choice => {
                    const labels = { approved: '承認', negotiated: '交渉(半額)', rejected: '却下' };
                    const colors = { approved: '#00c896', negotiated: '#f59e0b', rejected: '#ef4444' };
                    const isSelected = d === choice;
                    return (
                      <button
                        key={choice}
                        onClick={() => setDecision(r.employeeId, choice)}
                        style={{
                          flex: 1, padding: '5px 0', fontSize: 11, fontWeight: 600,
                          background: isSelected ? `${colors[choice]}22` : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isSelected ? colors[choice] : 'rgba(255,255,255,0.08)'}`,
                          borderRadius: 4, color: isSelected ? colors[choice] : '#666',
                          cursor: 'pointer',
                        }}
                      >
                        {labels[choice]}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <button
          onClick={() => allDecided && onSubmit(decisions)}
          disabled={!allDecided}
          style={{
            width: '100%', marginTop: 16, padding: '12px 0',
            background: allDecided ? '#ffd700' : '#333',
            border: 'none', borderRadius: 8,
            fontSize: 14, fontWeight: 700,
            color: allDecided ? '#000' : '#666',
            cursor: allDecided ? 'pointer' : 'not-allowed',
          }}
        >
          {allDecided ? '昇給処理を確定' : '全員の判断を選択してください'}
        </button>
      </motion.div>
    </motion.div>
  );
};
