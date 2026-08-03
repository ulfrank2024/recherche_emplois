# Journal de bord du projet

Ce fichier sert de mémoire du projet dans le temps. À chaque session de travail significative, une nouvelle entrée est ajoutée en haut, avec : la date, ce qui a été fait ou décidé, pourquoi (si pas évident), et ce qui reste à faire ensuite.

## 2026-08-02 (5)
- Fait : gestion des profils (créer/modifier/supprimer) directement depuis le dashboard, page `/profils` — Ulrich gère lui-même ses profils dans l'app plutôt que par SQL manuel. Server Actions dans `lib/actions.ts`, formulaires HTML classiques (fonctionnent sans JS, sauf la confirmation de suppression).
- Fait : redesign du dashboard (`/`) en tableau façon Kanban — une colonne par statut, couleur d'accent par statut, nav globale (Dashboard / Profils) ajoutée dans `app/layout.tsx`.
- Fait : `sslmode=require` remplacé par `sslmode=verify-full` dans `.env`, `app/.env.local` et `.env.example` pour éviter l'avertissement de sécurité de `pg-connection-string`.
- Testé : `npm run build` (compile + typecheck OK), cycle complet create/update/delete validé directement contre la vraie base Neon via un script autonome, pages `/` et `/profils` vérifiées en local (HTTP 200, contenu attendu présent).
- Prochaine étape : actions d'écriture sur les candidatures (changer un statut depuis le dashboard), puis authentification simple avant de déployer sur Vercel.

## 2026-08-02 (4)
- Fait : app Next.js 16 (App Router, TypeScript, Tailwind) scaffoldée dans `app/` via `create-next-app`, avec Turbopack.
- Fait : `app/lib/db.ts` — connexion Postgres (`pg`) vers Neon, requêtes `getProfils` / `getCandidatures`.
- Fait : `app/app/page.tsx` — dashboard en lecture seule : sélecteur de profil (3 profils), candidatures groupées par statut (les 6 statuts du cahier des charges). Testé en local (`npm run dev`) contre la vraie base Neon — connexion OK, sélecteur de profil fonctionnel, chaque profil affiche bien "Aucune candidature" (aucune donnée insérée à part les 3 profils du seed).
- À noter : Next.js 16 a des changements par rapport aux connaissances généralistes (voir `app/AGENTS.md` généré automatiquement, qui pointe vers `node_modules/next/dist/docs/`) — `searchParams` et `params` sont maintenant des `Promise` à `await` dans les Server Components.
- À noter : `app/.env.local` (non commité) contient `DATABASE_URL`, copiée depuis `.env` à la racine — nécessaire pour que `npm run dev` se connecte à Neon en local.
- Prochaine étape : actions d'écriture (changer un statut de candidature depuis le dashboard), puis authentification simple, avant de déployer sur Vercel.

## 2026-08-02 (3)
- Fait : compte Neon connecté — `DATABASE_URL` renseignée dans `.env` (local, jamais commité).
- Fait : `db/schema.sql` et `db/seed.sql` appliqués sur la vraie base Neon (`neondb`, Postgres 18.4). Tables `profils` et `candidatures` créées, 3 profils initiaux insérés (Informaticien, Cuisinier, Gardien de sécurité — tous actifs, sans CV ni filtres pour l'instant).
- À noter : piège rencontré — l'URL Neon contient un `&` (ex: `channel_binding=require`), qui casse un `source .env` en bash si la valeur n'est pas entre guillemets. `.env.example` mis à jour pour le documenter.
- Prochaine étape : créer le compte Vercel, puis définir les filtres de recherche par profil (villes, mots-clés) et commencer le dashboard en lecture seule.

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
