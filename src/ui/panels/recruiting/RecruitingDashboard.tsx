import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../hooks/useGame';
import { useRecruitingStore, CHANNEL_CONFIGS, INTERVIEW_STAGE_LABELS, SALARY_TABLE } from '../../../engine/recruiting';
import type { RecruitingChannel, JobType, CandidateProfile, SalaryOffer } from '../../../engine/recruiting';
import { CandidateCard } from './CandidateCard';
import { InterviewEventModal } from './InterviewEventModal';
import { SalaryNegotiationPanel } from './SalaryNegotiationPanel';
import { applyChannelCost, applyHiringToGameState, jobTypeToRole } from '../../../engine/recruiting';
import { Sound } from '../../hooks/useSound';

// ═══════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════

type Tab = 'search' | 'in_progress' | 'history';

const TAB_LABELS: Record<Tab, string> = {
  search: '候補者を探す',
  in_progress: '面談中',
  history: '採用履歴',
};

const JOB_TYPE_LABELS: Record<JobType, string> = {
  engineer: 'エンジニア',
  sales: 'セールス',
  marketing: 'マーケティング',
  cs: 'カスタマーサクセス',
  product: 'プロダクト',
  design: 'デザイン',
  hr: '人事',
  finance: '経理・財務',
};

const ALL_JOB_TYPES: JobType[] = [
  'engineer', 'sales', 'marketing', 'cs', 'product', 'design', 'hr', 'finance',
];

const CHANNEL_ICONS: Record<RecruitingChannel, string> = {
  job_board: '📋',
  referral: '🤝',
  headhunter: '🎯',
  tech_event: '💻',
  direct_scout: '📩',
  sns_branding: '📱',
};

const RANK_COLORS: Record<string, string> = {
  S: '#FFD700',
  A: '#9B59B6',
  B: '#3498DB',
  C: '#27AE60',
  D: '#95A5A6',
};

const ALL_CHANNELS = Object.keys(CHANNEL_CONFIGS) as RecruitingChannel[];

// ═══════════════════════════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════════════════════════

const styles = {
  container: {
    background: '#0a0a0f',
    color: '#e0e0e0',
    minHeight: '100%',
    padding: '24px',
    fontFamily: 'inherit',
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    flexWrap: 'wrap' as const,
    gap: 12,
  } as React.CSSProperties,

  headerTitle: {
    fontSize: 20,
    fontWeight: 800,
    letterSpacing: '0.02em',
  } as React.CSSProperties,

  headerStats: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  statBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    color: '#aaa',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 8,
    padding: '6px 12px',
  } as React.CSSProperties,

  statValue: {
    fontWeight: 700,
    color: '#e0e0e0',
    fontFamily: 'monospace',
  } as React.CSSProperties,

  tabBar: {
    display: 'flex',
    gap: 2,
    marginBottom: 24,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: 3,
  } as React.CSSProperties,

  tab: (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '10px 16px',
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    color: active ? '#fff' : '#777',
    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  }),

  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#ccc',
    marginBottom: 14,
    letterSpacing: '0.02em',
  } as React.CSSProperties,

  channelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 12,
    marginBottom: 24,
  } as React.CSSProperties,

  channelCard: (selected: boolean): React.CSSProperties => ({
    background: selected ? 'rgba(52,152,219,0.08)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${selected ? 'rgba(52,152,219,0.4)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 10,
    padding: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  }),

  channelIcon: {
    fontSize: 24,
    marginBottom: 8,
  } as React.CSSProperties,

  channelName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#e0e0e0',
    marginBottom: 4,
  } as React.CSSProperties,

  channelDesc: {
    fontSize: 11,
    color: '#888',
    marginBottom: 10,
    lineHeight: 1.5,
  } as React.CSSProperties,

  channelMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 11,
    color: '#aaa',
    marginBottom: 8,
  } as React.CSSProperties,

  rankBar: {
    display: 'flex',
    gap: 2,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden' as const,
  } as React.CSSProperties,

  filterRow: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap' as const,
  } as React.CSSProperties,

  select: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 6,
    color: '#e0e0e0',
    padding: '8px 12px',
    fontSize: 13,
    fontFamily: 'inherit',
    cursor: 'pointer',
    outline: 'none',
  } as React.CSSProperties,

  searchButton: (disabled: boolean): React.CSSProperties => ({
    padding: '10px 28px',
    fontSize: 14,
    fontWeight: 700,
    color: disabled ? '#666' : '#0a0a0f',
    background: disabled ? 'rgba(255,255,255,0.06)' : '#3498DB',
    border: 'none',
    borderRadius: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
  }),

  candidateGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 14,
  } as React.CSSProperties,

  emptyState: {
    textAlign: 'center' as const,
    padding: '48px 24px',
    color: '#555',
    fontSize: 14,
  } as React.CSSProperties,

  historyTable: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: 13,
  } as React.CSSProperties,

  historyTh: {
    textAlign: 'left' as const,
    padding: '10px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    color: '#888',
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  } as React.CSSProperties,

  historyTd: {
    padding: '10px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    color: '#ccc',
  } as React.CSSProperties,

  slotIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    marginBottom: 16,
  } as React.CSSProperties,

  slotDot: (filled: boolean): React.CSSProperties => ({
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: filled ? '#3498DB' : 'rgba(255,255,255,0.08)',
    border: `1px solid ${filled ? '#3498DB' : 'rgba(255,255,255,0.15)'}`,
    transition: 'all 0.2s ease',
  }),

  brandBoostBanner: {
    background: 'rgba(155,89,182,0.08)',
    border: '1px solid rgba(155,89,182,0.2)',
    borderRadius: 8,
    padding: '12px 16px',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 12,
    color: '#C39BD3',
  } as React.CSSProperties,
};

// ═══════════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════════

/** Rank distribution bar for channel cards */
const RankDistributionBar: React.FC<{ distribution: Record<string, number> }> = ({ distribution }) => (
  <div style={styles.rankBar}>
    {(['S', 'A', 'B', 'C', 'D'] as const).map(rank => {
      const pct = (distribution[rank] ?? 0) * 100;
      if (pct <= 0) return null;
      return (
        <div
          key={rank}
          title={`${rank}ランク: ${pct.toFixed(0)}%`}
          style={{
            flex: pct,
            background: RANK_COLORS[rank],
            opacity: 0.7,
            minWidth: pct > 0 ? 2 : 0,
          }}
        />
      );
    })}
  </div>
);

/** Channel selection card */
const ChannelCard: React.FC<{
  channel: RecruitingChannel;
  selected: boolean;
  onClick: () => void;
}> = ({ channel, selected, onClick }) => {
  const config = CHANNEL_CONFIGS[channel];
  const isSNS = channel === 'sns_branding';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      style={styles.channelCard(selected)}
    >
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, transparent, #3498DB, transparent)',
          }}
        />
      )}
      <div style={styles.channelIcon}>{CHANNEL_ICONS[channel]}</div>
      <div style={styles.channelName}>{config.name}</div>
      <div style={styles.channelDesc}>{config.description}</div>
      <div style={styles.channelMeta}>
        <span>
          コスト: <span style={{ color: '#F1C40F', fontWeight: 600 }}>{config.cost}万円</span>
        </span>
        {isSNS ? (
          <span style={{ color: '#C39BD3' }}>ブランドUP</span>
        ) : (
          <span>
            候補者: {config.candidateCount[0]}〜{config.candidateCount[1]}名
          </span>
        )}
      </div>
      {!isSNS && <RankDistributionBar distribution={config.rankDistribution} />}
      {isSNS && (
        <div
          style={{
            fontSize: 10,
            color: '#9B59B6',
            background: 'rgba(155,89,182,0.1)',
            borderRadius: 4,
            padding: '4px 8px',
            textAlign: 'center',
          }}
        >
          即時の候補者は出ません。採用ブランド力を強化します。
        </div>
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════════

export const RecruitingDashboard: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const [selectedChannel, setSelectedChannel] = useState<RecruitingChannel | null>(null);
  const [selectedJobType, setSelectedJobType] = useState<JobType | 'all'>('all');
  const [searchResults, setSearchResults] = useState<CandidateProfile[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [offerCandidateId, setOfferCandidateId] = useState<string | null>(null);

  // --- Store ---
  const gameState = useGameStore(s => s.state);
  const {
    candidatePool,
    employerBrandScore,
    snsBrandingStacks,
    hiringHistory,
    pendingInterviewEvent,
    searchCandidates,
    startInterview,
    advanceInterview,
    rejectCandidate,
    holdCandidate,
    dismissInterviewEvent,
    moveToOffer,
    getActiveCandidateCount,
    getMaxActiveInterviews,
    getCandidateById,
  } = useRecruitingStore();

  if (!gameState) return null;

  const activeCandidates = candidatePool.activeCandidates;
  const availableCandidates = candidatePool.availableCandidates;
  const activeCount = getActiveCandidateCount();
  const maxSlots = getMaxActiveInterviews(gameState);
  const totalCandidates = activeCandidates.length + availableCandidates.length;

  // --- Handlers ---

  const handleSearch = () => {
    if (!selectedChannel) return;
    Sound.click();

    const jobFilter = selectedJobType === 'all' ? undefined : selectedJobType;
    const results = searchCandidates(selectedChannel, gameState, jobFilter);
    setSearchResults(results);
    setHasSearched(true);

    if (results.length > 0) {
      Sound.candidateFound();
    } else {
      Sound.badEvent();
    }
  };

  const handleAdvance = (candidateId: string) => {
    Sound.click();
    const candidate = getCandidateById(candidateId);
    if (!candidate) return;

    // If candidate is in discovered state, start the interview
    if (candidate.interviewStage === 'discovered') {
      if (activeCount >= maxSlots) {
        // No slots available
        Sound.badEvent();
        return;
      }
      startInterview(candidateId);
      return;
    }

    // If candidate is at final_interview, move to offer stage
    if (candidate.interviewStage === 'final_interview') {
      moveToOffer(candidateId);
      return;
    }

    // If candidate is at offer stage, open salary negotiation
    if (candidate.interviewStage === 'offer') {
      setOfferCandidateId(candidateId);
      return;
    }

    // Otherwise advance the interview
    // The event will be triggered by startInterview or shown via pendingInterviewEvent
    startInterview(candidateId);
  };

  const handleReject = (candidateId: string) => {
    Sound.click();
    rejectCandidate(candidateId);
  };

  const handleHold = (candidateId: string) => {
    Sound.click();
    holdCandidate(candidateId);
  };

  const handleInterviewChoice = (choiceIndex: number) => {
    if (!pendingInterviewEvent) return;
    Sound.interviewEvent();
    const effect = advanceInterview(pendingInterviewEvent.candidateId, choiceIndex);
    if (effect && effect.interestDelta > 0) {
      Sound.interviewGood();
    } else if (effect && effect.interestDelta < 0) {
      Sound.interviewBad();
    }
    if (effect && effect.revealAbility) {
      setTimeout(() => Sound.abilityReveal(), 200);
    }
    dismissInterviewEvent();
  };

  const handleSalaryClose = () => {
    setOfferCandidateId(null);
  };

  // --- Candidate being offered ---
  const offerCandidate = offerCandidateId ? getCandidateById(offerCandidateId) : null;

  // ═════════════════════════════════════════════════════════════════
  // Render
  // ═════════════════════════════════════════════════════════════════

  return (
    <div style={styles.container}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerTitle}>採用ダッシュボード</div>
        <div style={styles.headerStats}>
          <div style={styles.statBadge}>
            <span>採用ブランドスコア</span>
            <span style={{ ...styles.statValue, color: '#C39BD3' }}>
              {employerBrandScore}
            </span>
            {snsBrandingStacks > 0 && (
              <span style={{ fontSize: 10, color: '#9B59B6' }}>
                (+{snsBrandingStacks})
              </span>
            )}
          </div>
          <div style={styles.statBadge}>
            <span>面談枠</span>
            <span style={{
              ...styles.statValue,
              color: activeCount >= maxSlots ? '#E74C3C' : '#3498DB',
            }}>
              {activeCount}/{maxSlots}
            </span>
          </div>
          <div style={styles.statBadge}>
            <span>候補者数</span>
            <span style={styles.statValue}>{totalCandidates}</span>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div style={styles.tabBar}>
        {(['search', 'in_progress', 'history'] as Tab[]).map(tab => (
          <motion.button
            key={tab}
            whileHover={{ opacity: 0.9 }}
            whileTap={{ scale: 0.97 }}
            style={styles.tab(activeTab === tab)}
            onClick={() => {
              Sound.click();
              setActiveTab(tab);
            }}
          >
            {TAB_LABELS[tab]}
            {tab === 'in_progress' && activeCandidates.length > 0 && (
              <span style={{
                marginLeft: 6,
                background: '#3498DB',
                color: '#fff',
                borderRadius: 10,
                padding: '1px 7px',
                fontSize: 10,
                fontWeight: 700,
              }}>
                {activeCandidates.length}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <SearchTab
              selectedChannel={selectedChannel}
              selectedJobType={selectedJobType}
              searchResults={searchResults}
              hasSearched={hasSearched}
              onSelectChannel={setSelectedChannel}
              onSelectJobType={setSelectedJobType}
              onSearch={handleSearch}
              onAdvance={handleAdvance}
              onHold={handleHold}
              onReject={handleReject}
            />
          </motion.div>
        )}

        {activeTab === 'in_progress' && (
          <motion.div
            key="in_progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <InProgressTab
              activeCandidates={activeCandidates}
              availableCandidates={availableCandidates}
              activeCount={activeCount}
              maxSlots={maxSlots}
              onAdvance={handleAdvance}
              onHold={handleHold}
              onReject={handleReject}
            />
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <HistoryTab hiringHistory={hiringHistory} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Interview Event Modal ── */}
      <AnimatePresence>
        {pendingInterviewEvent && (() => {
          const candidate = getCandidateById(pendingInterviewEvent.candidateId);
          if (!candidate) return null;
          return (
            <InterviewEventModal
              candidateId={pendingInterviewEvent.candidateId}
              candidateName={candidate.name}
              event={pendingInterviewEvent.event}
              onChoice={handleInterviewChoice}
            />
          );
        })()}
      </AnimatePresence>

      {/* ── Salary Negotiation Panel ── */}
      <AnimatePresence>
        {offerCandidate && offerCandidate.interviewStage === 'offer' && (
          <SalaryNegotiationPanel
            candidate={offerCandidate}
            onClose={handleSalaryClose}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
// Tab: Search (候補者を探す)
// ═══════════════════════════════════════════════════════════════════

const SearchTab: React.FC<{
  selectedChannel: RecruitingChannel | null;
  selectedJobType: JobType | 'all';
  searchResults: CandidateProfile[];
  hasSearched: boolean;
  onSelectChannel: (ch: RecruitingChannel) => void;
  onSelectJobType: (jt: JobType | 'all') => void;
  onSearch: () => void;
  onAdvance: (id: string) => void;
  onHold: (id: string) => void;
  onReject: (id: string) => void;
}> = ({
  selectedChannel,
  selectedJobType,
  searchResults,
  hasSearched,
  onSelectChannel,
  onSelectJobType,
  onSearch,
  onAdvance,
  onHold,
  onReject,
}) => {
  const isSNS = selectedChannel === 'sns_branding';
  const canSearch = selectedChannel !== null;

  return (
    <>
      {/* Channel selection */}
      <div style={styles.sectionTitle}>採用チャネルを選択</div>
      <div style={styles.channelGrid}>
        {ALL_CHANNELS.map(ch => (
          <ChannelCard
            key={ch}
            channel={ch}
            selected={selectedChannel === ch}
            onClick={() => onSelectChannel(ch)}
          />
        ))}
      </div>

      {/* Filters + Search */}
      <div style={styles.filterRow}>
        <select
          style={styles.select}
          value={selectedJobType}
          onChange={e => onSelectJobType(e.target.value as JobType | 'all')}
        >
          <option value="all">全職種</option>
          {ALL_JOB_TYPES.map(jt => (
            <option key={jt} value={jt}>{JOB_TYPE_LABELS[jt]}</option>
          ))}
        </select>

        <motion.button
          whileHover={canSearch ? { scale: 1.03 } : {}}
          whileTap={canSearch ? { scale: 0.97 } : {}}
          style={styles.searchButton(!canSearch)}
          onClick={handleSearchClick}
          disabled={!canSearch}
        >
          {isSNS ? 'ブランディング実施' : '探す'}
        </motion.button>

        {selectedChannel && (
          <span style={{ fontSize: 12, color: '#888' }}>
            コスト: {CHANNEL_CONFIGS[selectedChannel].cost}万円
          </span>
        )}
      </div>

      {/* SNS Branding Banner */}
      {isSNS && hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.brandBoostBanner}
        >
          <span style={{ fontSize: 20 }}>📱</span>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 2 }}>SNSブランディング実施済み</div>
            <div style={{ fontSize: 11, color: '#999' }}>
              採用ブランドスコアが上昇しました。次ターン以降、全チャネルの候補者品質が向上します。
            </div>
          </div>
        </motion.div>
      )}

      {/* Search Results */}
      {hasSearched && !isSNS && (
        <>
          <div style={styles.sectionTitle}>
            検索結果 ({searchResults.length}名)
          </div>
          {searchResults.length > 0 ? (
            <div style={styles.candidateGrid}>
              <AnimatePresence>
                {searchResults.map(candidate => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onAdvance={onAdvance}
                    onHold={onHold}
                    onReject={onReject}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div style={styles.emptyState}>
              該当する候補者が見つかりませんでした。別のチャネルや条件で再度お試しください。
            </div>
          )}
        </>
      )}

      {!hasSearched && (
        <div style={styles.emptyState}>
          チャネルを選択して「探す」ボタンを押してください。
        </div>
      )}
    </>
  );

  function handleSearchClick() {
    if (canSearch) onSearch();
  }
};

// ═══════════════════════════════════════════════════════════════════
// Tab: In Progress (面談中)
// ═══════════════════════════════════════════════════════════════════

const InProgressTab: React.FC<{
  activeCandidates: CandidateProfile[];
  availableCandidates: CandidateProfile[];
  activeCount: number;
  maxSlots: number;
  onAdvance: (id: string) => void;
  onHold: (id: string) => void;
  onReject: (id: string) => void;
}> = ({
  activeCandidates,
  availableCandidates,
  activeCount,
  maxSlots,
  onAdvance,
  onHold,
  onReject,
}) => {
  return (
    <>
      {/* Slot usage indicator */}
      <div style={styles.slotIndicator}>
        <span style={{ color: '#888', marginRight: 8 }}>面談枠:</span>
        {Array.from({ length: maxSlots }).map((_, i) => (
          <div key={i} style={styles.slotDot(i < activeCount)} />
        ))}
        <span style={{
          marginLeft: 8,
          fontFamily: 'monospace',
          fontWeight: 700,
          color: activeCount >= maxSlots ? '#E74C3C' : '#3498DB',
        }}>
          {activeCount}/{maxSlots}
        </span>
      </div>

      {/* Active interviews */}
      <div style={styles.sectionTitle}>
        面談進行中 ({activeCandidates.length}名)
      </div>
      {activeCandidates.length > 0 ? (
        <div style={styles.candidateGrid}>
          <AnimatePresence>
            {activeCandidates.map(candidate => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onAdvance={onAdvance}
                onHold={onHold}
                onReject={onReject}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div style={styles.emptyState}>
          現在、面談中の候補者はいません。
        </div>
      )}

      {/* Available / Discovered candidates */}
      <div style={{ marginTop: 32 }}>
        <div style={styles.sectionTitle}>
          発見済み候補者 ({availableCandidates.length}名)
        </div>
        {availableCandidates.length > 0 ? (
          <div style={styles.candidateGrid}>
            <AnimatePresence>
              {availableCandidates.map(candidate => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onAdvance={onAdvance}
                  onHold={onHold}
                  onReject={onReject}
                  compact
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div style={styles.emptyState}>
            発見済みの候補者はいません。「候補者を探す」タブからチャネルを選択してください。
          </div>
        )}
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════
// Tab: History (採用履歴)
// ═══════════════════════════════════════════════════════════════════

const HistoryTab: React.FC<{
  hiringHistory: Array<{
    candidateId: string;
    name: string;
    rank: string;
    jobType: JobType;
    finalSalary: number;
    stockOption: number;
    signingBonus: number;
    hiredMonth: number;
    interviewRounds: number;
    channel: RecruitingChannel;
  }>;
}> = ({ hiringHistory }) => {
  const CHANNEL_NAMES: Record<RecruitingChannel, string> = {
    job_board: '求人媒体',
    referral: '社員紹介',
    headhunter: 'ヘッドハンター',
    tech_event: 'テックイベント',
    direct_scout: 'ダイレクトスカウト',
    sns_branding: 'SNSブランディング',
  };

  if (hiringHistory.length === 0) {
    return (
      <div style={styles.emptyState}>
        まだ採用履歴がありません。候補者を採用すると、ここに記録が表示されます。
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={styles.historyTable}>
        <thead>
          <tr>
            <th style={styles.historyTh}>名前</th>
            <th style={styles.historyTh}>ランク</th>
            <th style={styles.historyTh}>職種</th>
            <th style={styles.historyTh}>年収</th>
            <th style={styles.historyTh}>チャネル</th>
            <th style={styles.historyTh}>採用月</th>
          </tr>
        </thead>
        <tbody>
          {hiringHistory.map((record, index) => (
            <motion.tr
              key={record.candidateId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <td style={styles.historyTd}>
                <span style={{ fontWeight: 600 }}>{record.name}</span>
              </td>
              <td style={styles.historyTd}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 900,
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  background: `${RANK_COLORS[record.rank] ?? '#888'}18`,
                  color: RANK_COLORS[record.rank] ?? '#888',
                  border: `1px solid ${RANK_COLORS[record.rank] ?? '#888'}55`,
                  fontFamily: 'monospace',
                }}>
                  {record.rank}
                </span>
              </td>
              <td style={styles.historyTd}>
                {JOB_TYPE_LABELS[record.jobType] ?? record.jobType}
              </td>
              <td style={styles.historyTd}>
                <span style={{ fontFamily: 'monospace', color: '#F1C40F' }}>
                  {record.finalSalary}万円
                </span>
                {record.stockOption > 0 && (
                  <span style={{ fontSize: 10, color: '#888', marginLeft: 6 }}>
                    +SO {record.stockOption}%
                  </span>
                )}
              </td>
              <td style={styles.historyTd}>
                <span style={{ fontSize: 12 }}>
                  {CHANNEL_ICONS[record.channel]} {CHANNEL_NAMES[record.channel]}
                </span>
              </td>
              <td style={styles.historyTd}>
                <span style={{ fontFamily: 'monospace', color: '#aaa' }}>
                  {record.hiredMonth}月目
                </span>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecruitingDashboard;
