import { demons } from "../data/demons";
import { getBandwidth, getDemonCount, getMilestoneMultiplier } from "../engine/gameCalculations";
import { useGameStore } from "../store/gameStore";

export function DemonsPanel() {
  const state = useGameStore();
  const used = getDemonCount(state);
  const bandwidth = getBandwidth(state);

  return (
    <section className="panel demons-panel">
      <div className="panel-heading">
        <span>04</span><h2>DÉMONS &amp; INFRASTRUCTURE</h2>
        <b className="bandwidth-count">{used} / {bandwidth} BW</b>
      </div>
      <div className="demon-grid">
        {demons.map((demon) => {
          const level = state.demons[demon.id] ?? 0;
          const cost = Math.floor(demon.baseCost * Math.pow(demon.costMultiplier, level));
          const nextMilestone = (Math.floor(level / 10) + 1) * 10;
          const progress = level % 10;
          return (
            <article className="demon-card" key={demon.id}>
              <div className="demon-title"><strong>{demon.name}</strong><span>LV. {level}</span></div>
              <p>{demon.description}</p>
              <em>{demon.productionLabel}</em>
              <div className="milestone-row">
                <span>x{getMilestoneMultiplier(level)} production</span>
                <span>{progress}/10 vers x{getMilestoneMultiplier(nextMilestone)}</span>
              </div>
              <div className="milestone-progress"><i style={{ width: `${progress * 10}%` }} /></div>
              <button
                disabled={state.eddies < cost || used >= bandwidth}
                onClick={() => state.buyDemon(demon.id)}
              >
                Installer <strong>{cost} ¤</strong>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
