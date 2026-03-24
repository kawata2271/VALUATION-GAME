import { GameState } from '../types';
import { Rival } from './rivals';

interface NewsItem {
  text: string;
  type: 'market' | 'rival' | 'industry' | 'tech';
}

const marketNews = [
  'VC投資額が前年比{dir}。SaaS市場への影響は限定的か',
  'テック株が{dir}。投資家心理に影響',
  'リモートワーク導入率が{pct}%に到達',
  'AIスタートアップへの投資が過去最高を記録',
  'サイバーセキュリティ市場が急成長',
  'クラウド支出が前年比30%増加',
  'SaaS企業のIPO件数が{dir}',
  'エンジニア採用市場が{dir}',
  'データプライバシー規制が世界的に強化',
  'ノーコード/ローコードの導入が加速',
  'サブスクリプション疲れが話題に',
  'PLG(Product-Led Growth)が主流戦略に',
  'バーティカルSaaSへの注目が高まる',
  'AI活用SaaSの評価倍率が2倍に',
  'SaaS企業の平均NDRが{pct}%に',
];

const industryHeadlines = [
  '大手テック企業が{n}人のレイオフを発表',
  'Y Combinator最新バッチに{n}社が参加',
  'シリコンバレーの家賃が{dir}',
  'GPT-{n} が発表。SaaS業界に衝撃',
  'スタートアップの平均バーンマルチプルが{n}xに',
  'Rule of 40を達成するSaaS企業が増加',
  'SaaS業界の平均チャーン率は{pct}%',
  'エンタープライズSaaSの契約サイクルが長期化',
  'マイクロSaaSが注目トレンドに',
  'カスタマーサクセスの重要性が再認識',
];

function rivalNews(rivals: Rival[]): string[] {
  const active = rivals.filter(r => r.status === 'active');
  const news: string[] = [];

  for (const r of active) {
    if (r.mrr > 100000) {
      news.push(`${r.name}が急成長中。MRR $${(r.mrr / 1000).toFixed(0)}K突破`);
    }
    if (r.funding > 5000000) {
      news.push(`${r.name}が大型調達を完了した模様`);
    }
  }

  const dead = rivals.filter(r => r.status === 'dead');
  for (const r of dead) {
    news.push(`${r.name}がサービス終了を発表`);
  }

  const acquired = rivals.filter(r => r.status === 'acquired');
  for (const r of acquired) {
    news.push(`${r.name}が大手企業に買収された`);
  }

  return news;
}

export function generateNewsFeed(state: GameState, rivals: Rival[]): string[] {
  const feed: string[] = [];

  // Market news
  const mkt = marketNews[Math.floor(Math.random() * marketNews.length)];
  feed.push(mkt
    .replace('{dir}', Math.random() > 0.5 ? '上昇' : '下落')
    .replace('{pct}', `${Math.floor(30 + Math.random() * 70)}`)
    .replace('{n}', `${Math.floor(100 + Math.random() * 900)}`)
  );

  // Industry
  const ind = industryHeadlines[Math.floor(Math.random() * industryHeadlines.length)];
  feed.push(ind
    .replace('{dir}', Math.random() > 0.5 ? '上昇' : '下落')
    .replace('{pct}', `${(2 + Math.random() * 5).toFixed(1)}`)
    .replace('{n}', `${Math.floor(2 + Math.random() * 8)}`)
  );

  // Rival news
  const rn = rivalNews(rivals);
  if (rn.length > 0) {
    feed.push(rn[Math.floor(Math.random() * rn.length)]);
  }

  // Player-specific context
  if (state.mrr * 12 > 1000000) {
    feed.push(`${state.companyName}がARR $${((state.mrr * 12) / 1e6).toFixed(1)}Mに到達。業界アナリストが注目`);
  }
  if (state.nps > 70) {
    feed.push(`${state.companyName}の顧客満足度が業界平均を大きく上回る`);
  }

  return feed;
}
