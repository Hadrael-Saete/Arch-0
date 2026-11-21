import { useState } from "react";
import { compileScript, stopScript } from "../engine/sandbox";
import { DEFAULT_SCRIPT, useGameStore } from "../store/gameStore";

export function CyberdeckCRT() {
  const state = useGameStore();
  const [consoleLines, setConsoleLines] = useState<string[]>([
    "T-0 SCRIPT KERNEL 1.4",
    "Routine sandbox chargée.",
  ]);

  function compileAndRun() {
    try {
      compileScript(state.scriptCode);
      state.setScriptStatus("RUNNING");
      setConsoleLines((lines) => ["[OK] Compilation réussie.", "[RUN] onTick(deck) chargé.", ...lines].slice(0, 40));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      state.setScriptStatus("ERR_HALT");
      setConsoleLines((lines) => [`[ERR_HALT] ${message}`, ...lines].slice(0, 40));
    }
  }

  function stop() {
    stopScript();
    state.setScriptStatus("IDLE");
    setConsoleLines((lines) => ["[STOP] Routine suspendue.", ...lines].slice(0, 40));
  }

  function reset() {
    stopScript();
    state.setScriptCode(DEFAULT_SCRIPT);
    state.setScriptStatus("IDLE");
    setConsoleLines((lines) => ["[RESET] Squelette restauré.", ...lines].slice(0, 40));
  }

  return (
    <section className={`crt-page phosphor-${state.phosphorColor}`}>
      <div className="crt-toolbar">
        <div>
          <span>CYBERDECK // T-0 RUNTIME</span>
          <strong className={`script-status status-${state.scriptStatus.toLowerCase()}`}>SCRIPT STATUS: {state.scriptStatus}</strong>
        </div>
        <label className="phosphor-switch">
          PHOSPHORE
          <button className={state.phosphorColor === "green" ? "active" : ""} onClick={() => state.setPhosphorColor("green")}>VERT</button>
          <button className={state.phosphorColor === "amber" ? "active" : ""} onClick={() => state.setPhosphorColor("amber")}>AMBRE</button>
        </label>
      </div>

      <div className="crt-layout">
        <div className="crt-monitor">
          <div className="crt-bezel">
            <div className="crt-screen">
              <div className="crt-readout">
                <span>CPU 32-BIT</span>
                <span>RAM {state.ramUsed.toFixed(1)} / {8 + Math.floor(state.skills.cyberdeck.level / 2)}</span>
              </div>
              <textarea
                className="code-editor"
                value={state.scriptCode}
                onChange={(event) => state.setScriptCode(event.target.value)}
                spellCheck={false}
                aria-label="Éditeur de routine Cyberdeck"
              />
              <div className="crt-console" role="log">
                {consoleLines.map((line, index) => <div key={`${index}-${line}`}>{line}</div>)}
              </div>
            </div>
          </div>
          <div className="crt-actions">
            <button className="compile" onClick={compileAndRun}>[ COMPILER &amp; EXÉCUTER ]</button>
            <button onClick={stop}>[ STOP ]</button>
            <button onClick={reset}>[ RÉINITIALISER ]</button>
          </div>
        </div>

        <aside className="deck-docs">
          <h2>DECK API // HELP</h2>
          <FunctionDoc name="deck.getTrace()" detail="Retourne la trace actuelle." locked={false} />
          <FunctionDoc name="deck.getData()" detail="Retourne les données disponibles." locked={false} />
          <FunctionDoc name="deck.getRam()" detail="Retourne la RAM actuellement utilisée." locked={false} />
          <FunctionDoc name="deck.inject()" detail="Lance une injection si possible." locked={false} />
          <FunctionDoc name="deck.log(msg)" detail="Écrit un message dans le terminal." locked={false} />
          <FunctionDoc name="deck.scramble()" detail="Lance le brouillage automatique." locked={state.skills.stealth.level < 2} requirement="Furtivité Niv. 2+" />
          <FunctionDoc name="deck.sellData(minAmount)" detail="Vend dès que le seuil est dépassé." locked={state.skills.brokerage.level < 2} requirement="Courtage Niv. 2+" />
          <FunctionDoc name="deck.overclock()" detail="Active l'overclock si disponible." locked={state.skills.cyberdeck.level < 3} requirement="Cyberdeck Niv. 3+" />
          <FunctionDoc name="deck.switchNode(nodeId)" detail="Change de nœud réseau." locked={state.skills.intrusion.level < 3} requirement="Intrusion Niv. 3+" />
        </aside>
      </div>
    </section>
  );
}

function FunctionDoc({ name, detail, locked, requirement }: { name: string; detail: string; locked: boolean; requirement?: string }) {
  return (
    <div className={`function-doc ${locked ? "locked" : ""}`}>
      <code>{name}</code>
      <p>{locked ? `[VERROUILLÉ - Requiert ${requirement}]` : detail}</p>
    </div>
  );
}
