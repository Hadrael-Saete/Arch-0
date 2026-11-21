import { networkNodes } from "../data/nodes";
import { useGameStore } from "../store/gameStore";

export function NodePanel() {
  const intrusionLevel = useGameStore((state) => state.skills.intrusion.level);
  const activeNodeId = useGameStore((state) => state.activeNodeId);
  const connected = useGameStore((state) => state.connected);
  const connect = useGameStore((state) => state.connect);
  const disconnect = useGameStore((state) => state.disconnect);

  return (
    <section className="panel node-panel">
      <div className="panel-heading"><span>01</span><h2>NŒUDS RÉSEAU</h2></div>
      <div className="node-list">
        {networkNodes.map((node) => {
          const unlocked = intrusionLevel >= node.requiredIntrusionLevel;
          const active = connected && activeNodeId === node.id;
          return (
            <button
              key={node.id}
              className={`node-card ${active ? "active" : ""} ${unlocked ? "" : "locked"}`}
              onClick={() => unlocked && (active ? disconnect() : connect(node.id))}
              disabled={!unlocked}
            >
              <span className="node-index">{active ? "●" : "○"}</span>
              <span className="node-copy">
                <strong>{node.name}</strong>
                <small>{node.description}</small>
                <em>{node.baseDataRate.toFixed(1)} dt/s · trace {node.baseTraceRate.toFixed(1)}%</em>
              </span>
              <span className="node-level">INT {node.requiredIntrusionLevel}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
