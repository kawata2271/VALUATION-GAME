import React, { useState, lazy, Suspense } from 'react';
import { useGameStore } from '../hooks/useGame';
import { roles } from '../../engine/data/roles';
import { GRADE_COLORS } from '../../engine/data/employeeBalance';
import { EmployeeRole, Employee, EmployeeGrade } from '../../engine/types';
import { motion, AnimatePresence } from 'framer-motion';
import { formatSalary } from '../../utils/currency';

const RecruitingDashboard = lazy(() => import('./recruiting/RecruitingDashboard').then(m => ({ default: m.RecruitingDashboard })));

const roleCategories = [
  { name: 'エンジニア', prefix: 'engineer_' },
  { name: 'セールス', prefix: 'sales_' },
  { name: 'CS', prefix: 'cs_' },
  { name: 'マーケティング', prefix: 'marketing_' },
  { name: 'PM', prefix: 'pm' },
  { name: '経営層', prefix: 'c' },
];


const StatBar: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = '#3498DB' }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
    <span style={{ width: 28, fontSize: 9, color: '#888' }}>{label}</span>
    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.4 }}
        style={{ height: '100%', background: color, borderRadius: 3 }}
      />
    </div>
    <span style={{ width: 22, fontSize: 9, color: '#888', textAlign: 'right', fontFamily: 'monospace' }}>{value}</span>
  </div>
);

const GradeBadge: React.FC<{ grade: EmployeeGrade }> = ({ grade }) => (
  <span style={{
    fontSize: 11, fontWeight: 900, padding: '1px 6px', borderRadius: 3,
    background: `${GRADE_COLORS[grade]}22`, color: GRADE_COLORS[grade],
    border: `1px solid ${GRADE_COLORS[grade]}44`,
  }}>
    {grade}
  </span>
);

export const TeamPanel: React.FC = () => {
  const state = useGameStore(s => s.state)!;
  const fire = useGameStore(s => s.fire);
  const hireCandidate = useGameStore(s => s.hireCandidate);
  const getCandidates = useGameStore(s => s.getCandidates);
  const [tab, setTab] = useState<'current' | 'hire' | 'recruiting'>('current');
  const [candidates, setCandidates] = useState<Employee[]>([]);
  const [selectedRole, setSelectedRole] = useState<EmployeeRole | null>(null);
  const [detailEmp, setDetailEmp] = useState<Employee | null>(null);

  const totalSalary = state.employees.reduce((s, e) => s + (e.salaryInfo?.current ?? e.salary), 0);

  const canHire = (role: EmployeeRole): boolean => {
    if (role === 'cto') return state.employees.filter(e => e.role.startsWith('engineer_')).length >= 3;
    if (role === 'cfo') return state.fundingRounds.length >= 1;
    if (role === 'coo') return state.employees.length >= 15;
    if (role === 'vp_sales') return state.employees.filter(e => e.role.startsWith('sales_')).length >= 3;
    return true;
  };

  const showCandidates = (role: EmployeeRole) => {
    setSelectedRole(role);
    setCandidates(getCandidates(role, 3));
  };

  const doHire = (candidate: Employee) => {
    hireCandidate(candidate);
    // オファー承諾/辞退に関わらずUIをリセット
    setCandidates(prev => prev.filter(c => c.id !== candidate.id));
    if (candidates.length <= 1) {
      setCandidates([]);
      setSelectedRole(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <TabBtn active={tab === 'current'} onClick={() => setTab('current')}>
          チーム ({state.employees.length}人)
        </TabBtn>
        <TabBtn active={tab === 'hire'} onClick={() => { setTab('hire'); setCandidates([]); setSelectedRole(null); }}>
          即採用
        </TabBtn>
        <TabBtn active={tab === 'recruiting'} onClick={() => setTab('recruiting')}>
          採用プロセス
        </TabBtn>
      </div>

      {tab === 'recruiting' ? (
        <Suspense fallback={<div style={{ color: '#666', textAlign: 'center', padding: 20 }}>読み込み中...</div>}>
          <RecruitingDashboard />
        </Suspense>
      ) : tab === 'current' ? (
        <div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
            年間人件費: {formatSalary(totalSalary)} (月額: {formatSalary(totalSalary / 12)})
          </div>
          {state.employees.length === 0 ? (
            <div style={{ color: '#666', padding: 20, textAlign: 'center' }}>
              まだ誰も雇っていません。「採用する」タブから採用しましょう。
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {state.employees.map(emp => (
                <div
                  key={emp.id}
                  onClick={() => setDetailEmp(detailEmp?.id === emp.id ? null : emp)}
                  style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 12px',
                    border: `1px solid ${detailEmp?.id === emp.id ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.06)'}`,
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <GradeBadge grade={emp.grade || 'C'} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{emp.name}</span>
                      <span style={{ fontSize: 10, color: '#666' }}>{roles[emp.role].nameJa}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: '#888', fontFamily: 'monospace' }}>
                        {formatSalary(emp.salaryInfo?.current ?? emp.salary)}/年
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); fire(emp.id); }}
                        style={{
                          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                          borderRadius: 4, padding: '2px 6px', color: '#ef4444',
                          fontSize: 9, cursor: 'pointer',
                        }}
                      >
                        解雇
                      </button>
                    </div>
                  </div>
                  {emp.specialAbility && (
                    <div style={{ marginTop: 4 }}>
                      <span style={{
                        fontSize: 9, padding: '1px 5px', borderRadius: 3,
                        background: 'rgba(255,215,0,0.1)', color: '#ffd700',
                        border: '1px solid rgba(255,215,0,0.2)',
                      }}>
                        {emp.specialAbility.name}: {emp.specialAbility.description}
                      </span>
                    </div>
                  )}

                  {/* Detail view */}
                  <AnimatePresence>
                    {detailEmp?.id === emp.id && emp.stats && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: 'hidden', marginTop: 8 }}
                      >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                          <StatBar label="営業" value={emp.stats.sales} color="#ec4899" />
                          <StatBar label="技術" value={emp.stats.tech} color="#6366f1" />
                          <StatBar label="管理" value={emp.stats.management} color="#f59e0b" />
                          <StatBar label="創造" value={emp.stats.creativity} color="#00c896" />
                          <StatBar label="忠誠" value={emp.stats.loyalty} color="#3498DB" />
                        </div>
                        {emp.salaryInfo?.raiseHistory && emp.salaryInfo.raiseHistory.length > 0 && (
                          <div style={{ marginTop: 6, fontSize: 9, color: '#555' }}>
                            <span style={{ color: '#888' }}>給与履歴:</span>
                            {emp.salaryInfo.raiseHistory.slice(-3).map((h, i) => (
                              <span key={i} style={{ marginLeft: 6 }}>
                                M{h.month}: {formatSalary(h.before)}→{formatSalary(h.after)}
                                <span style={{ color: h.type === 'approved' ? '#00c896' : h.type === 'rejected' ? '#ef4444' : '#f59e0b' }}>
                                  ({h.type === 'approved' ? '承認' : h.type === 'rejected' ? '却下' : '交渉'})
                                </span>
                              </span>
                            ))}
                          </div>
                        )}
                        <div style={{ fontSize: 9, color: '#555', marginTop: 4 }}>
                          入社: Month {emp.hiredMonth} | SO: {emp.stockOptions.toFixed(2)}%
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Candidate selection modal */}
          {candidates.length > 0 && selectedRole && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>
                  {roles[selectedRole].nameJa} の候補者
                </span>
                <button onClick={() => { setCandidates([]); setSelectedRole(null); }} style={{
                  background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 11,
                }}>✕ 閉じる</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {candidates.map(c => (
                  <div key={c.id} style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12,
                    border: `1px solid ${GRADE_COLORS[c.grade]}33`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <GradeBadge grade={c.grade} />
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{c.name}</span>
                      </div>
                      <span style={{ fontSize: 12, color: '#f59e0b', fontFamily: 'monospace' }}>
                        {formatSalary(c.salary)}/年
                      </span>
                    </div>
                    {/* Stats */}
                    <div style={{ marginBottom: 6 }}>
                      <StatBar label="営業" value={c.stats.sales} color="#ec4899" />
                      <StatBar label="技術" value={c.stats.tech} color="#6366f1" />
                      <StatBar label="管理" value={c.stats.management} color="#f59e0b" />
                      <StatBar label="創造" value={c.stats.creativity} color="#00c896" />
                      <StatBar label="忠誠" value={c.stats.loyalty} color="#3498DB" />
                    </div>
                    {c.specialAbility && (
                      <div style={{ marginBottom: 8 }}>
                        <span style={{
                          fontSize: 10, padding: '2px 6px', borderRadius: 3,
                          background: 'rgba(255,215,0,0.1)', color: '#ffd700',
                        }}>
                          {c.specialAbility.name}: {c.specialAbility.description}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => doHire(c)}
                      disabled={state.cash < c.salary * 0.2}
                      style={{
                        width: '100%', padding: '6px 0',
                        background: state.cash >= c.salary * 0.2 ? GRADE_COLORS[c.grade] : '#333',
                        border: 'none', borderRadius: 4,
                        fontSize: 11, fontWeight: 700, color: '#000',
                        cursor: state.cash >= c.salary * 0.2 ? 'pointer' : 'not-allowed',
                      }}
                    >
                      採用する (採用費: {formatSalary(c.salary * 0.2)})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Role list */}
          {!selectedRole && (
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
                        return (
                          <div key={r.role} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            background: 'rgba(255,255,255,0.02)', borderRadius: 6, padding: '6px 10px',
                            opacity: available ? 1 : 0.4,
                          }}>
                            <div>
                              <span style={{ fontSize: 13 }}>{r.nameJa}</span>
                              <span style={{ fontSize: 10, color: '#666', marginLeft: 6 }}>
                                基準: {formatSalary(r.baseSalary)}/年
                              </span>
                              {r.unlockCondition && !available && (
                                <span style={{ fontSize: 9, color: '#f59e0b', marginLeft: 4 }}>要: {r.unlockCondition}</span>
                              )}
                            </div>
                            <button
                              onClick={() => available && showCandidates(r.role)}
                              disabled={!available}
                              style={{
                                background: available ? '#6366f1' : '#333',
                                border: 'none', borderRadius: 4, padding: '4px 12px',
                                fontSize: 11, fontWeight: 600, color: '#fff',
                                cursor: available ? 'pointer' : 'not-allowed',
                              }}
                            >
                              候補を見る
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
