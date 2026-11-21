export interface Demon {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  baseProduction: number;
  effect: "data" | "intrusion" | "trace" | "fragments" | "eddies";
  productionLabel: string;
}

export const demons: Demon[] = [
  {
    id: "packet-crawler",
    name: "Crawler de Paquets",
    description: "Extrait en continu des octets résiduels.",
    baseCost: 35,
    costMultiplier: 1.16,
    baseProduction: 0.35,
    effect: "data",
    productionLabel: "+0.35 Data/s",
  },
  {
    id: "ghost-siphon",
    name: "Siphon Fantôme",
    description: "Récupère des données et entraîne l'Intrusion.",
    baseCost: 75,
    costMultiplier: 1.18,
    baseProduction: 0.22,
    effect: "intrusion",
    productionLabel: "+0.22 Data/s · +0.18 XP/s",
  },
  {
    id: "log-scrubber",
    name: "Scrubber de Logs",
    description: "Neutralise progressivement la trace.",
    baseCost: 120,
    costMultiplier: 1.20,
    baseProduction: 0.30,
    effect: "trace",
    productionLabel: "-0.30 Trace/s",
  },
  {
    id: "fragment-miner",
    name: "Mineur de Fragments",
    description: "Recherche des cellules cryptées dormantes.",
    baseCost: 180,
    costMultiplier: 1.22,
    baseProduction: 0.018,
    effect: "fragments",
    productionLabel: "+0.018 Fragments/s",
  },
  {
    id: "auto-broker",
    name: "Courtier Auto",
    description: "Blanchit automatiquement une petite part des données.",
    baseCost: 260,
    costMultiplier: 1.24,
    baseProduction: 0.025,
    effect: "eddies",
    productionLabel: "2.5 % des Data/s",
  },
];
