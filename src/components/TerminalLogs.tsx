import { useGameStore } from "../store/gameStore";

export function TerminalLogs() {
  const logs = useGameStore((state) => state.logs);
  return (
    <section className="panel logs-panel">
      <div className="panel-heading"><span>05</span><h2>JOURNAL TERMINAL</h2></div>
      <div className="log-list" role="log" aria-live="polite">
        {logs.map((log) => (
          <div className={`log-line ${log.kind}`} key={log.id}>
            <time>{log.time}</time>
            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
