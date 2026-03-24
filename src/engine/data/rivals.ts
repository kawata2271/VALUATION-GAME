import { VerticalId, RivalCompany } from '../types';

export type Rival = RivalCompany;

const rivalNames: Record<VerticalId, string[]> = {
  crm: ['SalesForce Jr.', 'PipelinePro', 'DealFlow', 'RelateIQ'],
  hrtech: ['PeopleOS', 'TalentHub', 'HireWave', 'TeamPulse'],
  fintech: ['PayStack', 'LedgerAI', 'CashFlow+', 'FinVault'],
  devtools: ['CodeShip', 'DevPilot', 'StackForge', 'BuildKit'],
  healthtech: ['MedCloud', 'CareSync', 'HealthBridge', 'VitalOS'],
  edtech: ['LearnPath', 'ClassHub', 'EduFlow', 'SkillForge'],
  spacetech: ['OrbitOS', 'AstroData', 'LaunchPad AI'],
  web3: ['ChainStack', 'TokenFlow', 'Web3Kit'],
  cleantech: ['GreenOps', 'EcoTrack', 'CarbonZero'],
};

export function generateRivals(vertical: VerticalId, count: number = 3): Rival[] {
  const names = rivalNames[vertical] || ['Competitor A', 'Competitor B', 'Competitor C'];
  return names.slice(0, count).map((name, i) => ({
    name,
    vertical,
    mrr: 0,
    customers: 0,
    funding: 50000 + Math.random() * 200000,
    founded: Math.floor(Math.random() * 6),
    aggression: 0.3 + Math.random() * 0.5,
    status: 'active',
  }));
}

export function simulateRivals(rivals: Rival[], month: number, playerMrr: number): Rival[] {
  return rivals.map(r => {
    if (r.status !== 'active') return r;

    const updated = { ...r };
    const age = month - r.founded;
    if (age < 0) return updated;

    // Growth based on aggression and randomness
    const growthRate = 0.08 + r.aggression * 0.12 + (Math.random() - 0.3) * 0.1;
    const baseGrowth = Math.max(1, updated.customers) * growthRate;
    updated.customers = Math.max(0, Math.floor(updated.customers + baseGrowth + (age < 6 ? 1 : 2)));
    updated.mrr = updated.customers * (30 + Math.random() * 120);

    // Funding rounds
    if (age === 6 && Math.random() < 0.7) updated.funding += 500000 + Math.random() * 2000000;
    if (age === 18 && Math.random() < 0.5) updated.funding += 5000000 + Math.random() * 15000000;
    if (age === 30 && Math.random() < 0.3) updated.funding += 20000000 + Math.random() * 50000000;

    // Death chance (small companies die)
    if (age > 12 && updated.mrr < 5000 && Math.random() < 0.05) {
      updated.status = 'dead';
    }

    // Acquired chance
    if (age > 18 && updated.mrr > 50000 && Math.random() < 0.02) {
      updated.status = 'acquired';
    }

    return updated;
  });
}
