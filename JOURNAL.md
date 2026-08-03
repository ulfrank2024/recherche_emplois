# Journal de bord du projet

Ce fichier sert de mémoire du projet dans le temps. À chaque session de travail significative, une nouvelle entrée est ajoutée en haut, avec : la date, ce qui a été fait ou décidé, pourquoi (si pas évident), et ce qui reste à faire ensuite.

## 2026-08-02 (2)
- Fait : schéma Neon écrit dans `db/schema.sql` (type `statut_candidature`, tables `profils` et `candidatures`) + `db/seed.sql` (3 profils initiaux, sans CV ni filtres).
- Fait : `.env.example` créé à la racine (DATABASE_URL, ANTHROPIC_API_KEY, DASHBOARD_PASSWORD).
- Décision : clés entières auto-incrémentées plutôt qu'UUID, `statut` en ENUM Postgres plutôt qu'en texte libre, `filtres` en JSONB sur `profils` — voir `db/README.md` pour le détail des choix.
- Décision : le CV de base sera ajouté manuellement par Ulrich dans l'application une fois celle-ci construite — pas besoin du contenu réel du CV pour avancer sur le schéma ou le dashboard.
- Prochaine étape : créer les comptes Vercel et Neon, appliquer `db/schema.sql` + `db/seed.sql` sur la vraie base, puis construire le dashboard en lecture seule.

## 2026-08-02
- Fait : dépôt Git initialisé et poussé sur https://github.com/ulfrank2024/recherche_emplois.
- Fait : structure de base du dépôt créée (dossiers app/, scripts/generer-cv-lettre/, .claude/skills/, fichiers .gitignore, JOURNAL.md, CLAUDE.md).
- Décision : architecture confirmée sans microservices, conformément au cahier des charges (section 8) — une seule app Next.js (dashboard + fonctions serverless) déployée sur Vercel, plus un script local pour la génération CV/lettre. Pas de dossiers backend/frontend séparés.
- À noter : bug d'encodage détecté — les caractères accentués écrits par l'outil Write de Claude Code sont double-encodés (UTF-8 mal interprété). Contournement : écrire les fichiers contenant des accents via un heredoc bash plutôt que l'outil Write.
- Prochaine étape : remplir un premier CV de base (profil Informaticien), définir les filtres de recherche par profil, puis créer les comptes Vercel et Neon.
