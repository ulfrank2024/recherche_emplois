# app/ — Dashboard + fonctions serverless (Vercel)

App Next.js (App Router, TypeScript, Tailwind) qui contient le tableau de bord de suivi de candidatures et, plus tard, les fonctions serverless (dont le cron de veille quotidienne). Voir cahier-des-charges-suivi-emploi.md (racine du dépôt), sections 4.2 et 6.

## Développement local

```bash
cp ../.env  # ou copier juste DATABASE_URL vers app/.env.local
npm run dev
```

`app/.env.local` (non commité) doit contenir `DATABASE_URL` — la même chaîne de connexion Neon que le script local. Next.js la charge automatiquement au démarrage.

## Structure

- `app/page.tsx` — dashboard en lecture seule : sélecteur de profil + candidatures groupées par statut.
- `lib/db.ts` — connexion Postgres (`pg`) vers Neon et requêtes (`getProfils`, `getCandidatures`).

## À venir

Actions d'écriture (changer un statut), authentification simple, fonction serverless de veille quotidienne — voir JOURNAL.md à la racine pour l'état d'avancement.
