# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Le projet

Application personnelle de suivi de recherche d'emploi pour un seul utilisateur (Ulrich). Le cahier des charges complet est dans `cahier-des-charges-suivi-emploi.md` à la racine — **toujours s'y référer avant de prendre une décision d'architecture ou de fonctionnalité**, c'est la source de vérité du projet, pas ce fichier.

Le contexte et les décisions prises au fil du temps sont dans `JOURNAL.md` — le consulter en début de session pour savoir où en est le projet, et y ajouter une entrée après tout travail significatif (nouvelle fonctionnalité, décision technique, problème résolu).

## Architecture (voir cahier des charges, section 5)

Le projet est volontairement simple — **pas de microservices, pas de séparation backend/frontend en services indépendants** (décision confirmée, voir JOURNAL.md 2026-08-02). Trois composants seulement :

1. **Neon (Postgres)** — source de vérité unique : tables `Profils` et `Candidatures`. Accessible depuis le dashboard web comme depuis le script local, via la même chaîne de connexion.
2. **`app/`** — une seule app Next.js déployée sur Vercel, qui contient à la fois le tableau de bord (lecture/écriture Neon) et les fonctions serverless (dont le Cron Job de veille quotidienne). Pas encore scaffoldée.
3. **`scripts/generer-cv-lettre/`** — script exécuté en local (pas sur Vercel) qui appelle l'API Claude pour générer un CV adapté + une lettre de motivation à partir du CV de base d'un profil et du texte d'une offre. Se connecte à la même base Neon. Pas encore implémenté.

Un **profil** (Informaticien, Cuisinier, Gardien de sécurité, ...) regroupe un CV de base et des filtres de recherche (villes, mots-clés). Ajouter un profil ne doit jamais nécessiter de changement de code — voir le skill `ajouter-un-profil`.

## Skills du projet

- `.claude/skills/generer-cv-lettre/SKILL.md` — comment générer un CV/lettre adaptés via l'API Claude pour une offre donnée.
- `.claude/skills/ajouter-un-profil/SKILL.md` — comment ajouter un nouveau profil de recherche sans toucher au code.

## Contraintes importantes (voir cahier des charges, section 8)

- Le CV de base d'un profil n'est **jamais modifié** — chaque génération produit un nouveau fichier.
- Secrets (clé API Claude, chaîne de connexion Neon) : variables d'environnement uniquement — jamais en dur, jamais commités. `.env` est dans `.gitignore`.
- Modèle Claude à utiliser pour la génération CV/lettre : un modèle économique (Haiku), pas besoin de plus pour cette tâche.
- Le dashboard, même hébergé publiquement sur Vercel, doit être protégé par une authentification simple (il contient des données personnelles).
- Statuts de candidature, dans l'ordre : `nouvelle` → `à_postuler` → `postulée` → `entretien` → `offre_reçue` / `refusée`.

## Bug d'encodage connu

L'outil Write de Claude Code double-encode les caractères accentués dans cet environnement (ex: "générés" devient "gÃ©nÃ©rÃ©s"). Pour tout fichier contenant des accents français, écrire via un heredoc bash (`cat > fichier << 'EOF' ... EOF`) plutôt que l'outil Write, et vérifier avec `xxd fichier | grep c383` (doit être vide).

## État d'avancement

Rien n'est encore implémenté (pas de schéma Neon, pas d'app Next.js, pas de script de génération). Voir `JOURNAL.md` pour l'état à jour et `cahier-des-charges-suivi-emploi.md` section 10 pour l'ordre de construction suggéré.
