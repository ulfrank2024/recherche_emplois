"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createProfil, deleteProfil, updateProfil } from "./db";

function parseListe(valeur: FormDataEntryValue | null): string[] {
  return String(valeur ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function lireChampsProfil(formData: FormData) {
  return {
    nom: String(formData.get("nom") ?? "").trim(),
    cvBase: String(formData.get("cv_base") ?? "").trim() || null,
    filtres: {
      villes: parseListe(formData.get("villes")),
      mots_cles: parseListe(formData.get("mots_cles")),
    },
  };
}

function estErreurContrainte(err: unknown, code: string): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code: unknown }).code === code;
}

export async function creerProfilAction(formData: FormData) {
  const champs = lireChampsProfil(formData);

  if (!champs.nom) {
    redirect("/profils?erreur=" + encodeURIComponent("Le nom du profil est requis."));
  }

  try {
    await createProfil(champs);
  } catch (err) {
    if (estErreurContrainte(err, "23505")) {
      redirect(
        "/profils?erreur=" +
          encodeURIComponent(`Un profil nommé "${champs.nom}" existe déjà.`)
      );
    }
    throw err;
  }

  revalidatePath("/profils");
  revalidatePath("/");
  redirect("/profils");
}

export async function modifierProfilAction(id: number, formData: FormData) {
  const champs = lireChampsProfil(formData);
  const actif = formData.get("actif") === "on";

  if (!champs.nom) {
    redirect("/profils?erreur=" + encodeURIComponent("Le nom du profil est requis."));
  }

  try {
    await updateProfil(id, { ...champs, actif });
  } catch (err) {
    if (estErreurContrainte(err, "23505")) {
      redirect(
        "/profils?erreur=" +
          encodeURIComponent(`Un profil nommé "${champs.nom}" existe déjà.`)
      );
    }
    throw err;
  }

  revalidatePath("/profils");
  revalidatePath("/");
  redirect("/profils");
}

export async function supprimerProfilAction(id: number) {
  try {
    await deleteProfil(id);
  } catch (err) {
    if (estErreurContrainte(err, "23503")) {
      redirect(
        "/profils?erreur=" +
          encodeURIComponent(
            "Impossible de supprimer ce profil : il a des candidatures associées. Supprime-les d'abord."
          )
      );
    }
    throw err;
  }

  revalidatePath("/profils");
  revalidatePath("/");
  redirect("/profils");
}
