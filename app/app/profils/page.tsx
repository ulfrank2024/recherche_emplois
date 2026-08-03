import { getProfils } from "@/lib/db";
import {
  creerProfilAction,
  modifierProfilAction,
  supprimerProfilAction,
} from "@/lib/actions";
import { ProfilFormFields } from "@/components/ProfilFormFields";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";

export default async function ProfilsPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string }>;
}) {
  const { erreur } = await searchParams;
  const profils = await getProfils();

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold">Profils de recherche</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Chaque profil a ses propres villes, mots-clés et CV de base — aucune
        donnée ne se mélange entre profils.
      </p>

      {erreur && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {erreur}
        </div>
      )}

      <section className="mt-8 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
        <h2 className="text-lg font-medium">Ajouter un profil</h2>
        <form action={creerProfilAction} className="mt-4 grid gap-4 sm:grid-cols-2">
          <ProfilFormFields />
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Ajouter
            </button>
          </div>
        </form>
      </section>

      <div className="mt-8 space-y-6">
        {profils.map((profil) => {
          const modifierAvecId = modifierProfilAction.bind(null, profil.id);
          const supprimerAvecId = supprimerProfilAction.bind(null, profil.id);
          return (
            <section
              key={profil.id}
              className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{profil.nom}</h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    profil.actif
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {profil.actif ? "Actif" : "Inactif"}
                </span>
              </div>

              <form action={modifierAvecId} className="mt-4 grid gap-4 sm:grid-cols-2">
                <ProfilFormFields profil={profil} />
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>

              <form action={supprimerAvecId} className="mt-3">
                <ConfirmSubmitButton
                  confirmText={`Supprimer le profil "${profil.nom}" ? Cette action est irréversible.`}
                  className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                >
                  Supprimer ce profil
                </ConfirmSubmitButton>
              </form>
            </section>
          );
        })}
      </div>
    </main>
  );
}
