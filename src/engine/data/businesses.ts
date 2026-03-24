import { BusinessDomain, BusinessDomainId } from '../types';

export const businessDomains: Record<BusinessDomainId, BusinessDomain> = {
  crm:          { id: 'crm',          nameJa: 'CRM（顧客管理）',       tam: 8000, growthRate: 12, avgArpu: 150, avgChurn: 3.5, competitorCount: 50, difficulty: 3 },
  hrtech:       { id: 'hrtech',       nameJa: 'HR Tech（人事テック）',  tam: 4500, growthRate: 15, avgArpu: 120, avgChurn: 2.5, competitorCount: 30, difficulty: 2 },
  fintech:      { id: 'fintech',      nameJa: 'FinTech（金融テック）',  tam: 12000, growthRate: 20, avgArpu: 300, avgChurn: 2.0, competitorCount: 40, difficulty: 4 },
  devtools:     { id: 'devtools',     nameJa: 'DevTools（開発者ツール）', tam: 3500, growthRate: 18, avgArpu: 50, avgChurn: 4.0, competitorCount: 60, difficulty: 3 },
  healthtech:   { id: 'healthtech',   nameJa: 'HealthTech（医療テック）', tam: 6000, growthRate: 22, avgArpu: 500, avgChurn: 1.5, competitorCount: 20, difficulty: 5 },
  edtech:       { id: 'edtech',       nameJa: 'EdTech（教育テック）',   tam: 3000, growthRate: 14, avgArpu: 30, avgChurn: 5.0, competitorCount: 45, difficulty: 2 },
  legaltech:    { id: 'legaltech',    nameJa: 'LegalTech（法務テック）', tam: 2000, growthRate: 25, avgArpu: 200, avgChurn: 2.0, competitorCount: 15, difficulty: 3 },
  martech:      { id: 'martech',      nameJa: 'MarTech（マーケテック）', tam: 5000, growthRate: 16, avgArpu: 100, avgChurn: 4.5, competitorCount: 55, difficulty: 3 },
  logitech:     { id: 'logitech',     nameJa: 'LogiTech（物流テック）',  tam: 3000, growthRate: 18, avgArpu: 250, avgChurn: 2.5, competitorCount: 20, difficulty: 3 },
  foodtech:     { id: 'foodtech',     nameJa: 'FoodTech（フードテック）', tam: 2500, growthRate: 20, avgArpu: 80, avgChurn: 5.0, competitorCount: 35, difficulty: 3 },
  proptech:     { id: 'proptech',     nameJa: 'PropTech（不動産テック）', tam: 4000, growthRate: 12, avgArpu: 300, avgChurn: 2.0, competitorCount: 25, difficulty: 4 },
  agritech:     { id: 'agritech',     nameJa: 'AgriTech（農業テック）',  tam: 1500, growthRate: 15, avgArpu: 150, avgChurn: 3.0, competitorCount: 10, difficulty: 4 },
  insurtech:    { id: 'insurtech',    nameJa: 'InsurTech（保険テック）', tam: 3500, growthRate: 18, avgArpu: 200, avgChurn: 2.0, competitorCount: 20, difficulty: 4 },
  retailtech:   { id: 'retailtech',   nameJa: 'RetailTech（小売テック）', tam: 5500, growthRate: 14, avgArpu: 120, avgChurn: 3.5, competitorCount: 40, difficulty: 3 },
  securitytech: { id: 'securitytech', nameJa: 'SecurityTech（セキュリティ）', tam: 4000, growthRate: 25, avgArpu: 250, avgChurn: 2.0, competitorCount: 30, difficulty: 4 },
  ai_saas:      { id: 'ai_saas',      nameJa: 'AI SaaS',              tam: 8000, growthRate: 35, avgArpu: 200, avgChurn: 3.0, competitorCount: 70, difficulty: 4 },
  vertical_saas:{ id: 'vertical_saas',nameJa: 'Vertical SaaS（業界特化）', tam: 2000, growthRate: 20, avgArpu: 300, avgChurn: 2.0, competitorCount: 10, difficulty: 3 },
  spacetech:    { id: 'spacetech',    nameJa: '宇宙テック',            tam: 2500, growthRate: 30, avgArpu: 2000, avgChurn: 1.0, competitorCount: 5, difficulty: 5 },
  web3:         { id: 'web3',         nameJa: 'Web3',                 tam: 4000, growthRate: 40, avgArpu: 80, avgChurn: 6.0, competitorCount: 50, difficulty: 4 },
  cleantech:    { id: 'cleantech',    nameJa: 'クリーンテック',         tam: 5000, growthRate: 22, avgArpu: 400, avgChurn: 2.0, competitorCount: 15, difficulty: 4 },
};
