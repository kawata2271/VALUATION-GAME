// ===== ヘルプツールチップ =====
// 採用システムの各要素にホバーで説明を表示

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  text: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
}

export const HelpTooltip: React.FC<Props> = ({
  text,
  children,
  position = 'top',
  maxWidth = 220,
}) => {
  const [show, setShow] = useState(false);

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 },
    bottom: { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 },
    left: { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: 6 },
    right: { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: 6 },
  };

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'help' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              ...positionStyles[position],
              background: 'rgba(15,15,25,0.95)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 10,
              color: '#ccc',
              lineHeight: 1.5,
              maxWidth,
              width: 'max-content',
              zIndex: 100,
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              whiteSpace: 'normal',
            }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

// ===== ヘルプアイコン付きツールチップ =====

interface HelpIconProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const HelpIcon: React.FC<HelpIconProps> = ({ text, position = 'top' }) => (
  <HelpTooltip text={text} position={position}>
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: 'rgba(99,102,241,0.15)',
      color: '#6366f1',
      fontSize: 9,
      fontWeight: 700,
      marginLeft: 4,
      flexShrink: 0,
    }}>
      ?
    </span>
  </HelpTooltip>
);

// ===== 採用システムのヘルプテキスト定数 =====

export const HELP_TEXTS = {
  interestLevel: '候補者の入社意欲。80以上で承諾ほぼ確実、20以下で離脱リスク大。面談の選択や企業の評価額で変動します。',
  availableTurns: 'あと何ターンで候補者が他社に行ってしまうか。0になると自動的に離脱します。',
  abilityMasking: '面談を重ねるごとに候補者の能力が明らかになります。レンジ表示は推定値で、確定値は最終面接以降に判明します。',
  specialTrait: '候補者の隠れた特性。最終面接で50%の確率で判明します。入社後のパフォーマンスに大きく影響します。',
  hiddenBestFit: '候補者の「真の適職」。応募職種と異なる場合、適職に配置すると能力1.3〜1.5倍のボーナス。',
  sRankRule: 'Sランク人材は初回オファーを必ず保留します。2回目以降のオファーで興味度に応じた判定が行われます。',
  specialist: 'スペシャリストは低ランクでも1-2つの能力が突出しています。面談を深めないと判明しにくいです。',
  negotiation: '給与交渉は最大3ラウンド。SOや福利厚生で年収ギャップを埋められます。市場相場の75%以下は即拒否。',
  employerBrand: '採用ブランドスコア。高いほど優秀な候補者が集まりやすく、初期興味度にボーナスが付きます。',
  interviewSlots: 'HR（COO）の人数に応じた同時面談可能数。基本3枠、COO1名につき+2枠。',
  channelCost: 'チャネルごとのコストは1回の利用あたり。SNSブランディングは長期投資で、全チャネルの質を底上げします。',
} as const;

export default HelpTooltip;
