import React, { useState } from 'react';
import { useGameStore } from '../hooks/useGame';
import { roles } from '../../engine/data/roles';
import { getKPITemplates } from '../../engine/GameEngine';
import { GRADE_COLORS } from '../../engine/data/employeeBalance';
import { Employee, Objective, MemberKPI } from '../../engine/types';

export const ObjectivesPanel: React.FC = () => {
  const state = useGameStore(s => s.state)!;
  const createObjective = useGameStore(s => s.createObjective);
  const createKeyResult = useGameStore(s => s.createKeyResult);
  const updateKR = useGameStore(s => s.updateKR);
  const createKPI = useGameStore(s => s.createKPI);
  const removeObjective = useGameStore(s => s.removeObjective);
  const removeKPI = useGameStore(s => s.removeKPI);

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showObjForm, setShowObjForm] = useState(false);
  const [showKPIForm, setShowKPIForm] = useState(false);
  const [objTitle, setObjTitle] = useState('');
  const [objDesc, setObjDesc] = useState('');
  const [objPriority, setObjPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [krTitle, setKrTitle] = useState('');
  const [krTarget, setKrTarget] = useState('');
  const [krUnit, setKrUnit] = useState('');
  const [addingKRTo, setAddingKRTo] = useState<string | null>(null);
  const [kpiName, setKpiName] = useState('');
  const [kpiTarget, setKpiTarget] = useState('');
  const [kpiUnit, setKpiUnit] = useState('');

  const qId = state.currentQuarterId;
  const currentQ = state.quarters?.find(q => q.id === qId);

  // 全メンバーの進捗サマリー
  const memberSummaries = state.employees.map(emp => {
    const objs = (state.objectives || []).filter(o => o.memberId === emp.id && o.quarterId === qId);
    const kpis = (state.memberKPIs || []).filter(k => k.memberId === emp.id && k.quarterId === qId);
    const allKRs = objs.flatMap(o => o.keyResults);
    const avgProgress = allKRs.length > 0
      ? Math.round(allKRs.reduce((s, kr) => s + kr.progress, 0) / allKRs.length)
      : -1; // -1 = 未設定
    return { emp, objs, kpis, avgProgress, objCount: objs.length, kpiCount: kpis.length };
  });

  const selectedEmp = state.employees.find(e => e.id === selectedMember);
  const selObjs = (state.objectives || []).filter(o => o.memberId === selectedMember && o.quarterId === qId);
  const selKPIs = (state.memberKPIs || []).filter(k => k.memberId === selectedMember && k.quarterId === qId);

  if (state.employees.length === 0) {
    return <div style={{ color: '#666', fontSize: 12, textAlign: 'center', padding: 20 }}>メンバーを採用すると目標管理が可能になります</div>;
  }

  return (
    <div>
      <div style={{ fontSize: 11, color: '#888', marginBottom: 12 }}>
        {currentQ ? `${currentQ.id} (Month ${currentQ.startMonth}〜${currentQ.endMonth})` : '四半期未開始'}
      </div>

      {!selectedMember ? (
        /* === 全メンバー一覧 === */
        <div>
          <h4 style={{ fontSize: 13, color: '#6366f1', margin: '0 0 10px' }}>メンバー目標進捗</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {memberSummaries.map(({ emp, avgProgress, objCount, kpiCount }) => (
              <button key={emp.id} onClick={() => setSelectedMember(emp.id)} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '8px 10px',
                border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                textAlign: 'left', color: '#e0e0e0',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 10, fontWeight: 900, padding: '1px 4px', borderRadius: 2, background: `${GRADE_COLORS[emp.grade]}22`, color: GRADE_COLORS[emp.grade] }}>{emp.grade}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{emp.name}</span>
                  <span style={{ fontSize: 9, color: '#666' }}>{roles[emp.role].nameJa}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {objCount > 0 && <span style={{ fontSize: 9, color: '#888' }}>OKR:{objCount}</span>}
                  {kpiCount > 0 && <span style={{ fontSize: 9, color: '#888' }}>KPI:{kpiCount}</span>}
                  {avgProgress >= 0 ? (
                    <ProgressPill value={avgProgress} />
                  ) : (
                    <span style={{ fontSize: 9, color: '#555' }}>未設定</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* === メンバー個別画面 === */
        <div>
          <button onClick={() => { setSelectedMember(null); setShowObjForm(false); setShowKPIForm(false); setAddingKRTo(null); }}
            style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 11, marginBottom: 10 }}>
            ← 一覧に戻る
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 900, padding: '1px 4px', borderRadius: 2, background: `${GRADE_COLORS[selectedEmp?.grade || 'C']}22`, color: GRADE_COLORS[selectedEmp?.grade || 'C'] }}>{selectedEmp?.grade}</span>
            <span style={{ fontSize: 14, fontWeight: 700 }}>{selectedEmp?.name}</span>
            <span style={{ fontSize: 10, color: '#888' }}>{roles[selectedEmp?.role || 'engineer_backend'].nameJa}</span>
          </div>

          {/* === OKR セクション === */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <h5 style={{ fontSize: 12, color: '#00c896', margin: 0 }}>OKR ({selObjs.length}/3)</h5>
              {selObjs.length < 3 && (
                <button onClick={() => setShowObjForm(true)} style={{
                  background: 'rgba(0,200,150,0.1)', border: '1px solid rgba(0,200,150,0.3)',
                  borderRadius: 4, padding: '2px 8px', fontSize: 9, color: '#00c896', cursor: 'pointer',
                }}>+ 目標追加</button>
              )}
            </div>

            {showObjForm && (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 10, marginBottom: 8, border: '1px solid rgba(0,200,150,0.15)' }}>
                <input value={objTitle} onChange={e => setObjTitle(e.target.value)} placeholder="目標タイトル" style={inputStyle} />
                <input value={objDesc} onChange={e => setObjDesc(e.target.value)} placeholder="詳細説明（任意）" style={inputStyle} />
                <select value={objPriority} onChange={e => setObjPriority(e.target.value as 'high' | 'medium' | 'low')} style={{ ...inputStyle, color: '#fff' }}>
                  <option value="high">高優先</option>
                  <option value="medium">中優先</option>
                  <option value="low">低優先</option>
                </select>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <button onClick={() => { if (objTitle.trim()) { createObjective(selectedMember, objTitle.trim(), objDesc, objPriority); setObjTitle(''); setObjDesc(''); setShowObjForm(false); } }}
                    disabled={!objTitle.trim()} style={{ ...btnStyle, background: objTitle.trim() ? '#00c896' : '#333', color: '#000' }}>作成</button>
                  <button onClick={() => setShowObjForm(false)} style={{ ...btnStyle, background: 'none', color: '#666', border: '1px solid rgba(255,255,255,0.1)' }}>取消</button>
                </div>
              </div>
            )}

            {selObjs.map(obj => {
              const avgKR = obj.keyResults.length > 0 ? Math.round(obj.keyResults.reduce((s, kr) => s + kr.progress, 0) / obj.keyResults.length) : 0;
              return (
                <div key={obj.id} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 6, padding: 8, marginBottom: 6, borderLeft: `3px solid ${obj.priority === 'high' ? '#ef4444' : obj.priority === 'medium' ? '#f59e0b' : '#888'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{obj.title}</span>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <ProgressPill value={avgKR} />
                      <button onClick={() => removeObjective(obj.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 10 }}>✕</button>
                    </div>
                  </div>
                  {obj.description && <div style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>{obj.description}</div>}

                  {/* Key Results */}
                  {obj.keyResults.map(kr => (
                    <div key={kr.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${kr.progress}%`, height: '100%', background: kr.progress >= 70 ? '#00c896' : kr.progress >= 40 ? '#f59e0b' : '#ef4444', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 9, color: '#888', minWidth: 80 }}>{kr.title}</span>
                      <input type="number" value={kr.currentValue} onChange={e => updateKR(obj.id, kr.id, parseFloat(e.target.value) || 0)}
                        style={{ width: 40, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, padding: '1px 4px', fontSize: 9, color: '#fff', textAlign: 'right' }} />
                      <span style={{ fontSize: 8, color: '#555' }}>/{kr.targetValue}{kr.unit}</span>
                    </div>
                  ))}

                  {/* Add KR */}
                  {addingKRTo === obj.id ? (
                    <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
                      <input value={krTitle} onChange={e => setKrTitle(e.target.value)} placeholder="指標名" style={{ ...inputStyle, marginBottom: 0, flex: 2 }} />
                      <input value={krTarget} onChange={e => setKrTarget(e.target.value)} placeholder="目標" type="number" style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
                      <input value={krUnit} onChange={e => setKrUnit(e.target.value)} placeholder="単位" style={{ ...inputStyle, marginBottom: 0, width: 30 }} />
                      <button onClick={() => { if (krTitle.trim() && krTarget) { createKeyResult(obj.id, krTitle.trim(), 'number', parseFloat(krTarget), krUnit); setKrTitle(''); setKrTarget(''); setKrUnit(''); setAddingKRTo(null); } }}
                        style={{ ...btnStyle, fontSize: 8, padding: '2px 6px', background: '#6366f1' }}>+</button>
                    </div>
                  ) : (
                    obj.keyResults.length < 5 && (
                      <button onClick={() => setAddingKRTo(obj.id)} style={{ fontSize: 9, color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer', marginTop: 2 }}>+ 成果指標を追加</button>
                    )
                  )}
                </div>
              );
            })}
          </div>

          {/* === KPI セクション === */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <h5 style={{ fontSize: 12, color: '#f59e0b', margin: 0 }}>KPI ({selKPIs.length}/5)</h5>
              {selKPIs.length < 5 && (
                <button onClick={() => setShowKPIForm(true)} style={{
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: 4, padding: '2px 8px', fontSize: 9, color: '#f59e0b', cursor: 'pointer',
                }}>+ KPI追加</button>
              )}
            </div>

            {showKPIForm && (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: 10, marginBottom: 8, border: '1px solid rgba(245,158,11,0.15)' }}>
                {/* テンプレート */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 6 }}>
                  {selectedEmp && getKPITemplates(selectedEmp.role).map(t => (
                    <button key={t.name} onClick={() => { setKpiName(t.name); setKpiTarget(String(t.target)); setKpiUnit(t.unit); }}
                      style={{ fontSize: 8, padding: '2px 5px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 3, color: '#f59e0b', cursor: 'pointer' }}>
                      {t.name}
                    </button>
                  ))}
                </div>
                <input value={kpiName} onChange={e => setKpiName(e.target.value)} placeholder="KPI名" style={inputStyle} />
                <div style={{ display: 'flex', gap: 4 }}>
                  <input value={kpiTarget} onChange={e => setKpiTarget(e.target.value)} placeholder="目標値" type="number" style={{ ...inputStyle, flex: 1 }} />
                  <input value={kpiUnit} onChange={e => setKpiUnit(e.target.value)} placeholder="単位" style={{ ...inputStyle, width: 50 }} />
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => { if (kpiName.trim() && kpiTarget) { createKPI(selectedMember, kpiName.trim(), parseFloat(kpiTarget), kpiUnit); setKpiName(''); setKpiTarget(''); setKpiUnit(''); setShowKPIForm(false); } }}
                    disabled={!kpiName.trim()} style={{ ...btnStyle, background: kpiName.trim() ? '#f59e0b' : '#333', color: '#000' }}>追加</button>
                  <button onClick={() => setShowKPIForm(false)} style={{ ...btnStyle, background: 'none', color: '#666', border: '1px solid rgba(255,255,255,0.1)' }}>取消</button>
                </div>
              </div>
            )}

            {selKPIs.map(kpi => {
              const progress = kpi.targetValue > 0 ? Math.min(100, Math.round((kpi.currentValue / kpi.targetValue) * 100)) : 0;
              return (
                <div key={kpi.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, padding: '4px 6px', background: 'rgba(255,255,255,0.02)', borderRadius: 4 }}>
                  <span style={{ fontSize: 10, color: '#bbb', flex: 1 }}>{kpi.kpiName}</span>
                  <div style={{ width: 50, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: progress >= 70 ? '#00c896' : progress >= 40 ? '#f59e0b' : '#ef4444', borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 9, color: '#888', fontFamily: 'monospace' }}>{kpi.currentValue.toFixed(0)}/{kpi.targetValue}{kpi.unit}</span>
                  <button onClick={() => removeKPI(kpi.id)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 9 }}>✕</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const ProgressPill: React.FC<{ value: number }> = ({ value }) => (
  <span style={{
    fontSize: 9, padding: '1px 5px', borderRadius: 3, fontFamily: 'monospace', fontWeight: 700,
    background: value >= 70 ? 'rgba(0,200,150,0.15)' : value >= 40 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
    color: value >= 70 ? '#00c896' : value >= 40 ? '#f59e0b' : '#ef4444',
  }}>
    {value}%
  </span>
);

const inputStyle: React.CSSProperties = {
  width: '100%', marginBottom: 4, padding: '4px 8px', fontSize: 11,
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 4, color: '#fff', outline: 'none',
};

const btnStyle: React.CSSProperties = {
  flex: 1, padding: '4px 0', fontSize: 10, fontWeight: 600,
  border: 'none', borderRadius: 4, cursor: 'pointer',
};
