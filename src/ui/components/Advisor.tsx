import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameState } from '../../engine/types';
import { t } from '../../engine/data/i18n';

interface Props {
  state: GameState;
}

interface Advice {
  priority: 'critical' | 'high' | 'medium' | 'low';
  icon: string;
  title: string;
  detail: string;
}

function generateAdvice(s: GameState): Advice[] {
  const advice: Advice[] = [];
  const runway = s.burn > 0 ? Math.floor(s.cash / s.burn) : 999;
  const arr = s.mrr * 12;
  const engCount = s.employees.filter(e => e.role.startsWith('engineer_')).length;
  const hasFeatures = s.completedFeatures.length > 0;
  const ltvCac = s.cac > 0 && s.churnRate > 0 ? (s.arpu / (s.churnRate / 100)) / s.cac : 0;

  // Critical: runway
  if (runway < 3 && runway > 0) {
    advice.push({
      priority: 'critical', icon: '🚨',
      title: 'ランウェイ危機',
      detail: `残り${runway}ヶ月で資金が尽きます。今すぐ資金調達するか、コスト削減が必要です。不要な人員の見直しも検討してください。`,
    });
  }

  // No engineers
  if (engCount === 0 && s.founderType !== 'engineer') {
    advice.push({
      priority: 'critical', icon: '👨‍💻',
      title: 'エンジニアがいません',
      detail: 'プロダクトを開発するにはエンジニアが必要です。まずバックエンドエンジニアを1人採用しましょう。',
    });
  }

  // No product
  if (!hasFeatures && s.month >= 2) {
    advice.push({
      priority: 'high', icon: '🔧',
      title: 'まだ機能がリリースされていません',
      detail: '「開発」パネルから「基本機能」の開発を開始してください。機能がないと顧客を獲得できません。',
    });
  }

  // PMF not achieved
  if (!s.pmfAchieved && s.month >= 6) {
    const coreCount = s.completedFeatures.filter(cf => cf.featureId.startsWith('core_')).length;
    advice.push({
      priority: 'high', icon: '🎯',
      title: 'PMF未達成',
      detail: `PMF達成にはコア機能2つ以上(現在${coreCount})、顧客10社以上(現在${s.customers})、MRR $5K以上(現在$${s.mrr.toFixed(0)})が必要です。`,
    });
  }

  // Tech debt high
  if (s.techDebt > 60) {
    advice.push({
      priority: 'high', icon: '⚠️',
      title: '技術負債が危険水準',
      detail: `技術負債${s.techDebt.toFixed(0)}/100。開発速度が大幅に低下しています。「開発」パネルから技術負債スプリントを実行してください。`,
    });
  }

  // Morale low
  if (s.morale < 40 && s.employees.length > 0) {
    advice.push({
      priority: 'high', icon: '😰',
      title: 'チーム士気が低下',
      detail: '士気の低下は退職や生産性低下を招きます。原因を分析し、オフサイトの開催やチーム体制の見直しを検討してください。',
    });
  }

  // Should hire sales
  if (s.pmfAchieved && s.employees.filter(e => e.role.startsWith('sales_')).length === 0) {
    advice.push({
      priority: 'medium', icon: '📣',
      title: 'セールスチームの検討',
      detail: 'PMF達成後は顧客獲得を加速するフェーズです。SDR(インサイドセールス)の採用を検討してください。',
    });
  }

  // Should hire CS
  if (s.customers > 20 && s.employees.filter(e => e.role.startsWith('cs_')).length === 0) {
    advice.push({
      priority: 'medium', icon: '🤝',
      title: 'カスタマーサクセスの検討',
      detail: `顧客${s.customers}社に対してCSがいません。チャーン率${s.churnRate.toFixed(1)}%を改善するためにCS採用を検討してください。`,
    });
  }

  // LTV/CAC ratio
  if (ltvCac > 0 && ltvCac < 1.5 && s.customers > 10) {
    advice.push({
      priority: 'high', icon: '📉',
      title: 'ユニットエコノミクスが悪化',
      detail: `LTV/CAC比率が${ltvCac.toFixed(1)}x（健全値は3.0x以上）。CACの削減かARPUの向上が急務です。`,
    });
  }

  // Ready for funding
  if (s.fundingRounds.length === 0 && s.month >= 3 && runway < 12) {
    advice.push({
      priority: 'medium', icon: '💰',
      title: '資金調達を検討',
      detail: 'プレシードラウンドでの資金調達を検討してください。「調達」パネルから実行できます。',
    });
  }

  // Ready for Series A
  if (s.pmfAchieved && s.mrr >= 50000 && !s.fundingRounds.some(r => r.type === 'seriesA')) {
    advice.push({
      priority: 'medium', icon: '🚀',
      title: 'シリーズAの検討',
      detail: 'PMF達成済み、MRR $50K以上。シリーズAラウンドの条件を満たしています。',
    });
  }

  // IPO ready
  if (arr >= 10_000_000 && s.employees.some(e => e.role === 'cfo')) {
    advice.push({
      priority: 'low', icon: '🔔',
      title: 'IPO可能',
      detail: 'ARR $10M以上、CFO在籍。IPOの条件を満たしています。「EXIT」パネルから実行可能です。',
    });
  }

  // Global expansion
  if (arr >= 5_000_000 && s.globalRegions.filter(r => r.unlocked).length <= 1) {
    advice.push({
      priority: 'low', icon: '🌍',
      title: 'グローバル展開の検討',
      detail: 'ARR $5M以上。新市場への展開で成長を加速できます。「戦略」パネルから展開可能です。',
    });
  }

  // Need PM
  if (s.employees.length > 8 && !s.employees.some(e => e.role === 'pm')) {
    advice.push({
      priority: 'medium', icon: '📋',
      title: 'PMの採用を推奨',
      detail: 'チームが10人を超えるとPM不在で士気が低下します。プロダクトマネージャーの採用を検討してください。',
    });
  }

  // Pricing
  if (s.pmfAchieved && s.pricingTiers.filter(t => t.enabled).length <= 1) {
    advice.push({
      priority: 'low', icon: '💹',
      title: 'プランティアの追加',
      detail: '「営業」パネルからProプランやEnterpriseプランを追加すると、アップセル機会が増加しNDRが向上します。',
    });
  }

  return advice.sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.priority] - order[b.priority];
  });
}

const priorityColors = {
  critical: '#ef4444',
  high: '#f59e0b',
  medium: '#6366f1',
  low: '#00c896',
};

export const Advisor: React.FC<Props> = ({ state }) => {
  const [open, setOpen] = useState(false);
  const advice = open ? generateAdvice(state) : [];

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 16, right: 16,
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          border: 'none', borderRadius: 12,
          padding: '10px 16px', fontSize: 13, fontWeight: 600,
          color: '#fff', cursor: 'pointer', zIndex: 50,
          boxShadow: '0 4px 15px rgba(99,102,241,0.4)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        {t('advisor.btn')}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', bottom: 60, right: 16,
              width: 340, maxHeight: '60vh', overflow: 'auto',
              background: '#12121f', borderRadius: 12,
              border: '1px solid rgba(99,102,241,0.3)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              zIndex: 50, padding: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h4 style={{ margin: 0, fontSize: 14, color: '#6366f1' }}>{t('advisor.title')}</h4>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: 16 }}
              >
                ✕
              </button>
            </div>

            {advice.length === 0 ? (
              <div style={{ color: '#888', fontSize: 12, textAlign: 'center', padding: 20 }}>
                現在、特にアドバイスはありません。順調です！
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {advice.map((a, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                    padding: '10px 12px',
                    borderLeft: `3px solid ${priorityColors[a.priority]}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 16 }}>{a.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{a.title}</span>
                      <span style={{
                        fontSize: 9, padding: '1px 5px', borderRadius: 3,
                        background: `${priorityColors[a.priority]}22`,
                        color: priorityColors[a.priority],
                        marginLeft: 'auto',
                      }}>
                        {a.priority}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: '#999', lineHeight: 1.6 }}>
                      {a.detail}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
