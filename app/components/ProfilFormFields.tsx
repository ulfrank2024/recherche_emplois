import type { Profil } from "@/lib/db";

const champClasses =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-500";
const labelClasses = "grid gap-1 text-sm";
const labelTextClasses = "font-medium text-zinc-700 dark:text-zinc-300";

export function ProfilFormFields({ profil }: { profil?: Profil }) {
  return (
    <>
      <label className={labelClasses}>
        <span className={labelTextClasses}>Nom</span>
        <input
          type="text"
          name="nom"
          required
          defaultValue={profil?.nom}
          placeholder="ex: Réceptionniste"
          className={champClasses}
        />
      </label>

      <label className={labelClasses}>
        <span className={labelTextClasses}>Villes (séparées par des virgules)</span>
        <input
          type="text"
          name="villes"
          defaultValue={profil?.filtres.villes.join(", ")}
          placeholder="Sherbrooke, Magog"
          className={champClasses}
        />
      </label>

      <label className={labelClasses}>
        <span className={labelTextClasses}>Mots-clés de poste (séparés par des virgules)</span>
        <input
          type="text"
          name="mots_cles"
          defaultValue={profil?.filtres.mots_cles.join(", ")}
          placeholder="développeur junior, support N1"
          className={champClasses}
        />
      </label>

      <label className={labelClasses}>
        <span className={labelTextClasses}>CV de base (référence ou nom de fichier)</span>
        <input
          type="text"
          name="cv_base"
          defaultValue={profil?.cv_base ?? ""}
          placeholder="ex: cv-informaticien-base.docx"
          className={champClasses}
        />
      </label>

      {profil && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="actif"
            defaultChecked={profil.actif}
            className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-700"
          />
          <span className={labelTextClasses}>
            Profil actif (inclus dans la veille quotidienne)
          </span>
        </label>
      )}
    </>
  );
}
