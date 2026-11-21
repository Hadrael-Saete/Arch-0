# CHANGES

## Partie 1 - Core Idle

- Initialisation de React, Vite et des dépendances TypeScript nécessaires.
- Création des types du jeu, du store Zustand persistant et du calcul hors ligne.
- Ajout des cinq compétences avec progression automatique par XP.
- Ajout de quatre nœuds réseau, de quatre améliorations Cyberdeck et de leurs multiplicateurs.
- Ajout de la boucle de tick indépendante du rendu, du système de Trace et des purges.
- Ajout des actions Injection, Brouillage, Vente et Overclock avec coûts RAM et cooldowns.
- Création de l'interface terminal en trois colonnes avec barre supérieure, compétences, actions, améliorations et journal.
- Préparation de `flags` pour les futures quêtes et scripts.

## Partie 2 - Navigation, Infrastructure et SandBox

- Ajout de la navigation réseau/Cyberdeck dans la barre supérieure.
- Ajout des ressources Fragments Cryptés et Bande Passante.
- Ajout des cinq démons passifs: Crawler, Siphon, Scrubber, Mineur et Courtier Auto.
- Ajout des paliers multiplicateurs tous les 10 niveaux pour démons et améliorations.
- Ajout du Bus Mémoire et du Coprocesseur Cryptographique.
- Ajout du terminal CRT vert/ambre avec éditeur JavaScript bridé et aide-mémoire API.
- Ajout de la compilation, exécution cyclique, arrêt, réinitialisation et gestion ERR_HALT.
- Les scripts exécutent un bonus XP Cyberdeck toutes les 1,5 secondes et restent actifs hors vue.
- Mise à niveau compatible avec les anciennes sauvegardes via des valeurs par défaut.
