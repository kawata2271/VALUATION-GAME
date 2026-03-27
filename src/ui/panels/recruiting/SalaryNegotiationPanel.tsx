import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRecruitingStore, SALARY_TABLE, BENEFIT_LABELS, NEGOTIATION_RULES } from '../../../engine/recruiting';
import type { CandidateProfile, SalaryOffer, BenefitType, SalaryNegotiation } from '../../../engine/recruiting';
import { calculateAnnualCost } from '../../../engine/recruiting';

// ─── Types ───────────────────────────────────────────────────

interface Props {
  candidate: CandidateProfile;
  negotiation: SalaryNegotiation | null;
  onSubmitOffer: (offer: SalaryOffer) => void;
  onWithdraw: () => void;
}

// ─── Constants ───────────────────────────────────────────────

const ALL_BENEFITS: BenefitType[] = [
  'remote_work',
  'learning_budget',
  'housing_allowance',
  'health_premium',
  'flexible_hours',
  'sabbatical',
];

const RANK_COLORS: Record<string, string> = {
  S: '#FFD700',
  A: '#9B59B6',
  B: '#3498DB',
  C: '#27AE60',
  D: '#95A5A6',
};

const RESPONSE_DISPLAY: Record<string, { emoji: string; color: string }> = {
  accept: { emoji: '🎉', color: '#27AE60' },
  counter: { emoji: '🤔', color: '#F1C40F' },
  reject: { emoji: '😞', color: '#E74C3C' },
  thinking: { emoji: '⏳', color: '#95A5A6' },
};

// ─── Styles ──────────────────────────────────────────────────

const styles = {
  panel: {
    background: '#0a0a0f',
    color: '#e0e0e0',
    borderRadius: 12,
    padding: 24,
    maxWidth: 680,
    width: '100%',
    fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
    border: '1px solid #1a1a2e',
  } as React.CSSProperties,

  header: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  } as React.CSSProperties,

  rankBadge: (rank: string): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 800,
    background: `${RANK_COLORS[rank] ?? '#95A5A6'}22`,
    color: RANK_COLORS[rank] ?? '#95A5A6',
    border: `1px solid ${RANK_COLORS[rank] ?? '#95A5A6'}44`,
  }),

  roundBadge: {
    marginLeft: 'auto',
    fontSize: 13,
    color: '#888',
    fontWeight: 400,
  } as React.CSSProperties,

  section: {
    marginBottom: 20,
    padding: 16,
    background: '#0f0f1a',
    borderRadius: 8,
    border: '1px solid #1a1a2e',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 12,
  } as React.CSSProperties,

  sliderContainer: {
    position: 'relative' as const,
    marginBottom: 8,
  } as React.CSSProperties,

  rangeTrack: {
    position: 'relative' as const,
    height: 8,
    background: '#1a1a2e',
    borderRadius: 4,
    marginBottom: 4,
  } as React.CSSProperties,

  slider: {
    width: '100%',
    height: 8,
    WebkitAppearance: 'none' as const,
    appearance: 'none' as const,
    background: 'transparent',
    cursor: 'pointer',
    position: 'relative' as const,
    zIndex: 2,
  } as React.CSSProperties,

  salaryValue: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    textAlign: 'center' as const,
    marginBottom: 4,
  } as React.CSSProperties,

  salaryUnit: {
    fontSize: 14,
    color: '#888',
    fontWeight: 400,
  } as React.CSSProperties,

  rangeLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  } as React.CSSProperties,

  marketRange: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    background: '#12121f',
    borderRadius: 6,
    fontSize: 13,
    marginBottom: 12,
  } as React.CSSProperties,

  expectation: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    background: '#1a1220',
    borderRadius: 6,
    fontSize: 13,
    border: '1px solid #3a2040',
    marginBottom: 12,
  } as React.CSSProperties,

  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  } as React.CSSProperties,

  label: {
    fontSize: 13,
    color: '#aaa',
    minWidth: 120,
    flexShrink: 0,
  } as React.CSSProperties,

  checkbox: {
    width: 18,
    height: 18,
    accentColor: '#6C5CE7',
    cursor: 'pointer',
    flexShrink: 0,
  } as React.CSSProperties,

  numberInput: {
    width: 100,
    padding: '6px 10px',
    background: '#0a0a0f',
    border: '1px solid #2a2a3e',
    borderRadius: 6,
    color: '#e0e0e0',
    fontSize: 14,
    textAlign: 'right' as const,
    outline: 'none',
  } as React.CSSProperties,

  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 8,
  } as React.CSSProperties,

  benefitItem: (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    background: active ? '#1a1530' : '#0f0f1a',
    borderRadius: 6,
    border: `1px solid ${active ? '#6C5CE744' : '#1a1a2e'}`,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontSize: 13,
  }),

  impactCard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
  } as React.CSSProperties,

  impactItem: {
    textAlign: 'center' as const,
    padding: '12px 8px',
    background: '#12121f',
    borderRadius: 8,
  } as React.CSSProperties,

  impactValue: (color: string): React.CSSProperties => ({
    fontSize: 20,
    fontWeight: 700,
    color,
    marginBottom: 2,
  }),

  impactLabel: {
    fontSize: 11,
    color: '#666',
  } as React.CSSProperties,

  chatHistory: {
    maxHeight: 240,
    overflowY: 'auto' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 8,
  } as React.CSSProperties,

  chatBubble: (isYou: boolean): React.CSSProperties => ({
    padding: '10px 14px',
    borderRadius: 12,
    fontSize: 13,
    lineHeight: 1.5,
    maxWidth: '85%',
    alignSelf: isYou ? 'flex-end' : 'flex-start',
    background: isYou ? '#1a1535' : '#151520',
    border: `1px solid ${isYou ? '#6C5CE733' : '#1a1a2e'}`,
  }),

  chatLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
    fontWeight: 600,
  } as React.CSSProperties,

  buttonRow: {
    display: 'flex',
    gap: 12,
    marginTop: 20,
  } as React.CSSProperties,

  primaryButton: {
    flex: 1,
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #6C5CE7, #a855f7)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.15s ease',
  } as React.CSSProperties,

  dangerButton: {
    padding: '12px 20px',
    background: 'transparent',
    color: '#E74C3C',
    border: '1px solid #E74C3C44',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  } as React.CSSProperties,

  disabledButton: {
    flex: 1,
    padding: '12px 20px',
    background: '#1a1a2e',
    color: '#555',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'not-allowed',
  } as React.CSSProperties,

  marketBar: {
    position: 'relative' as const,
    height: 6,
    background: '#1a1a2e',
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 4,
  } as React.CSSProperties,
} as const;

// ─── Slider custom CSS (injected once) ──────────────────────

const sliderCssId = 'salary-slider-css';
function ensureSliderCss() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(sliderCssId)) return;
  const style = document.createElement('style');
  style.id = sliderCssId;
  style.textContent = `
    input[type="range"].salary-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #6C5CE7;
      border: 2px solid #fff;
      box-shadow: 0 0 8px #6C5CE766;
      cursor: pointer;
      margin-top: -6px;
    }
    input[type="range"].salary-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #6C5CE7;
      border: 2px solid #fff;
      box-shadow: 0 0 8px #6C5CE766;
      cursor: pointer;
    }
    input[type="range"].salary-slider::-webkit-slider-runnable-track {
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, #1a1a2e, #2a2a4e);
    }
    input[type="range"].salary-slider::-moz-range-track {
      height: 8px;
      border-radius: 4px;
      background: linear-gradient(90deg, #1a1a2e, #2a2a4e);
    }
  `;
  document.head.appendChild(style);
}

// ─── Helper ──────────────────────────────────────────────────

function formatSalary(v: number): string {
  return `${v.toLocaleString()}万円`;
}

function formatOfferSummary(offer: SalaryOffer): string {
  const parts = [`年収${offer.baseSalary}万円`];
  if (offer.stockOptionPercent > 0) parts.push(`SO ${offer.stockOptionPercent}%`);
  if (offer.signingBonus > 0) parts.push(`入社祝金${offer.signingBonus}万円`);
  if (offer.benefits.length > 0) parts.push(`福利厚生${offer.benefits.length}件`);
  return parts.join(' + ');
}

// ─── Negotiation Response Messages ──────────────────────────

const RESPONSE_MESSAGES: Record<string, string> = {
  accept: '承諾しました！',
  counter: 'もう少し検討をお願いしたいです。',
  reject: '条件が合わず辞退します。',
  thinking: '検討中です...',
};

// ─── Component ───────────────────────────────────────────────

const SalaryNegotiationPanel: React.FC<Props> = ({
  candidate,
  negotiation,
  onSubmitOffer,
  onWithdraw,
}) => {
  React.useEffect(() => { ensureSliderCss(); }, []);

  const salaryRange = SALARY_TABLE[candidate.rank];
  const sliderMin = salaryRange.minAcceptable;
  const sliderMax = salaryRange.ideal;

  const currentRound = negotiation ? negotiation.round + 1 : 1;
  const maxRounds = NEGOTIATION_RULES.maxRounds;
  const isNegotiationOver = negotiation
    ? negotiation.status !== 'ongoing'
    : false;

  // ─── Local state ─────────────────────────────────────────

  const [baseSalary, setBaseSalary] = useState<number>(
    negotiation && negotiation.offers.length > 0
      ? negotiation.offers[negotiation.offers.length - 1].baseSalary
      : Math.round((salaryRange.marketMin + salaryRange.marketMax) / 2)
  );
  const [hasStockOption, setHasStockOption] = useState(false);
  const [stockOptionPercent, setStockOptionPercent] = useState(0.1);
  const [signingBonus, setSigningBonus] = useState(0);
  const [selectedBenefits, setSelectedBenefits] = useState<BenefitType[]>([]);

  // ─── Computed ────────────────────────────────────────────

  const currentOffer = useMemo<SalaryOffer>(() => ({
    baseSalary,
    stockOptionPercent: hasStockOption ? stockOptionPercent : 0,
    signingBonus,
    benefits: selectedBenefits,
  }), [baseSalary, hasStockOption, stockOptionPercent, signingBonus, selectedBenefits]);

  const costImpact = useMemo(() => calculateAnnualCost(currentOffer), [currentOffer]);

  // Market range indicator position (percentage on the slider)
  const marketMinPct = ((salaryRange.marketMin - sliderMin) / (sliderMax - sliderMin)) * 100;
  const marketMaxPct = ((salaryRange.marketMax - sliderMin) / (sliderMax - sliderMin)) * 100;

  // ─── Handlers ────────────────────────────────────────────

  const toggleBenefit = (b: BenefitType) => {
    setSelectedBenefits(prev =>
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    );
  };

  const handleSubmit = () => {
    if (isNegotiationOver) return;
    onSubmitOffer(currentOffer);
  };

  // ─── Render ──────────────────────────────────────────────

  return (
    <motion.div
      style={styles.panel}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Header */}
      <div style={styles.header}>
        <span>💰 給与交渉</span>
        <span style={{ color: '#555' }}>—</span>
        <span style={styles.rankBadge(candidate.rank)}>{candidate.rank}</span>
        <span>{candidate.name}</span>
        <span style={styles.roundBadge}>
          ラウンド {currentRound}/{maxRounds}
        </span>
      </div>

      {/* Market Range & Expectation */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>市場情報</div>

        <div style={styles.marketRange}>
          <span style={{ color: '#888' }}>📊 市場相場</span>
          <span>
            <span style={{ color: '#6C5CE7', fontWeight: 600 }}>{formatSalary(salaryRange.marketMin)}</span>
            <span style={{ color: '#555', margin: '0 6px' }}>〜</span>
            <span style={{ color: '#a855f7', fontWeight: 600 }}>{formatSalary(salaryRange.marketMax)}</span>
          </span>
        </div>

        {candidate.salaryExpectation > 0 && (
          <div style={styles.expectation}>
            <span>💭</span>
            <span style={{ color: '#ccc' }}>候補者の希望年収:</span>
            <span style={{ color: '#F1C40F', fontWeight: 700, marginLeft: 'auto' }}>
              {formatSalary(candidate.salaryExpectation)}
            </span>
          </div>
        )}

        {/* Market range visual bar */}
        <div style={styles.marketBar}>
          <div
            style={{
              position: 'absolute',
              left: `${Math.max(0, marketMinPct)}%`,
              width: `${Math.min(100, marketMaxPct) - Math.max(0, marketMinPct)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6C5CE744, #a855f744)',
              borderRadius: 3,
            }}
          />
        </div>
        <div style={styles.rangeLabels}>
          <span>{formatSalary(sliderMin)}</span>
          <span style={{ color: '#6C5CE7' }}>相場範囲</span>
          <span>{formatSalary(sliderMax)}</span>
        </div>
      </div>

      {/* Negotiation History */}
      {negotiation && negotiation.offers.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>交渉履歴</div>
          <div style={styles.chatHistory}>
            {negotiation.offers.map((offer, i) => {
              const response = negotiation.candidateResponses[i];
              const rd = RESPONSE_DISPLAY[response] ?? RESPONSE_DISPLAY.thinking;

              return (
                <React.Fragment key={i}>
                  {/* Your offer */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div style={{ ...styles.chatLabel, textAlign: 'right' }}>
                      あなたのオファー（ラウンド {i + 1}）
                    </div>
                    <div style={styles.chatBubble(true)}>
                      📋 {formatOfferSummary(offer)}
                    </div>
                  </motion.div>

                  {/* Candidate response */}
                  {response && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.15 }}
                    >
                      <div style={styles.chatLabel}>
                        {candidate.name}の反応
                      </div>
                      <div style={{ ...styles.chatBubble(false), borderColor: `${rd.color}33` }}>
                        <span style={{ marginRight: 6 }}>{rd.emoji}</span>
                        <span style={{ color: rd.color }}>
                          {RESPONSE_MESSAGES[response] ?? response}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Offer Composer */}
      {!isNegotiationOver && (
        <>
          {/* Base Salary Slider */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>オファー条件</div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ ...styles.label, marginBottom: 8 }}>基本年収</div>
              <div style={styles.salaryValue}>
                {baseSalary.toLocaleString()}
                <span style={styles.salaryUnit}> 万円</span>
              </div>

              <div style={styles.sliderContainer}>
                <input
                  className="salary-slider"
                  type="range"
                  min={sliderMin}
                  max={sliderMax}
                  step={10}
                  value={baseSalary}
                  onChange={e => setBaseSalary(Number(e.target.value))}
                  style={styles.slider}
                />
              </div>
              <div style={styles.rangeLabels}>
                <span>{formatSalary(sliderMin)}</span>
                <span style={{ color: '#6C5CE7', fontSize: 12 }}>
                  市場: {formatSalary(salaryRange.marketMin)}〜{formatSalary(salaryRange.marketMax)}
                </span>
                <span>{formatSalary(sliderMax)}</span>
              </div>
            </div>

            {/* Stock Options */}
            <div style={styles.row}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={hasStockOption}
                  onChange={e => setHasStockOption(e.target.checked)}
                  style={styles.checkbox}
                />
                <span style={styles.label}>ストックオプション</span>
              </label>
              {hasStockOption && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <input
                    type="number"
                    min={0.01}
                    max={1}
                    step={0.01}
                    value={stockOptionPercent}
                    onChange={e => {
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v)) setStockOptionPercent(Math.min(1, Math.max(0.01, v)));
                    }}
                    style={{ ...styles.numberInput, width: 80 }}
                  />
                  <span style={{ color: '#888', fontSize: 13 }}>%</span>
                </div>
              )}
            </div>

            {/* Signing Bonus */}
            <div style={styles.row}>
              <span style={styles.label}>入社祝金（サインオン）</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="number"
                  min={0}
                  max={500}
                  step={10}
                  value={signingBonus}
                  onChange={e => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v)) setSigningBonus(Math.max(0, v));
                  }}
                  style={styles.numberInput}
                />
                <span style={{ color: '#888', fontSize: 13 }}>万円</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>福利厚生パッケージ</div>
            <div style={styles.benefitsGrid}>
              {ALL_BENEFITS.map(b => (
                <motion.div
                  key={b}
                  style={styles.benefitItem(selectedBenefits.includes(b))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleBenefit(b)}
                >
                  <input
                    type="checkbox"
                    checked={selectedBenefits.includes(b)}
                    onChange={() => toggleBenefit(b)}
                    style={styles.checkbox}
                    onClick={e => e.stopPropagation()}
                  />
                  <span style={{ color: selectedBenefits.includes(b) ? '#d0c0f0' : '#888' }}>
                    {BENEFIT_LABELS[b]}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Cost Impact */}
          <div style={styles.section}>
            <div style={styles.sectionTitle}>コストインパクト</div>
            <div style={styles.impactCard}>
              <div style={styles.impactItem}>
                <div style={styles.impactValue('#E74C3C')}>
                  +{costImpact.monthlyCost.toLocaleString()}
                </div>
                <div style={styles.impactLabel}>月額バーンレート（万円）</div>
              </div>
              <div style={styles.impactItem}>
                <div style={styles.impactValue('#F1C40F')}>
                  {costImpact.annualCost.toLocaleString()}
                </div>
                <div style={styles.impactLabel}>年間コスト（万円）</div>
              </div>
              <div style={styles.impactItem}>
                <div style={styles.impactValue(costImpact.signingCost > 0 ? '#a855f7' : '#333')}>
                  {costImpact.signingCost > 0 ? costImpact.signingCost.toLocaleString() : '—'}
                </div>
                <div style={styles.impactLabel}>入社祝金・一時金（万円）</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={styles.buttonRow}>
            <motion.button
              style={
                currentRound > maxRounds
                  ? styles.disabledButton
                  : styles.primaryButton
              }
              whileHover={currentRound <= maxRounds ? { opacity: 0.85 } : undefined}
              whileTap={currentRound <= maxRounds ? { scale: 0.97 } : undefined}
              onClick={handleSubmit}
              disabled={currentRound > maxRounds}
            >
              📨 オファー送信
            </motion.button>
            <motion.button
              style={styles.dangerButton}
              whileHover={{ background: '#E74C3C15' }}
              whileTap={{ scale: 0.97 }}
              onClick={onWithdraw}
            >
              交渉を打ち切る
            </motion.button>
          </div>
        </>
      )}

      {/* Negotiation ended state */}
      {isNegotiationOver && negotiation && (
        <motion.div
          style={{
            ...styles.section,
            textAlign: 'center',
            borderColor: negotiation.status === 'accepted' ? '#27AE6044' : '#E74C3C44',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div style={{ fontSize: 40, marginBottom: 8 }}>
            {negotiation.status === 'accepted' ? '🎉' : '😞'}
          </div>
          <div style={{
            fontSize: 18,
            fontWeight: 700,
            color: negotiation.status === 'accepted' ? '#27AE60' : '#E74C3C',
            marginBottom: 4,
          }}>
            {negotiation.status === 'accepted' && 'オファー承諾！'}
            {negotiation.status === 'rejected' && 'オファー辞退'}
            {negotiation.status === 'timeout' && '交渉タイムアウト'}
          </div>
          <div style={{ fontSize: 13, color: '#888' }}>
            {negotiation.status === 'accepted'
              ? `${candidate.name}が入社を決めました。`
              : `${candidate.name}との交渉は終了しました。`
            }
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export { SalaryNegotiationPanel };
export default SalaryNegotiationPanel;
