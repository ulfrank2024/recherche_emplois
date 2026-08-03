import type { StatutCandidature } from "./db";

export const STATUTS: {
  valeur: StatutCandidature;
  label: string;
  accent: string;
  dot: string;
}[] = [
  { valeur: "nouvelle", label: "Nouvelle", accent: "border-t-sky-400", dot: "bg-sky-400" },
  { valeur: "à_postuler", label: "À postuler", accent: "border-t-amber-400", dot: "bg-amber-400" },
  { valeur: "postulée", label: "Postulée", accent: "border-t-indigo-400", dot: "bg-indigo-400" },
  { valeur: "entretien", label: "Entretien", accent: "border-t-purple-400", dot: "bg-purple-400" },
  { valeur: "offre_reçue", label: "Offre reçue", accent: "border-t-emerald-400", dot: "bg-emerald-400" },
  { valeur: "refusée", label: "Refusée", accent: "border-t-zinc-400", dot: "bg-zinc-400" },
];
