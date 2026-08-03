-- Schema Neon (Postgres) pour le suivi de recherche d'emploi.
-- Voir cahier-des-charges-suivi-emploi.md, section 6, pour le modele de donnees attendu.
--
-- Application :
--   psql "$DATABASE_URL" -f db/schema.sql

CREATE TYPE statut_candidature AS ENUM (
  'nouvelle',
  'à_postuler',
  'postulée',
  'entretien',
  'offre_reçue',
  'refusée'
);

CREATE TABLE profils (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nom text NOT NULL UNIQUE,
  cv_base text,
  filtres jsonb NOT NULL DEFAULT '{"villes": [], "mots_cles": []}'::jsonb,
  actif boolean NOT NULL DEFAULT true,
  cree_le timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE candidatures (
  id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  profil_id integer NOT NULL REFERENCES profils(id) ON DELETE RESTRICT,
  titre_poste text NOT NULL,
  entreprise text,
  ville text,
  lien_offre text NOT NULL,
  statut statut_candidature NOT NULL DEFAULT 'nouvelle',
  cv_utilise text,
  lettre_utilisee text,
  date_decouverte timestamptz NOT NULL DEFAULT now(),
  date_candidature date,
  date_entretien date,
  notes text,
  UNIQUE (profil_id, lien_offre)
);

-- Utilise par le dashboard pour grouper les candidatures d'un profil par statut,
-- et par la veille quotidienne pour verifier si une offre est deja connue.
CREATE INDEX idx_candidatures_profil_statut ON candidatures (profil_id, statut);
