# Journal de bord du projet

Ce fichier sert de mémoire du projet dans le temps. À chaque session de travail significative, une nouvelle entrée est ajoutée en haut, avec : la date, ce qui a été fait ou décidé, pourquoi (si pas évident), et ce qui reste à faire ensuite.

## 2026-08-02
- Fait : dépôt Git initialisé et poussé sur https://github.com/ulfrank2024/recherche_emplois.
- Fait : structure de base du dépôt créée (dossiers app/, scripts/generer-cv-lettre/, .claude/skills/, fichiers .gitignore, JOURNAL.md, CLAUDE.md).
- Décision : architecture confirmée sans microservices, conformément au cahier des charges (section 8) — une seule app Next.js (dashboard + fonctions serverless) déployée sur Vercel, plus un script local pour la génération CV/lettre. Pas de dossiers backend/frontend séparés.
- À noter : bug d'encodage détecté — les caractères accentués écrits par l'outil Write de Claude Code sont double-encodés (UTF-8 mal interprété). Contournement : écrire les fichiers contenant des accents via un heredoc bash plutôt que l'outil Write.
- Prochaine étape : remplir un premier CV de base (profil Informaticien), définir les filtres de recherche par profil, puis créer les comptes Vercel et Neon.
