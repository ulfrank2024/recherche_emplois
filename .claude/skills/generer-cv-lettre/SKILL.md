---
name: generer-cv-lettre
description: Génère un CV adapté et une lettre de motivation à partir du CV de base d'un profil et du texte/lien d'une offre d'emploi, via l'API Claude.
---

# Générer un CV et une lettre de motivation adaptés

## Quand utiliser ce skill

L'utilisateur fournit un profil (Informaticien, Cuisinier, Gardien de sécurité, ...) et le texte ou le lien d'une offre d'emploi, et veut un CV adapté + une lettre de motivation prêts à envoyer.

## Entrées nécessaires

- Le **profil** concerné (détermine quel CV de base utiliser et, si possible, quelle candidature mettre à jour dans Neon).
- Le **texte de l'offre** (ou son lien — si un lien est fourni, récupérer le texte de la page avant de continuer).
- Le **CV de base** du profil (fichier source, jamais modifié directement).

## Étapes

1. Charger le CV de base du profil (voir la structure de profils dans Neon / le cahier des charges, section 3 et 6).
2. Lire le texte de l'offre pour en extraire les mots-clés, exigences et responsabilités.
3. Appeler l'API Claude (modèle économique — Haiku, voir contrainte de coût section 8 du cahier des charges) avec des instructions claires :
   - adapter le CV de base aux mots-clés et exigences de l'offre, sans inventer d'expérience,
   - rédiger une lettre de motivation courte et professionnelle, en français.
4. Écrire deux nouveaux fichiers (CV adapté, lettre) liés à la candidature — ne jamais écraser le CV de base.
5. Mettre à jour la candidature correspondante dans Neon : CV utilisé, lettre utilisée, statut → `à_postuler`.

## Contraintes à respecter

- Le CV de base n'est **jamais modifié**.
- La clé API Claude vient d'une variable d'environnement (`.env` local, jamais commité).
- Le script et le dashboard Vercel lisent/écrivent dans les mêmes tables Neon — pas de duplication de données.

## Statut

Ce skill décrit le comportement attendu. L'implémentation concrète (script dans `scripts/generer-cv-lettre/`, schéma Neon) reste à construire — voir JOURNAL.md pour l'état d'avancement.
