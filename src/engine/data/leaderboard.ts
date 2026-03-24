const LB_KEY = 'valuation_game_leaderboard';

export interface LeaderboardEntry {
  companyName: string;
  vertical: string;
  founderType: string;
  score: number;
  grade: string;
  exitType: string;
  month: number;
  mrr: number;
  valuation: number;
  date: string;
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LB_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}

export function addToLeaderboard(entry: LeaderboardEntry): void {
  try {
    const lb = getLeaderboard();
    lb.push(entry);
    lb.sort((a, b) => b.score - a.score);
    const top20 = lb.slice(0, 20);
    localStorage.setItem(LB_KEY, JSON.stringify(top20));
  } catch {
    // ignore
  }
}

export function clearLeaderboard(): void {
  localStorage.removeItem(LB_KEY);
}
