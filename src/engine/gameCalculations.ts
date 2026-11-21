import { cyberdeckUpgrades } from "../data/upgrades";
import type { GameState, SkillId } from "../types/game";

export function nextLevelXp(level: number): number {
  return Math.floor(100 * Math.pow(1.32, level - 1));
}

export function getMaxRam(state: GameState): number {
  const antennaLevel = state.upgrades["clandestine-antenna"] ?? 0;
  return 8 + Math.floor(state.skills.cyberdeck.level / 2) + antennaLevel * 2 * getMilestoneMultiplier(antennaLevel);
}

export function getCooldownMultiplier(state: GameState): number {
  const cyberdeckBonus = state.skills.cyberdeck.level * 0.008;
  const algorithmLevel = state.upgrades["compression-algorithm"] ?? 0;
  const algorithmBonus = algorithmLevel * 0.10 * getMilestoneMultiplier(algorithmLevel);
  return Math.max(0.35, 1 - cyberdeckBonus - algorithmBonus);
}

export function getExtractionMultiplier(state: GameState): number {
  const intrusionBonus = state.skills.intrusion.level * 0.025;
  const processorLevel = state.upgrades["neural-processor"] ?? 0;
  const processorBonus = processorLevel * 0.12 * getMilestoneMultiplier(processorLevel);
  return 1 + intrusionBonus + processorBonus;
}

export function getTraceMultiplier(state: GameState): number {
  const stealthReduction = state.skills.stealth.level * 0.012;
  const coolingLevel = state.upgrades["liquid-cooling"] ?? 0;
  const coolingReduction = coolingLevel * 0.08 * getMilestoneMultiplier(coolingLevel);
  return Math.max(0.35, 1 - stealthReduction - coolingReduction);
}

export function getSellRate(state: GameState): number {
  return 0.55 + state.skills.brokerage.level * 0.018;
}

export function getPurgeLossMultiplier(state: GameState): number {
  const reduction = state.skills.countermeasures.level * 0.025;
  return Math.max(0.35, 0.25 - reduction);
}

export function getMilestoneMultiplier(level: number): number {
  return Math.pow(2, Math.floor(level / 10));
}

export function getBandwidth(state: GameState): number {
  const base = 10;
  const memoryLevel = state.upgrades["memory-bus"] ?? 0;
  return base + memoryLevel * getMilestoneMultiplier(memoryLevel);
}

export function getDemonCount(state: GameState): number {
  return Object.values(state.demons).reduce((sum, level) => sum + level, 0);
}

export function getFragmentChance(state: GameState): number {
  const level = state.upgrades["crypto-coprocessor"] ?? 0;
  const milestone = getMilestoneMultiplier(level);
  return 0.012 + level * 0.015 * milestone;
}
