import { Pool } from "pg";

declare global {
  var pgPool: Pool | undefined;
}

export const pool =
  global.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}

export type Profil = {
  id: number;
  nom: string;
  cv_base: string | null;
  filtres: { villes: string[]; mots_cles: string[] };
  actif: boolean;
};

export type StatutCandidature =
  | "nouvelle"
  | "à_postuler"
  | "postulée"
  | "entretien"
  | "offre_reçue"
  | "refusée";

export type Candidature = {
  id: number;
  profil_id: number;
  titre_poste: string;
  entreprise: string | null;
  ville: string | null;
  lien_offre: string;
  statut: StatutCandidature;
  cv_utilise: string | null;
  lettre_utilisee: string | null;
  date_decouverte: string;
  date_candidature: string | null;
  date_entretien: string | null;
  notes: string | null;
};

export async function getProfils(): Promise<Profil[]> {
  const { rows } = await pool.query<Profil>(
    "SELECT id, nom, cv_base, filtres, actif FROM profils ORDER BY id"
  );
  return rows;
}

export async function getCandidatures(profilId: number): Promise<Candidature[]> {
  const { rows } = await pool.query<Candidature>(
    `SELECT id, profil_id, titre_poste, entreprise, ville, lien_offre, statut,
            cv_utilise, lettre_utilisee, date_decouverte, date_candidature,
            date_entretien, notes
     FROM candidatures
     WHERE profil_id = $1
     ORDER BY date_decouverte DESC`,
    [profilId]
  );
  return rows;
}
