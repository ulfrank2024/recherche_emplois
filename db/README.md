# db/ — Schéma Neon

Ce dossier contient la définition SQL de la base de données Neon (Postgres), source de vérité du projet (voir cahier-des-charges-suivi-emploi.md, section 6).

## Fichiers

- `schema.sql` — crée le type `statut_candidature` et les deux tables (`profils`, `candidatures`).
- `seed.sql` — insère les 3 profils initiaux (Informaticien, Cuisinier, Gardien de sécurité) sans CV ni filtres — à compléter ensuite.

## Appliquer le schéma

Une fois le compte Neon créé et `DATABASE_URL` disponible (voir `.env.example`) :

```bash
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql
```

## Notes sur les choix de modélisation

- **Clés** : entiers auto-incrémentés (`GENERATED ALWAYS AS IDENTITY`), pas d'UUID — inutile à cette échelle (un seul utilisateur, quelques dizaines de lignes).
- **`statut_candidature`** : type ENUM Postgres plutôt qu'un simple `text`, pour que la base rejette elle-même un statut invalide. Valeurs identiques à celles du cahier des charges (section 4.3).
- **`filtres`** : `jsonb` sur `profils` (`{"villes": [...], "mots_cles": [...]}`) — évite une table séparée pour un besoin aussi simple, conforme à la section 6 du cahier des charges ("peuvent être stockés en JSON si plus simple").
- **`actif`** sur `profils` : permet à la veille quotidienne de ne traiter que les profils actifs (section 4.1).
- **`UNIQUE (profil_id, lien_offre)`** : sert de garde-fou contre les doublons — la veille quotidienne peut faire un `INSERT ... ON CONFLICT DO NOTHING` pour n'ajouter que les offres réellement nouvelles.
- **`cv_base` / `cv_utilise` / `lettre_utilisee`** : stockent une référence (chemin ou nom de fichier), pas le contenu du fichier — les fichiers eux-mêmes restent en local, gérés par le script `scripts/generer-cv-lettre/`.

## Migrations futures

Pas d'outil de migration pour l'instant (trop tôt, un seul fichier `schema.sql` suffit). Si le schéma évolue après la première application, on ajoutera des fichiers `NNN_description.sql` numérotés dans ce dossier plutôt que de modifier `schema.sql` rétroactivement.
