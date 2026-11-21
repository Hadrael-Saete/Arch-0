import { useGameStore } from "../store/gameStore";
import type { SkillId } from "../types/game";

const skillInfo: Record<SkillId, { name: string; description: string }> = {
  intrusion: { name: "Intrusion", description: "+2.5 % extraction / niveau · déverrouille les nœuds" },
  stealth: { name: "Furtivité", description: "-1.2 % montée de trace / niveau" },
  cyberdeck: { name: "Cyberdeck", description: "+0.5 RAM / 2 niveaux · cooldown réduit" },
  brokerage: { name: "Courtage", description: "+1.8 % taux de conversion / niveau" },
  countermeasures: { name: "Contre-Mesures", description: "-2.5 % pertes · refroidissement accéléré" },
};

export function SkillsPanel() {
  const skills = useGameStore((state) => state.skills);
  return (
    <section className="panel skills-panel">
      <div className="panel-heading"><span>04</span><h2>COMPÉTENCES</h2></div>
      <div className="skills-list">
        {(Object.keys(skillInfo) as SkillId[]).map((id) => {
          const skill = skills[id];
          const info = skillInfo[id];
          const percent = (skill.xp / skill.nextLevelXp) * 100;
          return (
            <article className="skill-row" key={id}>
              <div className="skill-name"><strong>{info.name}</strong><span>LV. {skill.level}</span></div>
              <p>{info.description}</p>
              <div className="skill-progress">
                <i style={{ width: `${percent}%` }} />
              </div>
              <small>{skill.xp.toFixed(0)} / {skill.nextLevelXp} XP</small>
            </article>
          );
        })}
      </div>
    </section>
  );
}
