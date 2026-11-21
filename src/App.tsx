import { useEffect, useState } from "react";
import { ActionsPanel } from "./components/ActionsPanel";
import { NodePanel } from "./components/NodePanel";
import { SkillsPanel } from "./components/SkillsPanel";
import { TerminalLogs } from "./components/TerminalLogs";
import { TopBar, type AppView } from "./components/TopBar";
import { CyberdeckCRT } from "./components/CyberdeckCRT";
import { DemonsPanel } from "./components/DemonsPanel";
import { startTickLoop } from "./engine/tickLoop";
import { executeScript } from "./engine/sandbox";
import { useGameStore } from "./store/gameStore";

export default function App() {
  const [view, setView] = useState<AppView>("network");

  useEffect(() => {
    const stopTick = startTickLoop();
    const routineTimer = window.setInterval(() => {
      const state = useGameStore.getState();
      if (state.scriptStatus !== "RUNNING") return;
      const error = executeScript();
      if (error) state.setScriptStatus("ERR_HALT");
    }, 1500);
    return () => {
      stopTick();
      window.clearInterval(routineTimer);
    };
  }, []);

  if (view === "cyberdeck") {
    return (
      <main className="app-shell">
        <TopBar view={view} onViewChange={setView} />
        <CyberdeckCRT />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <TopBar view={view} onViewChange={setView} />
      <div className="game-grid">
        <div className="left-column">
          <NodePanel />
        </div>
        <div className="center-column">
          <ActionsPanel />
          <DemonsPanel />
        </div>
        <aside className="right-column">
          <SkillsPanel />
          <TerminalLogs />
        </aside>
      </div>
    </main>
  );
}
