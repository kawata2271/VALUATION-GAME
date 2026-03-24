import { RoleInfo, EmployeeRole } from '../types';

export const roles: Record<EmployeeRole, RoleInfo> = {
  engineer_backend: { role: 'engineer_backend', nameJa: 'バックエンドエンジニア', category: 'エンジニア', baseSalary: 120000 },
  engineer_frontend: { role: 'engineer_frontend', nameJa: 'フロントエンドエンジニア', category: 'エンジニア', baseSalary: 120000 },
  engineer_sre: { role: 'engineer_sre', nameJa: 'SRE/インフラ', category: 'エンジニア', baseSalary: 150000 },
  engineer_data: { role: 'engineer_data', nameJa: 'データエンジニア', category: 'エンジニア', baseSalary: 130000 },
  sales_sdr: { role: 'sales_sdr', nameJa: 'SDR（インサイドセールス）', category: 'セールス', baseSalary: 80000 },
  sales_ae: { role: 'sales_ae', nameJa: 'AE（アカウントエグゼクティブ）', category: 'セールス', baseSalary: 100000 },
  sales_se: { role: 'sales_se', nameJa: 'SE（ソリューションエンジニア）', category: 'セールス', baseSalary: 110000 },
  cs_support: { role: 'cs_support', nameJa: 'テクニカルサポート', category: 'CS', baseSalary: 70000 },
  cs_csm: { role: 'cs_csm', nameJa: 'CSM', category: 'CS', baseSalary: 80000 },
  cs_onboarding: { role: 'cs_onboarding', nameJa: 'オンボーディング', category: 'CS', baseSalary: 75000 },
  marketing_content: { role: 'marketing_content', nameJa: 'コンテンツマーケ', category: 'マーケティング', baseSalary: 90000 },
  marketing_growth: { role: 'marketing_growth', nameJa: 'グロースハック', category: 'マーケティング', baseSalary: 100000 },
  marketing_brand: { role: 'marketing_brand', nameJa: 'ブランド/PR', category: 'マーケティング', baseSalary: 90000 },
  marketing_event: { role: 'marketing_event', nameJa: 'イベントマーケ', category: 'マーケティング', baseSalary: 85000 },
  pm: { role: 'pm', nameJa: 'プロダクトマネージャー', category: 'PM', baseSalary: 110000 },
  cto: { role: 'cto', nameJa: 'CTO', category: '経営層', baseSalary: 200000, unlockCondition: 'エンジニア3人以上' },
  cfo: { role: 'cfo', nameJa: 'CFO', category: '経営層', baseSalary: 180000, unlockCondition: '調達実績1回以上' },
  coo: { role: 'coo', nameJa: 'COO', category: '経営層', baseSalary: 190000, unlockCondition: 'チーム15人以上' },
  vp_sales: { role: 'vp_sales', nameJa: 'VP of Sales', category: '経営層', baseSalary: 170000, unlockCondition: 'セールス3人以上' },
};

const firstNames = [
  '太郎', '花子', '健一', '美咲', '大輝', '結衣', '翔太', '愛',
  '陸', '杏', '蓮', '葵', '悠真', 'さくら', '陽菜', '拓海',
  'Alex', 'Jordan', 'Morgan', 'Taylor', 'Casey', 'Robin', 'Sam', 'Jamie',
];

const lastNames = [
  '佐藤', '鈴木', '田中', '渡辺', '伊藤', '山本', '中村', '小林',
  '加藤', '吉田', '山田', '松本', '井上', '木村', '林', '清水',
  'Chen', 'Kim', 'Park', 'Smith', 'Kumar', 'Singh', 'Lee', 'Wang',
];

export function generateName(): string {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${last} ${first}`;
}
