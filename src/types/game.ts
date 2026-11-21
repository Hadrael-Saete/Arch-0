export type SkillId = "intrusion" | "stealth" | "cyberdeck" | "brokerage" | "countermeasures";

export interface Skill {
  level: number;
  xp: number;
  nextLevelXp: number;
}

export type Skills = Record<SkillId, Skill>;

export interface UpgradeState {
  [upgradeId: string]: number;
}

export interface DemonState {
  [demonId: string]: number;
}

export type ScriptStatus = "IDLE" | "RUNNING" | "ERR_HALT";
export type PhosphorColor = "green" | "amber";

export interface TerminalLog {
  id: number;
  time: string;
  message: string;
  kind: "info" | "gain" | "warning" | "danger";
}

export interface ActionCooldowns {
  injection: number;
  jam: number;
  sell: number;
  overclock: number;
}

export interface GameState {
  data: number;
  eddies: number;
  fragments: number;
  bandwidth: number;
  trace: number;
  skills: Skills;
  activeNodeId: string | null;
  connected: boolean;
  upgrades: UpgradeState;
  demons: DemonState;
  scriptCode: string;
  scriptStatus: ScriptStatus;
  phosphorColor: PhosphorColor;
  ramUsed: number;
  heat: number;
  cooldowns: ActionCooldowns;
  overclockUntil: number;
  purgeCooldownUntil: number;
  lastTick: number;
  logs: TerminalLog[];
  logSequence: number;
  flags: Record<string, boolean>;

  connect: (nodeId: string) => boolean;
  disconnect: () => void;
  injection: () => boolean;
  jam: () => boolean;
  sell: () => boolean;
  overclock: () => boolean;
  buyUpgrade: (upgradeId: string) => boolean;
  buyDemon: (demonId: string) => boolean;
  setScriptCode: (code: string) => void;
  setScriptStatus: (status: ScriptStatus) => void;
  setPhosphorColor: (color: PhosphorColor) => void;
  tick: (now: number, deltaSeconds: number) => void;
  purge: () => void;
  gainXp: (skillId: SkillId, amount: number) => void;
  addLog: (message: string, kind?: TerminalLog["kind"]) => void;
  setFlag: (key: string, value: boolean) => void;
  reset: () => void;
}
