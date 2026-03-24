import React, { useState } from 'react';
import { useGameStore } from '../hooks/useGame';
import { getSaveSlots } from '../hooks/useSave';
import { Sound } from '../hooks/useSound';
import { verticals } from '../../engine/data/verticals';
import { founders } from '../../engine/data/founders';
import { techStacks } from '../../engine/data/techstacks';
import { KPICard } from '../components/KPICard';
import { ProgressBar } from '../components/ProgressBar';
import { MiniChart } from '../components/MiniChart';
import { EventModal } from '../components/EventModal';
import { TeamPanel } from '../panels/TeamPanel';
import { ProductPanel } from '../panels/ProductPanel';
import { FundingPanel } from '../panels/FundingPanel';
import { ExitPanel } from '../panels/ExitPanel';
import { LogPanel } from '../panels/LogPanel';
import { AnalyticsPanel } from '../panels/AnalyticsPanel';
import { SalesPanel } from '../panels/SalesPanel';
import { StrategyPanel } from '../panels/StrategyPanel';
import { Tutorial } from '../components/Tutorial';
import { BoardMeeting } from '../components/BoardMeeting';
import { AchievementToast } from '../components/AchievementToast';
import { Advisor } from '../components/Advisor';
import { RaiseEventModal } from '../components/RaiseEventModal';
import { MilestoneToast } from '../components/MilestoneToast';
import { NewsTicker } from '../components/NewsTicker';
import { QuarterlySummary } from '../components/QuarterlySummary';
import { getLang, setLang, t } from '../../engine/data/i18n';
import { formatCurrency } from '../../utils/currency';

const phaseNames = ['アイデア期', 'PMF探索期', 'グロース期', 'スケール期', 'エグジット期'];

const panelTitles: Record<string, string> = {
  team: 'チーム管理',
  product: 'プロダクト開発',
  funding: '資金調達',
  sales: '営業・プライシング',
  strategy: '戦略・情報',
  exit: 'EXIT戦略',
  log: 'イベントログ',
  analytics: '分析',
  save: 'セーブ',
};

export const GameScreen: React.FC = () => {
  const state = useGameStore(s => s.state)!;
  const panel = useGameStore(s => s.panel);
  const togglePanel = useGameStore(s => s.togglePanel);
  const nextTurn = useGameStore(s => s.nextTurn);
  const handleChoice = useGameStore(s => s.handleEventChoice);
  const handleDismiss = useGameStore(s => s.handleEventDismiss);
  const submitRaises = useGameStore(s => s.submitRaises);
  const saveGame = useGameStore(s => s.saveGame);
  const [saveMsg, setSaveMsg] = useState('');
  const [soundOn, setSoundOn] = useState(Sound.isEnabled());
  const [prevAchCount, setPrevAchCount] = useState(state.achievements?.length || 0);

  // Track achievement count changes
  React.useEffect(() => {
    if ((state.achievements?.length || 0) > prevAchCount) {
      setTimeout(() => setPrevAchCount(state.achievements?.length || 0), 3500);
    }
  }, [state.achievements?.length]);
  const [showTutorial, setShowTutorial] = useState(() => {
    return state.month === 0 && !localStorage.getItem('valuation_game_tutorial_done');
  });

  const [autoSpeed, setAutoSpeed] = useState(0);
  const [showQuarterly, setShowQuarterly] = useState(false);
  const prevMonthRef = React.useRef(state.month);
  const autoRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const v = verticals[state.vertical];
  const f = founders[state.founderType];
  const runway = state.burn > 0 ? Math.floor(state.cash / state.burn) : 999;
  const year = Math.floor(state.month / 12) + 1;
  const monthInYear = (state.month % 12) + 1;
  const arr = state.mrr * 12;

  const latestLog = state.eventLog.length > 0 ? state.eventLog[state.eventLog.length - 1] : null;

  // Deltas from previous month
  const prev = state.history.length >= 2 ? state.history[state.history.length - 2] : null;
  const mrrDelta = prev ? state.mrr - prev.mrr : 0;
  const custDelta = prev ? state.customers - prev.customers : 0;
  const cashDelta = prev ? state.cash - prev.cash : 0;

  // Quarterly summary trigger (every 3 months, after month 3)
  React.useEffect(() => {
    if (state.month > 3 && state.month !== prevMonthRef.current && state.month % 3 === 0
        && !state.pendingEvent && !state.boardMeetingDue) {
      setShowQuarterly(true);
    }
    prevMonthRef.current = state.month;
  }, [state.month]);

  // Auto-advance
  React.useEffect(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    if (autoSpeed > 0 && !state.pendingEvent && !state.boardMeetingDue && !state.gameOver) {
      const ms = autoSpeed === 1 ? 1500 : 500;
      autoRef.current = setInterval(() => {
        const s = useGameStore.getState().state;
        if (s && !s.pendingEvent && !s.boardMeetingDue && !s.gameOver) {
          nextTurn();
        } else {
          setAutoSpeed(0);
        }
      }, ms);
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [autoSpeed, state.pendingEvent, state.boardMeetingDue]);

  // Stop auto when event, board meeting, quarterly, raises, or game over
  React.useEffect(() => {
    if (state.pendingEvent || state.boardMeetingDue || state.gameOver || showQuarterly || state.pendingRaises) {
      setAutoSpeed(0);
    }
  }, [state.pendingEvent, state.boardMeetingDue, state.gameOver, showQuarterly, state.pendingRaises]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (!state.pendingEvent && !state.boardMeetingDue) nextTurn();
          break;
        case '1': togglePanel('team'); break;
        case '2': togglePanel('product'); break;
        case '3': togglePanel('funding'); break;
        case '4': togglePanel('sales'); break;
        case '5': togglePanel('strategy'); break;
        case '6': togglePanel('analytics'); break;
        case 'Escape': togglePanel(panel); break;
        case 'f':
          setAutoSpeed(s => s === 0 ? 1 : s === 1 ? 2 : 0);
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [state.pendingEvent, state.boardMeetingDue, panel]);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0f', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{state.companyName}</span>
          <span style={{ fontSize: 12, color: '#6366f1' }}>{v.nameJa}</span>
          <span style={{ fontSize: 12, color: '#888' }}>{f.emoji} {f.nameJa}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 12, color: '#888' }}>Year {year} / Month {monthInYear}</span>
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 4,
            background: 'rgba(99,102,241,0.15)', color: '#6366f1',
          }}>
            {phaseNames[state.phase]}
          </span>
          <span style={{
            fontSize: 11, padding: '2px 8px', borderRadius: 4,
            background: runway < 3 ? 'rgba(239,68,68,0.2)' : runway < 6 ? 'rgba(245,158,11,0.15)' : 'rgba(0,200,150,0.1)',
            color: runway < 3 ? '#ef4444' : runway < 6 ? '#f59e0b' : '#00c896',
          }}>
            RUNWAY: {runway > 100 ? '100+' : runway}ヶ月
          </span>
          <button
            onClick={() => setSoundOn(Sound.toggle())}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4, padding: '2px 8px', cursor: 'pointer',
              fontSize: 14, color: '#666',
            }}
            title={soundOn ? 'サウンドOFF' : 'サウンドON'}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button
            onClick={() => { setLang(getLang() === 'ja' ? 'en' : 'ja'); window.location.reload(); }}
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4, padding: '2px 8px', cursor: 'pointer',
              fontSize: 11, color: '#666',
            }}
            title="Language"
          >
            {getLang() === 'ja' ? 'EN' : 'JA'}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140, 1fr))', gap: 10, marginBottom: 16 }}>
            <KPICard label="MRR" value={formatCurrency(state.mrr)} sub={`ARR ${formatCurrency(arr)}`} color="#00c896" delta={mrrDelta} deltaFmt={formatCurrency(mrrDelta)} />
            <KPICard label="顧客数" value={`${state.customers}社`} sub={`Churn ${state.churnRate.toFixed(1)}%`} color="#6366f1" delta={custDelta} deltaFmt={`${custDelta}`} />
            <KPICard
              label="キャッシュ"
              value={formatCurrency(state.cash)}
              sub={`Net ${state.mrr - state.burn >= 0 ? '+' : ''}${formatCurrency(state.mrr - state.burn)}/月`}
              color={state.cash < state.burn * 3 ? '#ef4444' : '#00c896'}
              warn={state.cash < state.burn * 3}
              delta={cashDelta}
              deltaFmt={formatCurrency(cashDelta)}
            />
          </div>

          {/* Sub KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
            <ProgressBar label="NPS" value={state.nps} color={state.nps > 60 ? '#00c896' : state.nps > 40 ? '#f59e0b' : '#ef4444'} />
            <ProgressBar label="チーム士気" value={state.morale} color={state.morale > 60 ? '#00c896' : state.morale > 40 ? '#f59e0b' : '#ef4444'} />
            <ProgressBar label="技術負債" value={state.techDebt} color={state.techDebt > 60 ? '#ef4444' : state.techDebt > 40 ? '#f59e0b' : '#00c896'} />
            <ProgressBar label="ブランド認知" value={state.brand} color="#6366f1" />
          </div>

          {/* Mini Chart */}
          {state.history.length > 1 && (
            <div style={{
              background: 'rgba(255,255,255,0.02)', borderRadius: 8, padding: '8px 12px',
              marginBottom: 16, border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ fontSize: 11, color: '#555', marginBottom: 4 }}>MRR推移</div>
              <MiniChart data={state.history} dataKey="mrr" color="#00c896" height={50} />
            </div>
          )}

          {/* Detail KPIs */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100, 1fr))',
            gap: 8, marginBottom: 16,
          }}>
            <MiniKPI label="CAC" value={formatCurrency(state.cac)} />
            <MiniKPI label="ARPU" value={formatCurrency(state.arpu)} />
            <MiniKPI label="LTV/CAC" value={state.cac > 0 ? ((state.arpu / (state.churnRate / 100)) / state.cac).toFixed(1) : '-'} />
            <MiniKPI label="NDR" value={`${state.ndr.toFixed(0)}%`} />
            <MiniKPI label="評価額" value={formatCurrency(state.valuation)} color="#ffd700" />
            <MiniKPI label="持分" value={`${state.founderEquity.toFixed(0)}%`} color="#ec4899" />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(65px, 1fr))',
            gap: 8, marginBottom: 16,
          }}>
            <ActionBtn emoji="👥" label="チーム" active={panel === 'team'} onClick={() => togglePanel('team')} />
            <ActionBtn emoji="🔧" label="開発" active={panel === 'product'} onClick={() => togglePanel('product')} />
            <ActionBtn emoji="💰" label="調達" active={panel === 'funding'} onClick={() => togglePanel('funding')} />
            <ActionBtn emoji="📣" label="営業" active={panel === 'sales'} onClick={() => togglePanel('sales')} />
            <ActionBtn emoji="🎯" label="戦略" active={panel === 'strategy'} onClick={() => togglePanel('strategy')} />
            <ActionBtn emoji="📊" label="分析" active={panel === 'analytics'} onClick={() => togglePanel('analytics')} />
            <ActionBtn emoji="🚪" label="EXIT" active={panel === 'exit'} onClick={() => togglePanel('exit')} />
            <ActionBtn emoji="📜" label="ログ" active={panel === 'log'} onClick={() => togglePanel('log')} />
            <ActionBtn emoji="💾" label="セーブ" active={panel === 'save'} onClick={() => togglePanel('save')} />
          </div>

          {/* Next Turn + Auto Advance */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button
              onClick={nextTurn}
              disabled={!!state.pendingEvent || !!state.boardMeetingDue}
              style={{
                flex: 1, padding: '14px 0',
                background: (state.pendingEvent || state.boardMeetingDue) ? '#333' : 'linear-gradient(135deg, #00c896, #00a87a)',
                border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 700,
                color: (state.pendingEvent || state.boardMeetingDue) ? '#666' : '#000',
                cursor: (state.pendingEvent || state.boardMeetingDue) ? 'not-allowed' : 'pointer',
                letterSpacing: 2,
                boxShadow: (state.pendingEvent || state.boardMeetingDue) ? 'none' : '0 0 15px rgba(0,200,150,0.2)',
              }}
            >
              ▶ {t('game.nextmonth')}
            </button>
            <button
              onClick={() => setAutoSpeed(s => s === 0 ? 1 : s === 1 ? 2 : 0)}
              style={{
                padding: '14px 16px',
                background: autoSpeed > 0 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${autoSpeed > 0 ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: 8, cursor: 'pointer',
                color: autoSpeed > 0 ? '#f59e0b' : '#888',
                fontSize: 14, fontWeight: 700,
              }}
              title="自動進行 (F キー)"
            >
              {autoSpeed === 0 ? '⏩' : autoSpeed === 1 ? '⏩×1' : '⏩×3'}
            </button>
          </div>

          {/* Keyboard hints */}
          <div style={{ fontSize: 10, color: '#444', marginBottom: 8, textAlign: 'center' }}>
            Space/Enter: 進行 | F: 自動 | 1-6: パネル | Esc: 閉じる
          </div>

          {/* Latest Log */}
          {latestLog && (
            <div style={{
              fontSize: 12, color: '#888', padding: '8px 12px',
              background: 'rgba(255,255,255,0.02)', borderRadius: 6,
              borderLeft: '3px solid #6366f1',
            }}>
              Month {latestLog.month}: {latestLog.title} — {latestLog.effect}
            </div>
          )}
        </div>

        {/* Side Panel */}
        {panel && (
          <div
            className="game-side-panel"
            style={{
              width: 380, borderLeft: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.01)', overflow: 'auto',
              padding: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 15, color: '#fff' }}>{panelTitles[panel]}</h3>
              <button
                onClick={() => togglePanel(panel)}
                style={{
                  background: 'none', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4, padding: '2px 8px', color: '#666', cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                ✕
              </button>
            </div>
            {panel === 'team' && <TeamPanel />}
            {panel === 'product' && <ProductPanel />}
            {panel === 'funding' && <FundingPanel />}
            {panel === 'sales' && <SalesPanel />}
            {panel === 'strategy' && <StrategyPanel />}
            {panel === 'exit' && <ExitPanel />}
            {panel === 'log' && <LogPanel />}
            {panel === 'analytics' && <AnalyticsPanel />}
            {panel === 'save' && (
              <div>
                <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>
                  オートセーブは毎ターン自動で保存されます。<br />
                  手動セーブは3スロットまで保存可能です。
                </p>
                {saveMsg && (
                  <div style={{ fontSize: 12, color: '#00c896', marginBottom: 10, padding: '6px 10px', background: 'rgba(0,200,150,0.1)', borderRadius: 4 }}>
                    {saveMsg}
                  </div>
                )}
                {[1, 2, 3].map(slotId => {
                  const slots = getSaveSlots();
                  const slot = slots.find(s => s.id === slotId);
                  return (
                    <div key={slotId} style={{
                      background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: 12,
                      marginBottom: 8, border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Slot {slotId}</div>
                        {slot ? (
                          <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                            {slot.companyName} | Month {slot.month} | {formatCurrency(slot.mrr)} MRR
                            <br />
                            <span style={{ fontSize: 10, color: '#555' }}>{new Date(slot.savedAt).toLocaleString('ja-JP')}</span>
                          </div>
                        ) : (
                          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>空きスロット</div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          saveGame(slotId);
                          setSaveMsg(`Slot ${slotId} にセーブしました`);
                          setTimeout(() => setSaveMsg(''), 2000);
                        }}
                        style={{
                          background: '#6366f1', border: 'none', borderRadius: 4,
                          padding: '5px 14px', fontSize: 11, fontWeight: 600,
                          color: '#fff', cursor: 'pointer',
                        }}
                      >
                        保存
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Modal */}
      {/* Tutorial */}
      {showTutorial && (
        <Tutorial onComplete={() => {
          setShowTutorial(false);
          localStorage.setItem('valuation_game_tutorial_done', '1');
        }} />
      )}

      {/* Achievement Toast */}
      <AchievementToast achievementIds={state.achievements || []} previousCount={prevAchCount} />

      {/* Raise Event */}
      {state.pendingRaises && state.pendingRaises.length > 0 && (
        <RaiseEventModal
          requests={state.pendingRaises}
          onSubmit={(decisions) => submitRaises(decisions)}
        />
      )}

      {/* Board Meeting */}
      {state.boardMeetingDue && !state.pendingEvent && (
        <BoardMeeting
          state={state}
          onComplete={(moraleDelta, brandDelta, message) => {
            const s = { ...state };
            s.morale = Math.max(0, Math.min(100, s.morale + moraleDelta));
            s.brand = Math.max(0, Math.min(100, s.brand + brandDelta));
            s.boardMeetingDue = false;
            s.eventLog = [...s.eventLog, { month: s.month, title: 'ボードミーティング', effect: message }];
            useGameStore.setState({ state: s });
          }}
        />
      )}

      {/* Event Modal */}
      {state.pendingEvent && (
        <EventModal
          event={state.pendingEvent}
          onChoice={handleChoice}
          onDismiss={handleDismiss}
        />
      )}

      {/* Milestone Toast */}
      <MilestoneToast state={state} />

      {/* Quarterly Summary */}
      {showQuarterly && !state.pendingEvent && !state.boardMeetingDue && (
        <QuarterlySummary state={state} onClose={() => setShowQuarterly(false)} />
      )}

      {/* News Ticker */}
      <NewsTicker items={state.newsFeed || []} />

      {/* Strategic Advisor */}
      <Advisor state={state} />
    </div>
  );
};

const ActionBtn: React.FC<{ emoji: string; label: string; active: boolean; onClick: () => void }> = ({ emoji, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: active ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${active ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 8, padding: '10px 8px',
      color: active ? '#6366f1' : '#888', cursor: 'pointer',
      fontSize: 12, display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 4, transition: 'all 0.15s',
    }}
  >
    <span style={{ fontSize: 18 }}>{emoji}</span>
    {label}
  </button>
);

const MiniKPI: React.FC<{ label: string; value: string; color?: string }> = ({ label, value, color = '#e0e0e0' }) => (
  <div style={{
    background: 'rgba(255,255,255,0.02)', borderRadius: 6, padding: '6px 10px',
    border: '1px solid rgba(255,255,255,0.04)',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: 10, color: '#666', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 13, fontWeight: 600, color, fontFamily: 'monospace' }}>{value}</div>
  </div>
);
