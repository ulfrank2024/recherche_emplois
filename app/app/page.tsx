import Link from "next/link";
import { getCandidatures, getProfils, type Candidature } from "@/lib/db";
import { STATUTS } from "@/lib/statuts";

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
        <p>
          Aucun profil trouvé dans la base. Ajoute-en un depuis la page{" "}
          <Link href="/profils" className="underline">
            Profils
          </Link>
          .
        </p>
      </main>
    );
  }

  const profilActif =
    profils.find((p) => p.id === Number(profilParam)) ??
    profils.find((p) => p.actif) ??
    profils[0];

  const candidatures = await getCandidatures(profilActif.id);

  const parStatut = new Map<string, Candidature[]>();
  for (const { valeur } of STATUTS) parStatut.set(valeur, []);
  for (const c of candidatures) parStatut.get(c.statut)?.push(c);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Suivi de recherche d&apos;emploi
        </h1>
        <span className="text-sm text-zinc-500">
          {candidatures.length} candidature{candidatures.length > 1 ? "s" : ""}
        </span>
      </div>

      <nav className="mt-6 flex flex-wrap gap-2">
        {profils.map((p) => (
          <Link
            key={p.id}
            href={`/?profil=${p.id}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              p.id === profilActif.id
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-white text-zinc-700 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-800"
            }`}
          >
            {p.nom}
            {!p.actif && <span className="ml-1.5 text-xs opacity-60">(inactif)</span>}
          </Link>
        ))}
      </nav>

      <div className="mt-8 grid grid-flow-col auto-cols-[280px] gap-4 overflow-x-auto pb-4">
        {STATUTS.map(({ valeur, label, accent, dot }) => {
          const items = parStatut.get(valeur) ?? [];
          return (
            <section
              key={valeur}
              className={`flex flex-col rounded-xl border border-t-4 border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 ${accent}`}
            >
              <div className="flex items-center gap-2 px-4 pt-4">
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  {label}
                </h2>
                <span className="ml-auto text-xs text-zinc-400">{items.length}</span>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-3">
                {items.length === 0 ? (
                  <p className="px-1 py-4 text-center text-xs text-zinc-400">
                    Aucune candidature
                  </p>
                ) : (
                  items.map((c) => (
                    <article
                      key={c.id}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                    >
                      <a
                        href={c.lien_offre}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline-offset-2 hover:underline"
                      >
                        {c.titre_poste}
                      </a>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {[c.entreprise, c.ville].filter(Boolean).join(" — ") || "—"}
                      </p>
                      <p className="mt-1.5 text-xs text-zinc-400">
                        {new Date(c.date_decouverte).toLocaleDateString("fr-CA")}
                      </p>
                      {c.notes && (
                        <p className="mt-2 border-t border-zinc-200 pt-2 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                          {c.notes}
                        </p>
                      )}
                    </article>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
