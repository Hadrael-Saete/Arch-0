# Trace-0

Prototype de jeu idle/incremental cyberpunk construit avec React, TypeScript, Zustand et Vite.

## Commandes

- `npm install` - installe les dependances
- `npm run dev` - lance l'application Vite
- `npm run build` - vérifie TypeScript puis construit l'application dans `dist/`
- `npm run tauri dev` - lance l'application desktop Tauri

## Partie 1

Le jeu comprend cinq compétences, quatre nœuds réseau progressifs, quatre améliorations du Cyberdeck, quatre actions actives, une jauge de Trace avec purge et une sauvegarde locale avec progression hors ligne limitée à huit heures.

Le store Zustand centralisé se trouve dans `src/store/gameStore.ts`. Les effets numériques sont séparés dans `src/engine/gameCalculations.ts`, la boucle de ticks dans `src/engine/tickLoop.ts`, et les données d'équilibrage dans `src/data/`.

## Partie 2 - Infrastructure et Cyberdeck

- Navigation entre les vues **RÉSEAU // OPÉRATIONS** et **CYBERDECK // TERMINAL CRT**.
- Ressources `fragments` et `bandwidth`, cinq générateurs de démons empilables et paliers de synergie tous les 10 niveaux.
- Deux nouveaux modules matériels: Bus Mémoire et Coprocesseur Cryptographique.
- Éditeur `function onTick(deck)`, fonctions API déverrouillées par compétence, compilation, arrêt et gestion stricte des erreurs.
- Les ticks de jeu et les routines Cyberdeck continuent en arrière-plan lors des changements de vue.
