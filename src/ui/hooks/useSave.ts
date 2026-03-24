import { GameState } from '../../engine/types';

const SAVE_KEY = 'valuation_game_save';
const SLOTS_KEY = 'valuation_game_slots';

export interface SaveSlot {
  id: number;
  companyName: string;
  month: number;
  mrr: number;
  savedAt: string;
}

export function autoSave(state: GameState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // storage full etc
  }
}

export function loadAutoSave(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function clearAutoSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function saveToSlot(state: GameState, slotId: number): void {
  try {
    localStorage.setItem(`${SLOTS_KEY}_${slotId}`, JSON.stringify(state));
    const slots = getSaveSlots();
    const entry: SaveSlot = {
      id: slotId,
      companyName: state.companyName,
      month: state.month,
      mrr: state.mrr,
      savedAt: new Date().toISOString(),
    };
    const idx = slots.findIndex(s => s.id === slotId);
    if (idx >= 0) slots[idx] = entry;
    else slots.push(entry);
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
  } catch {
    // ignore
  }
}

export function loadFromSlot(slotId: number): GameState | null {
  try {
    const raw = localStorage.getItem(`${SLOTS_KEY}_${slotId}`);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch {
    return null;
  }
}

export function getSaveSlots(): SaveSlot[] {
  try {
    const raw = localStorage.getItem(SLOTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SaveSlot[];
  } catch {
    return [];
  }
}

export function deleteSlot(slotId: number): void {
  localStorage.removeItem(`${SLOTS_KEY}_${slotId}`);
  const slots = getSaveSlots().filter(s => s.id !== slotId);
  localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
}
