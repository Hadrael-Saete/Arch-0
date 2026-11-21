export interface CyberdeckUpgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  bonusLabel: string;
  effect: "extraction" | "ram" | "trace" | "cooldown" | "bandwidth" | "fragments";
  bonusPerLevel: number;
}

export const cyberdeckUpgrades: CyberdeckUpgrade[] = [
  {
    id: "neural-processor",
    name: "Processeur Neural",
    description: "Optimise les calculs d'extraction.",
    baseCost: 25,
    costMultiplier: 1.7,
    bonusLabel: "+12 % extraction",
    effect: "extraction",
    bonusPerLevel: 0.12,
  },
  {
    id: "clandestine-antenna",
    name: "Antenne Clandestine",
    description: "Canalise davantage de paquets simultanés.",
    baseCost: 40,
    costMultiplier: 1.75,
    bonusLabel: "+2 RAM max",
    effect: "ram",
    bonusPerLevel: 2,
  },
  {
    id: "liquid-cooling",
    name: "Refroidissement Liquide",
    description: "Neutralise la trace plus efficacement.",
    baseCost: 65,
    costMultiplier: 1.8,
    bonusLabel: "-8 % montée trace",
    effect: "trace",
    bonusPerLevel: 0.08,
  },
  {
    id: "compression-algorithm",
    name: "Algorithme de Compression",
    description: "Réduit le délai des actions actives.",
    baseCost: 100,
    costMultiplier: 1.9,
    bonusLabel: "-10 % cooldown",
    effect: "cooldown",
    bonusPerLevel: 0.10,
  },
  {
    id: "memory-bus",
    name: "Bus Mémoire",
    description: "Augmente la bande passante disponible.",
    baseCost: 160,
    costMultiplier: 2,
    bonusLabel: "+1 bande passante",
    effect: "bandwidth",
    bonusPerLevel: 1,
  },
  {
    id: "crypto-coprocessor",
    name: "Coprocesseur Cryptographique",
    description: "Recherche des fragments pendant l'extraction.",
    baseCost: 220,
    costMultiplier: 2.1,
    bonusLabel: "+15 % chance fragments",
    effect: "fragments",
    bonusPerLevel: 0.15,
  },
];
