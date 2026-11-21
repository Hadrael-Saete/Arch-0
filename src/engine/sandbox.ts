import { useGameStore } from "../store/gameStore";
import type { SkillId } from "../types/game";

export interface DeckApi {
  getTrace: () => number;
  getData: () => number;
  getRam: () => number;
  inject: () => boolean;
  log: (message: string) => void;
  scramble: () => boolean;
  sellData: (minAmount: number) => boolean;
  overclock: () => boolean;
  switchNode: (nodeId: string) => boolean;
}

type ScriptRunner = (deck: DeckApi) => void;

let runner: ScriptRunner | null = null;

function locked(skill: SkillId, level: number): never {
  const names: Record<SkillId, string> = {
    intrusion: "Intrusion",
    stealth: "Furtivité",
    cyberdeck: "Cyberdeck",
    brokerage: "Courtage",
    countermeasures: "Contre-Mesures",
  };
  throw new Error(`[VERROUILLÉ - Requiert ${names[skill]} Niv. ${level}]`);
}

function createDeckApi(): DeckApi {
  const store = useGameStore.getState();
  return {
    getTrace: () => useGameStore.getState().trace,
    getData: () => useGameStore.getState().data,
    getRam: () => useGameStore.getState().ramUsed,
    inject: () => useGameStore.getState().injection(),
    log: (message) => useGameStore.getState().addLog(`[SCRIPT] ${String(message)}`, "info"),
    scramble: () => {
      if (store.skills.stealth.level < 2) locked("stealth", 2);
      return useGameStore.getState().jam();
    },
    sellData: (minAmount) => {
      if (store.skills.brokerage.level < 2) locked("brokerage", 2);
      if (!Number.isFinite(minAmount) || minAmount < 0) throw new Error("sellData: minAmount doit être un nombre positif.");
      const state = useGameStore.getState();
      if (state.data < minAmount) return false;
      return state.sell();
    },
    overclock: () => {
      if (store.skills.cyberdeck.level < 3) locked("cyberdeck", 3);
      return useGameStore.getState().overclock();
    },
    switchNode: (nodeId) => {
      if (store.skills.intrusion.level < 3) locked("intrusion", 3);
      return useGameStore.getState().connect(nodeId);
    },
  };
}

export function compileScript(code: string): void {
  try {
    if (!/\bfunction\s+onTick\s*\(\s*deck\s*\)/.test(code)) {
      throw new Error("Structure attendue: function onTick(deck) { ... }");
    }
    const forbidden = /\b(window|document|globalThis|self|fetch|XMLHttpRequest|import|require|eval|Function|constructor|__proto__)\b/;
    if (forbidden.test(code)) {
      throw new Error("Code bridé refusé: API globale interdite.");
    }
    const factory = new Function(`${code}\n; return onTick;`) as () => ScriptRunner;
    runner = factory();
  } catch (error) {
    runner = null;
    throw error;
  }
}

export function executeScript(): string | null {
  if (!runner) return "SCRIPT INEXÉCUTABLE";
  try {
    runner(createDeckApi());
    useGameStore.getState().gainXp("cyberdeck", 1.5);
    return null;
  } catch (error) {
    runner = null;
    const message = error instanceof Error ? error.message : String(error);
    useGameStore.getState().addLog(`[ERR_HALT] ${message}`, "danger");
    return message;
  }
}

export function stopScript(): void {
  runner = null;
}
