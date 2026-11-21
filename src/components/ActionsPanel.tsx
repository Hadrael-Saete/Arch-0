import { cyberdeckUpgrades } from "../data/upgrades";
import { getCooldownMultiplier, getMaxRam } from "../engine/gameCalculations";
import { getMilestoneMultiplier } from "../engine/gameCalculations";
import { useGameStore } from "../store/gameStore";

const actions = [
  { id: "injection" as const, name: "Injection Manuelle", key: "01", cost: 1, description: "Extrait des données instantanément" },
  { id: "jam" as const, name: "Brouillage de Signal", key: "02", cost: 2, description: "Réduit immédiatement la trace" },
  { id: "sell" as const, name: "Vendre les Données", key: "03", cost: 0, description: "Convertit les octets en Eddies" },
  { id: "overclock" as const, name: "Overclock", key: "04", cost: 4, description: "Double l'extraction pendant 10 s" },
];

export function ActionsPanel() {
  const state = useGameStore();
  const maxRam = getMaxRam(state);
  const cooldownScale = getCooldownMultiplier(state);
  const actionMethods = {
    injection: state.injection,
    jam: state.jam,
    sell: state.sell,
    overclock: state.overclock,
  };

  return (
    <>
      <section className="panel actions-panel">
        <div className="panel-heading"><span>02</span><h2>ACTIONS ACTIVES</h2></div>
        <div className="ram-row">
          <span>RAM</span>
          <div className="ram-bar">{Array.from({ length: maxRam }).map((_, index) => (
            <i key={index} className={index < state.ramUsed ? "used" : ""} />
          ))}</div>
          <strong>{state.ramUsed.toFixed(1)} / {maxRam}</strong>
        </div>
        <div className="action-grid">
          {actions.map((action) => {
            const remaining = state.cooldowns[action.id];
            const baseCooldown = action.id === "injection" ? 2 : action.id === "jam" ? 8 : action.id === "sell" ? 3 : 20;
            const fullCooldown = baseCooldown * cooldownScale;
            const percent = remaining > 0 ? ((fullCooldown - remaining) / fullCooldown) * 100 : 100;
            return (
              <button
                key={action.id}
                className="action-card"
                disabled={remaining > 0}
                onClick={() => actionMethods[action.id]()}
              >
                <span className="action-key">{action.key}</span>
                <span className="action-copy"><strong>{action.name}</strong><small>{description(action)}</small></span>
                {action.cost > 0 && <span className="ram-cost">{action.cost} RAM</span>}
                {remaining > 0 && <span className="cooldown-label">{remaining.toFixed(1)}s</span>}
                <div className="cooldown-progress"><i style={{ width: `${percent}%` }} /></div>
              </button>
            );
          })}
        </div>
      </section>
      <section className="panel upgrades-panel">
        <div className="panel-heading"><span>03</span><h2>MATÉRIEL &amp; RIG</h2></div>
        <div className="upgrade-grid">
          {cyberdeckUpgrades.map((upgrade) => {
            const level = state.upgrades[upgrade.id] ?? 0;
            const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, level));
            const progress = level % 10;
            return (
              <button key={upgrade.id} className="upgrade-card" onClick={() => state.buyUpgrade(upgrade.id)} disabled={state.eddies < cost}>
                <span><strong>{upgrade.name}</strong><small>NV. {level}</small></span>
                <em>{upgrade.description}</em>
                <b>{upgrade.bonusLabel}</b>
                <div className="upgrade-milestone">
                  <span>x{getMilestoneMultiplier(level)} · {progress}/10 vers prochain palier</span>
                  <i><b style={{ width: `${progress * 10}%` }} /></i>
                </div>
                <div><span>AMÉLIORER</span><strong>{cost} ¤</strong></div>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

function description(action: (typeof actions)[number]): string {
  return action.description;
}
