import React, { useState } from 'react';

const steps = [
  {
    title: 'VALUATION GAME へようこそ！',
    text: 'あなたはSaaS企業の創業者です。\n会社を成長させ、最終的にIPOやM&Aでエグジットを目指しましょう。',
  },
  {
    title: 'ゲームの流れ',
    text: '「次の月へ進む」ボタンで1ヶ月ずつゲームが進行します。\n各月で収益計算・顧客獲得・イベント判定が行われます。',
  },
  {
    title: 'まず機能を開発しよう',
    text: '「🔧 開発」パネルから機能を開発しましょう。\n最低2つのコア機能を完成させるとPMF（Product-Market Fit）達成です。\nエンジニア創業者以外は、まずエンジニアを雇う必要があります。',
  },
  {
    title: 'チームを作ろう',
    text: '「👥 チーム」パネルから社員を採用できます。\nエンジニアは開発速度、セールスは顧客獲得、CSはチャーン低下に貢献します。',
  },
  {
    title: '資金を調達しよう',
    text: '「💰 調達」パネルで投資家から資金調達ができます。\nただし株式が希薄化するので、タイミングが重要です。\nランウェイ（残り何ヶ月分のキャッシュがあるか）に注意！',
  },
  {
    title: 'KPIを見よう',
    text: 'ダッシュボード上部のKPIに注目してください。\n・MRR（月間収益）を伸ばす\n・チャーン率を下げる\n・技術負債を溜めすぎない\nこの3つが成功の鍵です。',
  },
  {
    title: 'イベントに対応しよう',
    text: 'ランダムにイベントが発生します。\n選択肢によって結果が変わるので、状況を見て判断しましょう。',
  },
  {
    title: 'エグジットを目指そう！',
    text: 'ARRが$10M以上でIPO可能、$1M以上でM&A可能です。\nいつでも「継続経営」で終了もできます。\n\nそれでは、SaaS経営の世界へ飛び込みましょう！',
  },
];

interface Props {
  onComplete: () => void;
}

export const Tutorial: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
    }}>
      <div style={{
        background: '#12121f', borderRadius: 12, padding: 28,
        maxWidth: 460, width: '90%',
        border: '1px solid rgba(0,200,150,0.2)',
        boxShadow: '0 0 40px rgba(0,200,150,0.1)',
      }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i <= step ? '#00c896' : 'rgba(255,255,255,0.1)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        <div style={{ fontSize: 11, color: '#00c896', marginBottom: 6 }}>
          {step + 1} / {steps.length}
        </div>

        <h3 style={{ margin: '0 0 12px', fontSize: 18, color: '#fff' }}>
          {current.title}
        </h3>

        <p style={{ color: '#bbb', fontSize: 14, lineHeight: 1.8, whiteSpace: 'pre-line', margin: '0 0 24px' }}>
          {current.text}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={onComplete}
            style={{
              background: 'transparent', border: 'none',
              color: '#666', fontSize: 12, cursor: 'pointer', padding: '8px 16px',
            }}
          >
            スキップ
          </button>

          <div style={{ display: 'flex', gap: 8 }}>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6,
                  padding: '8px 20px', color: '#888', cursor: 'pointer', fontSize: 13,
                }}
              >
                戻る
              </button>
            )}
            <button
              onClick={() => isLast ? onComplete() : setStep(step + 1)}
              style={{
                background: isLast ? '#00c896' : 'rgba(0,200,150,0.15)',
                border: isLast ? 'none' : '1px solid #00c896', borderRadius: 6,
                padding: '8px 24px', color: isLast ? '#000' : '#00c896',
                cursor: 'pointer', fontSize: 13, fontWeight: 600,
              }}
            >
              {isLast ? 'ゲーム開始！' : '次へ'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
