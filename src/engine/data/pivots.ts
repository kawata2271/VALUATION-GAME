import { PivotType } from '../types';

export interface PivotTypeInfo {
  type: PivotType;
  nameJa: string;
  description: string;
  costRate: number;
  teamLossRate: number;
  mrrRetainRate: number;
  devMonths: number;
  techCarryOver: number;
  brandCarryOver: number;
  example: string;
}

export const pivotTypes: PivotTypeInfo[] = [
  {
    type: 'zoom_in', nameJa: 'ズームイン',
    description: '機能の一部を独立プロダクト化する',
    costRate: 0.15, teamLossRate: 0.10, mrrRetainRate: 0.40, devMonths: 2,
    techCarryOver: 0.80, brandCarryOver: 0.60,
    example: '多機能CRM → チャットボット特化',
  },
  {
    type: 'zoom_out', nameJa: 'ズームアウト',
    description: '単機能を総合プラットフォーム化する',
    costRate: 0.30, teamLossRate: 0.10, mrrRetainRate: 0.70, devMonths: 4,
    techCarryOver: 0.90, brandCarryOver: 0.70,
    example: 'チャットツール → ワークスペース統合',
  },
  {
    type: 'customer_segment', nameJa: '顧客セグメント変更',
    description: 'ターゲット顧客層を変更する',
    costRate: 0.20, teamLossRate: 0.15, mrrRetainRate: 0.30, devMonths: 3,
    techCarryOver: 0.70, brandCarryOver: 0.40,
    example: 'B2C → B2B、SMB → エンタープライズ',
  },
  {
    type: 'channel', nameJa: 'チャネル変更',
    description: '販売チャネルを変更する',
    costRate: 0.15, teamLossRate: 0.10, mrrRetainRate: 0.60, devMonths: 2,
    techCarryOver: 0.85, brandCarryOver: 0.50,
    example: '直販 → パートナー経由',
  },
  {
    type: 'revenue_model', nameJa: '収益モデル変更',
    description: 'マネタイズ方法を変更する',
    costRate: 0.25, teamLossRate: 0.10, mrrRetainRate: 0.20, devMonths: 3,
    techCarryOver: 0.80, brandCarryOver: 0.60,
    example: 'サブスク → 従量課金',
  },
  {
    type: 'tech_architecture', nameJa: '技術基盤刷新',
    description: '技術基盤を全面的に刷新する',
    costRate: 0.40, teamLossRate: 0.20, mrrRetainRate: 0.80, devMonths: 5,
    techCarryOver: 0.30, brandCarryOver: 0.90,
    example: 'オンプレ → クラウド',
  },
  {
    type: 'platform', nameJa: 'プラットフォーム化',
    description: 'アプリをプラットフォーム/マーケットプレイスに拡張する',
    costRate: 0.35, teamLossRate: 0.15, mrrRetainRate: 0.60, devMonths: 5,
    techCarryOver: 0.70, brandCarryOver: 0.80,
    example: '単体ツール → API/マーケットプレイス',
  },
  {
    type: 'domain_change', nameJa: '事業ドメイン完全変更',
    description: 'まったく別の事業領域に転換する',
    costRate: 0.60, teamLossRate: 0.40, mrrRetainRate: 0.00, devMonths: 6,
    techCarryOver: 0.20, brandCarryOver: 0.10,
    example: 'ゲーム → チャットツール（Slack型）',
  },
];
