import { useGameStore } from "../store/gameStore";

export type AppView = "network" | "cyberdeck";

interface TopBarProps {
  view: AppView;
  onViewChange: (view: AppView) => void;
}

export function TopBar({ view, onViewChange }: TopBarProps) {
  const data = useGameStore((state) => state.data);
  const eddies = useGameStore((state) => state.eddies);
  const fragments = useGameStore((state) => state.fragments);
  const bandwidth = useGameStore((state) => state.bandwidth);
  const trace = useGameStore((state) => state.trace);
  const connected = useGameStore((state) => state.connected);

  return (
    <header className="top-bar">
      <div className="brand"><span className="brand-mark">T-0</span><span>TRACE TERMINAL</span></div>
      <div className="top-stat"><span>DATA</span><strong>{data.toFixed(1)}</strong><small>octets</small></div>
      <div className="top-stat"><span>EDDIES</span><strong>{eddies.toFixed(1)}</strong><small>¤</small></div>
      <div className="top-stat fragment-stat"><span>FRAGMENTS</span><strong>{fragments.toFixed(1)}</strong><small>◆</small></div>
      <div className="top-stat"><span>BW</span><strong>{bandwidth}</strong><small>slots</small></div>
      <div className="trace-stat">
        <div className="trace-label"><span>TRACE</span><strong>{trace.toFixed(1)}%</strong></div>
        <div className="progress"><div className="progress-fill trace-fill" style={{ width: `${trace}%` }} /></div>
      </div>
      <div className={`connection-status ${connected ? "online" : ""}`}>
        <i /> {connected ? "CONNECTÉ" : "HORS LIGNE"}
      </div>
      <nav className="view-nav" aria-label="Navigation principale">
        <button className={view === "network" ? "active" : ""} onClick={() => onViewChange("network")}>
          RÉSEAU // OPÉRATIONS
        </button>
        <button className={view === "cyberdeck" ? "active" : ""} onClick={() => onViewChange("cyberdeck")}>
          CYBERDECK // TERMINAL CRT
        </button>
      </nav>
    </header>
  );
}
