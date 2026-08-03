-- Profils initiaux (cahier-des-charges-suivi-emploi.md, section 3).
-- cv_base et filtres restent vides ici : a completer plus tard (CV de base
-- ajoute manuellement par Ulrich, filtres definis avec Claude Code).
--
-- Application :
--   psql "$DATABASE_URL" -f db/seed.sql

INSERT INTO profils (nom, filtres) VALUES
  ('Informaticien', '{"villes": [], "mots_cles": []}'),
  ('Cuisinier', '{"villes": [], "mots_cles": []}'),
  ('Gardien de sécurité', '{"villes": [], "mots_cles": []}');
