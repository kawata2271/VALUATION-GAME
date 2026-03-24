import React, { useState } from 'react';
import { useGameStore } from '../hooks/useGame';
import { roles } from '../../engine/data/roles';
import { EmployeeRole } from '../../engine/types';

const roleCategories = [
  { name: 'エンジニア', prefix: 'engineer_' },
  { name: 'セールス', prefix: 'sales_' },
  { name: 'CS', prefix: 'cs_' },
  { name: 'マーケティング', prefix: 'marketing_' },
  { name: 'PM', prefix: 'pm' },
  { name: '経営層', prefix: 'c' },
];

const traitLabels: Record<string, { label: string; color: string }> = {
  '10x_engineer': { label: '10x', color: '#ffd700' },
  closer: { label: 'クローザー', color: '#00c896' },
  mood_maker: { label: 'ムード', color: '#00c896' },
  mentor: { label: 'メンター', color: '#00c896' },
  problem_solver: { label: '問題解決', color: '#00c896' },
  toxic_genius: { label: '有害', color: '#ef4444' },
  job_hopper: { label: '転職リスク', color: '#f59e0b' },
  underperformer: { label: '低パフォ', color: '#ef4444' },
  politician: { label: '政治家', color: '#f59e0b' },
  burnout_risk: { label: '燃え尽き', color: '#f59e0b' },
};

export const TeamPanel: React.FC = () => {
  const state = useGameStore(s => s.state)!;
  const hire = useGameStore(s => s.hire);
  const fire = useGameStore(s => s.fire);
  const [tab, setTab] = useState<'current' | 'hire'>('current');

  const totalSalary = state.employees.reduce((s, e) => s + e.salary, 0);

  const canHire = (role: EmployeeRole): boolean => {
    const r = roles[role];
    const hiringCost = r.baseSalary * 0.2;
    if (state.cash < hiringCost) return false;
    if (role === 'cto') return state.employees.filter(e => e.role.startsWith('engineer_')).length >= 3;
    if (role === 'cfo') return state.fundingRounds.length >= 1;
    if (role === 'coo') return state.employees.length >= 15;
    if (role === 'vp_sales') return state.employees.filter(e => e.role.startsWith('sales_')).length >= 3;
    return true;
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <TabBtn active={tab === 'current'} onClick={() => setTab('current')}>
          現在のチーム ({state.employees.length}人)
        </TabBtn>
        <TabBtn active={tab === 'hire'} onClick={() => setTab('hire')}>採用する</TabBtn>
      </div>

      {tab === 'current' ? (
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
            年間人件費: ${totalSalary.toLocaleString()} (月額: ${Math.floor(totalSalary / 12).toLocaleString()})
          </div>
          {state.employees.length === 0 ? (
            <div style={{ color: '#666', padding: 20, textAlign: 'center' }}>
              まだ誰も雇っていません。「採用する」タブから採用しましょう。
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {state.employees.map(emp => (
                <div key={emp.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 12px',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{emp.name}</span>
                    <span style={{ fontSize: 11, color: '#888', marginLeft: 8 }}>{roles[emp.role].nameJa}</span>
                    {emp.trait && (
                      <span style={{
                        fontSize: 10, marginLeft: 8, padding: '1px 5px',
                        borderRadius: 3, background: `${traitLabels[emp.trait]?.color}22`,
                        color: traitLabels[emp.trait]?.color,
                      }}>
                        {traitLabels[emp.trait]?.label}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11, color: '#666' }}>${(emp.salary / 1000).toFixed(0)}K/年</span>
                    <button
                      onClick={() => fire(emp.id)}
                      style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 4, padding: '3px 8px', color: '#ef4444',
                        fontSize: 10, cursor: 'pointer',
                      }}
                    >
                      解雇
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {roleCategories.map(cat => {
            const catRoles = Object.values(roles).filter(r => {
              if (cat.prefix === 'c') return ['cto', 'cfo', 'coo', 'vp_sales'].includes(r.role);
              if (cat.prefix === 'pm') return r.role === 'pm';
              return r.role.startsWith(cat.prefix);
            });
            return (
              <div key={cat.name}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', marginBottom: 6 }}>{cat.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {catRoles.map(r => {
                    const available = canHire(r.role);
                    const hiringCost = r.baseSalary * 0.2;
                    return (
                      <div key={r.role} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        background: 'rgba(255,255,255,0.02)', borderRadius: 6, padding: '6px 10px',
                        opacity: available ? 1 : 0.4,
                      }}>
                        <div>
                          <span style={{ fontSize: 13 }}>{r.nameJa}</span>
                          <span style={{ fontSize: 11, color: '#666', marginLeft: 8 }}>${(r.baseSalary / 1000).toFixed(0)}K/年</span>
                          {r.unlockCondition && !available && (
                            <span style={{ fontSize: 10, color: '#f59e0b', marginLeft: 6 }}>要: {r.unlockCondition}</span>
                          )}
                        </div>
                        <button
                          onClick={() => available && hire(r.role)}
                          disabled={!available}
                          style={{
                            background: available ? '#00c896' : '#333',
                            border: 'none', borderRadius: 4, padding: '4px 12px',
                            fontSize: 11, fontWeight: 600, color: '#000', cursor: available ? 'pointer' : 'not-allowed',
                          }}
                        >
                          採用 (${(hiringCost / 1000).toFixed(0)}K)
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const TabBtn: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button onClick={onClick} style={{
    background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
    border: `1px solid ${active ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 6, padding: '6px 14px', fontSize: 12,
    color: active ? '#6366f1' : '#888', cursor: 'pointer',
  }}>
    {children}
  </button>
);
