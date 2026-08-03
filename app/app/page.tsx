import Link from "next/link";
import {
  getCandidatures,
  getProfils,
  type Candidature,
  type StatutCandidature,
} from "@/lib/db";

const STATUTS: { valeur: StatutCandidature; label: string }[] = [
  { valeur: "nouvelle", label: "Nouvelle" },
  { valeur: "à_postuler", label: "À postuler" },
  { valeur: "postulée", label: "Postulée" },
  { valeur: "entretien", label: "Entretien" },
  { valeur: "offre_reçue", label: "Offre reçue" },
  { valeur: "refusée", label: "Refusée" },
];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ profil?: string }>;
}) {
  const { profil: profilParam } = await searchParams;
  const profils = await getProfils();

  if (profils.length === 0) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <p>Aucun profil trouvé dans la base. Vérifie que `db/seed.sql` a bien été appliqué.</p>
      </main>
    );
  }

  const profilActif =
    profils.find((p) => p.id === Number(profilParam)) ??
    profils.find((p) => p.actif) ??
    profils[0];

  const candidatures = await getCandidatures(profilActif.id);

  const parStatut = new Map<StatutCandidature, Candidature[]>();
  for (const { valeur } of STATUTS) parStatut.set(valeur, []);
  for (const c of candidatures) parStatut.get(c.statut)?.push(c);

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold">Suivi de recherche d&apos;emploi</h1>

      <nav className="mt-6 flex flex-wrap gap-2">
        {profils.map((p) => (
          <Link
            key={p.id}
            href={`/?profil=${p.id}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              p.id === profilActif.id
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            }`}
          >
            {p.nom}
          </Link>
        ))}
      </nav>

      <div className="mt-8 space-y-8">
        {STATUTS.map(({ valeur, label }) => {
          const items = parStatut.get(valeur) ?? [];
          return (
            <section key={valeur}>
              <h2 className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
                {label} <span className="text-zinc-400">({items.length})</span>
              </h2>
              {items.length === 0 ? (
                <p className="mt-2 text-sm text-zinc-400">Aucune candidature.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {items.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="flex items-baseline justify-between gap-4">
                        <a
                          href={c.lien_offre}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium underline-offset-2 hover:underline"
                        >
                          {c.titre_poste}
                        </a>
                        <span className="text-sm text-zinc-500">
                          {new Date(c.date_decouverte).toLocaleDateString("fr-CA")}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500">
                        {[c.entreprise, c.ville].filter(Boolean).join(" — ") || "—"}
                      </p>
                      {c.notes && (
                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                          {c.notes}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
