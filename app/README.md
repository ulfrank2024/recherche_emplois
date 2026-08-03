# app/ — Dashboard + fonctions serverless (Vercel)

Ce dossier contiendra l'app Next.js unique, déployée sur Vercel, qui regroupe :

- le **tableau de bord** (pages consultées par Ulrich) — sélecteur de profil, liste des offres/candidatures groupées par statut, actions (changer un statut, ajouter une note).
- les **routes API / fonctions serverless** — dont la fonction de veille quotidienne déclenchée par le Vercel Cron Job.

Lit et écrit directement dans la base Neon (voir cahier-des-charges-suivi-emploi.md, sections 4.2 et 6).

Pas encore scaffoldé (`create-next-app`) — à faire quand on attaque la construction du dashboard, après le schéma Neon (voir section 10 du cahier des charges).
