export interface NetworkNode {
  id: string;
  name: string;
  description: string;
  requiredIntrusionLevel: number;
  baseDataRate: number;
  baseTraceRate: number;
  xpReward: number;
}

export const networkNodes: NetworkNode[] = [
  {
    id: "public-relay",
    name: "Relais Public",
    description: "Un relais urbain peu protege. Idéal pour apprendre.",
    requiredIntrusionLevel: 1,
    baseDataRate: 1.2,
    baseTraceRate: 0.55,
    xpReward: 1.2,
  },
  {
    id: "medical-terminal",
    name: "Borne Médicale",
    description: "Archives locales de faible sécurité.",
    requiredIntrusionLevel: 3,
    baseDataRate: 3.8,
    baseTraceRate: 1.05,
    xpReward: 2.2,
  },
  {
    id: "corpo-server",
    name: "Serveur Corpo",
    description: "Réseau corporatif lucratif mais surveillé.",
    requiredIntrusionLevel: 7,
    baseDataRate: 9,
    baseTraceRate: 1.8,
    xpReward: 4,
  },
  {
    id: "ghost-exchange",
    name: "Échange Fantôme",
    description: "Hub clandestin réservé aux opérateurs expérimentés.",
    requiredIntrusionLevel: 12,
    baseDataRate: 18,
    baseTraceRate: 2.6,
    xpReward: 7,
  },
];
