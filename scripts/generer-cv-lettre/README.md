# scripts/generer-cv-lettre/ — Génération locale de CV et lettre

Script exécuté en local par Ulrich (terminal), qui :

1. prend le CV de base du profil concerné + le texte/lien de l'offre,
2. appelle l'API Claude (modèle économique, Haiku) pour adapter le CV et rédiger une lettre de motivation,
3. écrit les deux fichiers produits (jamais le CV de base original),
4. met à jour la candidature correspondante dans Neon (CV utilisé, lettre utilisée, statut → `à_postuler`).

Voir cahier-des-charges-suivi-emploi.md, section 4.4, et le skill `.claude/skills/generer-cv-lettre/SKILL.md`.

Clé API Claude et chaîne de connexion Neon : dans un fichier `.env` local, jamais commité (voir `.gitignore`).
