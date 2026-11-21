import { useGameStore } from "../store/gameStore";

export function startTickLoop(): () => void {
  let previous = performance.now();
  const timer = window.setInterval(() => {
    const now = performance.now();
    const elapsed = Math.min(1, (now - previous) / 1000);
    previous = now;
    useGameStore.getState().tick(Date.now(), elapsed);
  }, 250);

  return () => window.clearInterval(timer);
}
