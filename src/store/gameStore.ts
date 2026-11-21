import { create } from "zustand";
import { persist } from "zustand/middleware";
import { networkNodes } from "../data/nodes";
import { cyberdeckUpgrades } from "../data/upgrades";
import { demons } from "../data/demons";
import {
  getCooldownMultiplier,
  getExtractionMultiplier,
  getMaxRam,
  getPurgeLossMultiplier,
  getSellRate,
  getTraceMultiplier,
  getBandwidth,
  getDemonCount,
  getMilestoneMultiplier,
  getFragmentChance,
  nextLevelXp,
} from "../engine/gameCalculations";
import type { GameState, SkillId, Skills, TerminalLog } from "../types/game";

const STORAGE_KEY = "trace-0-save";

function createInitialSkills(): Skills {
  return {
    intrusion: { level: 1, xp: 0, nextLevelXp: 100 },
    stealth: { level: 1, xp: 0, nextLevelXp: 100 },
    cyberdeck: { level: 1, xp: 0, nextLevelXp: 100 },
    brokerage: { level: 1, xp: 0, nextLevelXp: 100 },
    countermeasures: { level: 1, xp: 0, nextLevelXp: 100 },
  };
}

export const DEFAULT_SCRIPT = `function onTick(deck) {
  // Complète les fonctions autorisées par tes compétences.
  // deck.log("Routine active");

  if (deck.getTrace() >= 70) {
    // deck.scramble();
  }

  // deck.sellData(100);
  // deck.inject();
}
`;

function loadPersistedFallback(): Partial<GameState> | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: Partial<GameState> };
    return parsed.state ?? null;
  } catch {
    return null;
  }
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => {
      const base: GameState = {
        data: 0,
        eddies: 0,
        fragments: 0,
        bandwidth: 10,
        trace: 0,
        skills: createInitialSkills(),
        activeNodeId: null,
        connected: false,
        upgrades: {},
        demons: {},
        scriptCode: DEFAULT_SCRIPT,
        scriptStatus: "IDLE",
        phosphorColor: "green",
        ramUsed: 0,
        heat: 0,
        cooldowns: { injection: 0, jam: 0, sell: 0, overclock: 0 },
        overclockUntil: 0,
        purgeCooldownUntil: 0,
        lastTick: Date.now(),
        logs: [{ id: 1, time: "00:00", message: "Cyberdeck initialisé. Canal disponible.", kind: "info" }],
        logSequence: 1,
        flags: {},
        connect: (nodeId) => {
          const state = get();
          const node = networkNodes.find((candidate) => candidate.id === nodeId);
          if (!node) return false;
          if (state.skills.intrusion.level < node.requiredIntrusionLevel) {
            state.addLog(`Niveau Intrusion ${node.requiredIntrusionLevel} requis pour ${node.name}.`, "warning");
            return false;
          }
          set({ activeNodeId: nodeId, connected: true, ramUsed: 0 });
          state.addLog(`Connexion établie: ${node.name}.`, "info");
          return true;
        },
        disconnect: () => {
          const state = get();
          if (!state.connected) return;
          set({ connected: false, ramUsed: 0 });
          state.addLog("Connexion coupée. Trace en refroidissement.", "info");
        },
        injection: () => {
          const state = get();
          if (state.cooldowns.injection > 0 || state.purgeCooldownUntil > Date.now()) return false;
          if (state.ramUsed + 1 > getMaxRam(state)) return false;
          const gained = 8 * getExtractionMultiplier(state);
          const multiplier = getCooldownMultiplier(state);
          set({
            data: state.data + gained,
            trace: Math.min(100, state.trace + 3),
            ramUsed: state.ramUsed + 1,
            heat: Math.min(100, state.heat + 4),
            cooldowns: { ...state.cooldowns, injection: 2 * multiplier },
          });
          get().gainXp("intrusion", 14);
          get().gainXp("cyberdeck", 4);
          get().addLog(`Injection réussie: +${gained.toFixed(1)} données.`, "gain");
          return true;
        },
        jam: () => {
          const state = get();
          if (state.cooldowns.jam > 0 || state.purgeCooldownUntil > Date.now()) return false;
          if (state.ramUsed + 2 > getMaxRam(state)) return false;
          const reduction = 18 * (1 + state.skills.countermeasures.level * 0.02);
          const multiplier = getCooldownMultiplier(state);
          set({
            trace: Math.max(0, state.trace - reduction),
            ramUsed: state.ramUsed + 2,
            heat: Math.max(0, state.heat - 8),
            cooldowns: { ...state.cooldowns, jam: 8 * multiplier },
          });
          get().gainXp("stealth", 12);
          get().gainXp("countermeasures", 10);
          get().addLog(`Brouillage: -${reduction.toFixed(1)} % de trace.`, "gain");
          return true;
        },
        sell: () => {
          const state = get();
          if (state.cooldowns.sell > 0 || state.data < 1) return false;
          const conversion = getSellRate(state);
          const sold = Math.floor(state.data);
          const eddies = sold * conversion;
          const multiplier = getCooldownMultiplier(state);
          set({
            data: state.data - sold,
            eddies: state.eddies + eddies,
            cooldowns: { ...state.cooldowns, sell: 3 * multiplier },
          });
          get().gainXp("brokerage", 5 + sold * 0.08);
          get().addLog(`Données blanchies: ${sold.toFixed(0)} octets -> ${eddies.toFixed(1)} Eddies.`, "gain");
          return true;
        },
        overclock: () => {
          const state = get();
          if (state.cooldowns.overclock > 0 || state.purgeCooldownUntil > Date.now()) return false;
          if (state.ramUsed + 4 > getMaxRam(state)) return false;
          const now = Date.now();
          const multiplier = getCooldownMultiplier(state);
          set({
            ramUsed: state.ramUsed + 4,
            heat: Math.min(100, state.heat + 18),
            overclockUntil: now + 10_000,
            cooldowns: { ...state.cooldowns, overclock: 20 * multiplier },
          });
          get().gainXp("cyberdeck", 18);
          get().addLog("Overclock actif: extraction x2 pendant 10 secondes.", "warning");
          return true;
        },
        buyUpgrade: (upgradeId) => {
          const state = get();
          const upgrade = cyberdeckUpgrades.find((candidate) => candidate.id === upgradeId);
          if (!upgrade) return false;
          const level = state.upgrades[upgradeId] ?? 0;
          const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
          if (state.eddies < cost) return false;
          set({
            eddies: state.eddies - cost,
            upgrades: { ...state.upgrades, [upgradeId]: level + 1 },
          });
          get().gainXp("cyberdeck", 20);
          get().addLog(`Amélioration installée: ${upgrade.name} niveau ${level + 1}.`, "gain");
          return true;
        },
        buyDemon: (demonId) => {
          const state = get();
          const demon = demons.find((candidate) => candidate.id === demonId);
          if (!demon) return false;
          const level = state.demons[demonId] ?? 0;
          const cost = Math.floor(demon.baseCost * Math.pow(demon.costMultiplier, level));
          if (state.eddies < cost) return false;
          if (getDemonCount(state) >= getBandwidth(state)) return false;
          set({ eddies: state.eddies - cost, demons: { ...state.demons, [demonId]: level + 1 } });
          get().gainXp("cyberdeck", 8);
          get().addLog(`Démon installé: ${demon.name} niveau ${level + 1}.`, "gain");
          return true;
        },
        setScriptCode: (code) => set({ scriptCode: code }),
        setScriptStatus: (status) => set({ scriptStatus: status }),
        setPhosphorColor: (color) => set({ phosphorColor: color }),
        tick: (now, deltaSeconds) => {
          const state = get();
          if (deltaSeconds <= 0) return;
          let data = state.data;
          let fragments = state.fragments;
          let eddies = state.eddies;
          let trace = state.trace;
          let ramUsed = Math.max(0, state.ramUsed - deltaSeconds * 1.2);
          let heat = Math.max(0, state.heat - deltaSeconds * 1.8);
          const cooldowns = {
            injection: Math.max(0, state.cooldowns.injection - deltaSeconds),
            jam: Math.max(0, state.cooldowns.jam - deltaSeconds),
            sell: Math.max(0, state.cooldowns.sell - deltaSeconds),
            overclock: Math.max(0, state.cooldowns.overclock - deltaSeconds),
          };

          for (const demon of demons) {
            const level = state.demons[demon.id] ?? 0;
            if (level === 0) continue;
            const production = demon.baseProduction * level * getMilestoneMultiplier(level);
            if (demon.effect === "data") data += production * deltaSeconds;
            if (demon.effect === "intrusion") {
              data += production * deltaSeconds;
              get().gainXp("intrusion", 0.18 * level * getMilestoneMultiplier(level) * deltaSeconds);
            }
            if (demon.effect === "trace") trace = Math.max(0, trace - production * deltaSeconds);
            if (demon.effect === "fragments") fragments += production * deltaSeconds;
            if (demon.effect === "eddies" && data > 0) {
              const convertedData = Math.min(data, data * production * deltaSeconds);
              data -= convertedData;
              eddies += convertedData * getSellRate(state);
              get().gainXp("brokerage", production * 0.4 * deltaSeconds);
            }
          }

          if (state.connected && state.activeNodeId) {
            const node = networkNodes.find((candidate) => candidate.id === state.activeNodeId);
            if (node) {
              let dataRate = node.baseDataRate * getExtractionMultiplier(state);
              if (now < state.overclockUntil) dataRate *= 2;
              data += dataRate * deltaSeconds;

              let traceRate = node.baseTraceRate * getTraceMultiplier(state);
              if (now < state.overclockUntil) traceRate *= 1.65;
              trace = Math.min(100, trace + traceRate * deltaSeconds);

              get().gainXp("intrusion", node.xpReward * deltaSeconds);
              get().gainXp("stealth", state.trace > 65 ? 0.05 * deltaSeconds : 0.12 * deltaSeconds);
              get().gainXp("cyberdeck", 0.08 * deltaSeconds);
              if (Math.random() < getFragmentChance(state) * deltaSeconds) {
                fragments += 1;
                get().addLog("Fragment crypté récupéré pendant l'extraction.", "gain");
              }
            }
          } else {
            const counterReduction = state.skills.countermeasures.level * 0.006;
            trace = Math.max(0, trace - (1.4 + counterReduction) * deltaSeconds);
          }

          if (trace >= 100 && state.purgeCooldownUntil <= now) {
            set({ data, eddies, fragments, bandwidth: getBandwidth(state), trace: 100, ramUsed, heat, cooldowns, lastTick: now });
            get().purge();
            return;
          }
          set({ data, eddies, fragments, bandwidth: getBandwidth(state), trace, ramUsed, heat, cooldowns, lastTick: now });
        },
        purge: () => {
          const state = get();
          const now = Date.now();
          if (state.purgeCooldownUntil > now) return;
          const lost = state.data * getPurgeLossMultiplier(state);
          const cooldownMs = 15_000;
          set({
            data: state.data - lost,
            trace: 0,
            connected: false,
            activeNodeId: null,
            ramUsed: 0,
            overclockUntil: 0,
            purgeCooldownUntil: now + cooldownMs,
          });
          get().gainXp("countermeasures", 25);
          get().addLog(`PURGE: connexion coupée, ${lost.toFixed(1)} données perdues.`, "danger");
        },
        gainXp: (skillId, amount) => {
          const state = get();
          let skill = { ...state.skills[skillId] };
          skill.xp += amount;
          let leveled = false;
          while (skill.xp >= skill.nextLevelXp) {
            skill.xp -= skill.nextLevelXp;
            skill.level += 1;
            skill.nextLevelXp = nextLevelXp(skill.level);
            leveled = true;
          }
          set({ skills: { ...state.skills, [skillId]: skill } });
          if (leveled) {
            const names: Record<SkillId, string> = {
              intrusion: "Intrusion",
              stealth: "Furtivité",
              cyberdeck: "Cyberdeck",
              brokerage: "Courtage",
              countermeasures: "Contre-Mesures",
            };
            get().addLog(`${names[skillId]} monte au niveau ${skill.level}.`, "gain");
          }
        },
        addLog: (message, kind = "info") => {
          const state = get();
          const id = state.logSequence + 1;
          const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          const next: TerminalLog = { id, time, message, kind };
          set({ logSequence: id, logs: [next, ...state.logs].slice(0, 80) });
        },
        setFlag: (key, value) => set((state) => ({ flags: { ...state.flags, [key]: value } })),
        reset: () => {
          set({
            data: 0,
            eddies: 0,
            fragments: 0,
            bandwidth: 10,
            trace: 0,
            skills: createInitialSkills(),
            activeNodeId: null,
            connected: false,
            upgrades: {},
            demons: {},
            scriptCode: DEFAULT_SCRIPT,
            scriptStatus: "IDLE",
            phosphorColor: "green",
            ramUsed: 0,
            heat: 0,
            cooldowns: { injection: 0, jam: 0, sell: 0, overclock: 0 },
            overclockUntil: 0,
            purgeCooldownUntil: 0,
            lastTick: Date.now(),
            flags: {},
          });
        },
      };

      const persisted = loadPersistedFallback();
      if (persisted) {
        Object.assign(base, persisted);
        base.fragments = persisted.fragments ?? 0;
        base.demons = persisted.demons ?? {};
        base.scriptCode = persisted.scriptCode ?? DEFAULT_SCRIPT;
        base.scriptStatus = persisted.scriptStatus === "RUNNING" ? "IDLE" : (persisted.scriptStatus ?? "IDLE");
        base.phosphorColor = persisted.phosphorColor ?? "green";
        base.bandwidth = getBandwidth(base);
        base.lastTick = persisted.lastTick ?? Date.now();
        base.connected = persisted.connected ?? false;
        if (base.connected && base.activeNodeId) {
          const elapsed = Math.min(8 * 60 * 60, Math.max(0, (Date.now() - base.lastTick) / 1000));
          const node = networkNodes.find((candidate) => candidate.id === base.activeNodeId);
          if (node && elapsed > 0) {
            let availableSeconds = elapsed;
            let gainedData = 0;
            let gainedTrace = 0;
            while (availableSeconds > 0) {
              const step = Math.min(10, availableSeconds);
              gainedData += node.baseDataRate * getExtractionMultiplier(base) * step;
              gainedTrace += node.baseTraceRate * getTraceMultiplier(base) * step;
              for (const demon of demons) {
                const level = base.demons[demon.id] ?? 0;
                if (level === 0) continue;
                const production = demon.baseProduction * level * getMilestoneMultiplier(level);
                if (demon.effect === "data" || demon.effect === "intrusion") gainedData += production * step;
                if (demon.effect === "fragments") base.fragments = (base.fragments ?? 0) + production * step;
                if (demon.effect === "trace") gainedTrace -= production * step;
              }
              availableSeconds -= step;
            }
            base.data = (base.data ?? 0) + gainedData;
            if (gainedTrace >= 100 - base.trace) {
              base.data = base.data * (1 - getPurgeLossMultiplier(base));
              base.trace = 0;
              base.connected = false;
              base.activeNodeId = null;
              base.purgeCooldownUntil = Date.now() + 15_000;
            } else {
              base.trace = base.trace + gainedTrace;
            }
          }
        }
        base.lastTick = Date.now();
      }
      return base;
    },
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        data: state.data,
        eddies: state.eddies,
        fragments: state.fragments,
        bandwidth: state.bandwidth,
        trace: state.trace,
        skills: state.skills,
        activeNodeId: state.activeNodeId,
        connected: state.connected,
        upgrades: state.upgrades,
        demons: state.demons,
        scriptCode: state.scriptCode,
        scriptStatus: state.scriptStatus,
        phosphorColor: state.phosphorColor,
        ramUsed: state.ramUsed,
        heat: state.heat,
        overclockUntil: state.overclockUntil,
        purgeCooldownUntil: state.purgeCooldownUntil,
        lastTick: state.lastTick,
        logSequence: state.logSequence,
        flags: state.flags,
      }),
    },
  ),
);
