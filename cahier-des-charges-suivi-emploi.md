# Cahier des charges — Application de suivi de recherche d'emploi

## 1. Contexte

Ulrich cherche un emploi en informatique (support N1/N2/N3, développeur junior) à Sherbrooke, et souhaite aussi pouvoir chercher sous d'autres profils (cuisinier, gardien de sécurité). Le processus actuel (recherche manuelle sur plusieurs sites, candidatures non suivies) est chronophage et difficile à garder en tête. L'objectif est un outil personnel qui automatise la veille quotidienne et le suivi des candidatures, et qui aide à adapter CV et lettre de motivation à chaque offre.

**Choix d'architecture (v2) :** le suivi (offres, statuts, candidatures) doit être consultable et modifiable de n'importe où, pas seulement depuis la machine d'Ulrich à la maison. La partie tableau de bord + veille quotidienne est donc hébergée en ligne (Vercel pour le site/les fonctions serverless, Neon pour la base de données Postgres). Seule la génération de CV/lettre reste déclenchée en local avec Claude — mais elle lit et écrit dans la même base Neon, donc tout reste synchronisé peu importe où l'action a lieu.

Ce document est la référence à donner à Claude (via Claude Code, en local) pour construire le projet. Il ne contient pas de code — seulement ce que l'application doit faire et comment elle doit être structurée.

## 2. Objectifs du projet

1. Chercher automatiquement, chaque jour, de nouvelles offres d'emploi selon des filtres définis (ville, mots-clés de poste, profil actif).
2. Prévenir l'utilisateur des nouvelles offres trouvées, sans noyer l'information dans une conversation — une seule source de vérité consultable à tout moment.
3. Suivre chaque candidature : statut, CV et lettre utilisés, dates, résultat (entretien obtenu, refus, etc.).
4. Générer automatiquement, à la demande, un CV et une lettre de motivation adaptés à une offre précise, à partir d'un CV de base et du texte de l'offre, via l'API Claude.
5. Permettre de gérer plusieurs profils de recherche indépendants (informaticien, cuisinier, gardien de sécurité, etc.) avec un CV de base et des filtres propres à chacun, et de basculer facilement de l'un à l'autre.

## 3. Utilisateurs et profils

Utilisateur unique : Ulrich, avec un accès au tableau de bord depuis n'importe quel appareil (ordinateur à la maison, au travail, téléphone).

Un **profil** regroupe :
- un nom (ex: "Informaticien")
- un CV de base (fichier source, jamais modifié directement)
- une liste de filtres de recherche (villes, mots-clés de poste)

Profils à prévoir dès le départ : Informaticien, Cuisinier, Gardien de sécurité. La structure doit permettre d'en ajouter d'autres facilement sans changer le code (juste ajouter une entrée dans les données).

## 4. Fonctionnalités

### 4.1 Veille quotidienne automatisée (MVP)

- Une tâche planifiée qui s'exécute une fois par jour, hébergée sur Vercel (Cron Job appelant une fonction serverless) — tourne même si l'ordinateur d'Ulrich est éteint.
- Pour chaque profil actif, elle recherche les offres correspondant à ses filtres (ville + mots-clés de poste).
- Les nouvelles offres (pas déjà connues) sont ajoutées à la base Neon avec le statut `nouvelle`.
- Pas de notification push/SMS dans la V1 — l'utilisateur consulte le tableau de bord en ligne quand il le souhaite. (Une notification plus riche — email, par exemple — peut être une évolution future, pas un prérequis du MVP.)
- Contrainte à connaître : sur le plan gratuit Vercel (Hobby), un Cron Job ne peut pas s'exécuter plus d'une fois par jour, il tourne en heure UTC, et l'heure exacte de déclenchement n'est garantie qu'à l'intérieur de l'heure programmée (ex: prévu à 8h, peut se déclencher jusqu'à 9h) — largement suffisant pour ce besoin, mais à ne pas planifier avec une précision à la minute près.

### 4.2 Tableau de bord en ligne (MVP)

- Une page web déployée sur Vercel, accessible depuis n'importe quel appareil avec Ulrich connecté (à la maison, au travail, sur son téléphone), qui affiche :
  - un sélecteur de profil (Informaticien / Cuisinier / Gardien de sécurité / ...)
  - la liste des offres et candidatures du profil actif, groupées par statut
  - pour chaque candidature : poste, entreprise, ville, lien vers l'offre originale, statut, CV utilisé, lettre utilisée, date de candidature, date d'entretien, notes libres
- Le tableau de bord lit et écrit directement dans la base Neon (changer un statut, ajouter une note, doit se refléter immédiatement).
- La source de vérité est la base de données Neon (voir section 6), pas la conversation avec Claude ni un fichier local — c'est ce qui permet la consultation à distance.

### 4.3 Suivi des candidatures (MVP)

Statuts possibles, dans cet ordre logique :
`nouvelle` → `à_postuler` → `postulée` → `entretien` → `offre_reçue` / `refusée`

L'utilisateur doit pouvoir changer le statut d'une candidature facilement (directement dans le fichier de données, ou via une action simple dans le tableau de bord).

Chaque candidature garde en mémoire : quelle offre, quel profil, quel CV et quelle lettre ont été utilisés pour postuler, et les dates clés.

### 4.4 Génération de CV et lettre de motivation adaptés (MVP)

- Déclenchée à la demande par l'utilisateur, depuis un terminal : il fournit le texte ou le lien d'une offre, et précise le profil concerné.
- Le programme prend le CV de base du profil + le texte de l'offre, appelle l'API Claude avec des instructions claires (adapter le CV aux mots-clés et exigences de l'offre, rédiger une lettre de motivation courte et professionnelle en français), et produit deux fichiers (CV adapté, lettre) prêts à être utilisés.
- Le CV de base original n'est **jamais modifié** — chaque génération produit un nouveau fichier lié à la candidature concernée.
- Après génération, la candidature correspondante dans les données est mise à jour (CV utilisé, lettre utilisée, statut passé à `à_postuler`).

### 4.5 Gestion multi-profils (MVP)

- Changer de profil actif doit être une action simple (un paramètre, ou un sélecteur dans le tableau de bord).
- Chaque profil a ses propres filtres de recherche et son propre CV de base — aucune donnée d'un profil ne doit se mélanger avec un autre.

### 4.6 Évolutions possibles (hors MVP, à ne pas construire tout de suite)

- Notifications par email ou SMS.
- Détection de doublons plus intelligente entre plateformes (une même offre republiée ailleurs).
- Statistiques (taux de réponse par profil, délai moyen avant entretien, etc.).
- Interface plus riche que le tableau de bord local (si le besoin devient plus grand).

## 5. Architecture technique proposée

Principe directeur : rester aussi simple que possible tout en répondant au vrai besoin d'Ulrich — consulter et faire évoluer son suivi de candidatures depuis n'importe où. La génération de CV/lettre, elle, n'a pas besoin d'être accessible à distance et reste locale.

Composants :

1. **Une base de données Neon (Postgres serverless, gratuite)** qui sert de source de vérité unique : profils, filtres, candidatures. Accessible depuis le web (dashboard) comme depuis le script local (génération CV/lettre) via la même chaîne de connexion.
2. **Un site déployé sur Vercel** (plan Hobby, gratuit, usage personnel) qui contient :
   - le tableau de bord (pages consultées par Ulrich, lecture/écriture dans Neon)
   - une fonction serverless de recherche d'offres, déclenchée quotidiennement par un Vercel Cron Job, qui ajoute les nouvelles offres trouvées dans Neon
3. **Un script de génération CV/lettre**, exécuté en local par Ulrich via Claude Code ou un script Python, qui utilise l'API Claude (clé API personnelle, jamais en dur dans le code, jamais commitée dans Git) et se connecte à la même base Neon pour lire l'offre concernée et écrire le résultat (CV utilisé, lettre utilisée, statut mis à jour).

Coûts attendus : nuls en usage normal — Vercel Hobby et Neon ont tous deux un plan gratuit permanent largement suffisant pour ce volume (quelques dizaines de candidatures, un cron par jour). Seul coût réel : l'usage ponctuel de l'API Claude pour la génération CV/lettre (de l'ordre de quelques centimes par génération).

**Point de vigilance :** le plan gratuit Vercel Hobby est explicitement réservé à un usage personnel, non commercial — ce qui correspond exactement à ce projet. Si jamais Ulrich transformait cet outil en produit pour d'autres personnes plus tard, il faudrait revoir cette base (comme pour les projets business dont on a discuté séparément).

## 6. Modèle de données (structure attendue)

La base Neon doit contenir deux tables principales :

**Profils** — pour chaque profil : identifiant, nom affiché, référence ou contenu du CV de base, filtres (villes, mots-clés de poste — peuvent être stockés en JSON dans une colonne si plus simple).

**Candidatures** — pour chaque offre suivie : identifiant, date de découverte, profil associé (clé étrangère vers Profils), titre du poste, entreprise, ville, lien vers l'offre, statut, CV utilisé, lettre utilisée, date de candidature, date d'entretien, notes libres.

Le script local de génération CV/lettre et le site Vercel doivent lire/écrire dans les mêmes tables — aucune duplication de données entre "ce qui est en ligne" et "ce qui est local".

## 7. Scénarios d'utilisation types

**Scénario A — Veille quotidienne.** Chaque matin, la tâche planifiée tourne, trouve 2 nouvelles offres pour le profil Informaticien. Elles apparaissent dans le fichier de données avec le statut `nouvelle`. Ulrich ouvre le tableau de bord quand il a le temps et les voit groupées en haut.

**Scénario B — Candidature avec CV adapté.** Ulrich repère une offre intéressante dans le tableau de bord. Il lance le script de génération avec le lien ou texte de l'offre et le profil concerné. Il obtient un CV et une lettre adaptés, les envoie à l'employeur, puis met à jour le statut de la candidature à `postulée`.

**Scénario C — Changement de profil.** Ulrich veut chercher un poste de gardien de sécurité en parallèle. Il active le profil Gardien de sécurité — la veille quotidienne et le tableau de bord utilisent alors les filtres et le CV propres à ce profil, sans toucher aux données du profil Informaticien.

**Scénario D — Entretien obtenu.** Un employeur répond pour un entretien. Ulrich met à jour le statut de la candidature correspondante à `entretien` et note la date — cette information reste visible et centralisée, contrairement à un fil de conversation.

## 8. Contraintes

- **Coût maîtrisé** : usage de l'API Claude uniquement à la demande (génération CV/lettre), pas en continu. Privilégier un modèle économique (Claude Haiku) pour cet usage, largement suffisant pour la tâche. Vercel Hobby et Neon free tier couvrent le reste sans frais tant que l'usage reste personnel et de faible volume.
- **Sécurité des secrets** : la clé API Claude et la chaîne de connexion Neon ne doivent jamais être écrites en dur dans un fichier suivi par Git ; elles doivent être stockées en variables d'environnement (dans les réglages du projet Vercel pour la partie en ligne, dans un fichier `.env` ignoré par Git pour le script local).
- **Un seul accès authentifié** : même hébergé publiquement sur Vercel, le tableau de bord contient des informations personnelles (candidatures, CV) — il doit être protégé par une authentification simple (mot de passe ou lien privé), pas ouvert à n'importe qui sur internet.
- **Simplicité au-delà de l'hébergement** : héberger le dashboard et la base est justifié par le besoin réel d'accès à distance, mais ça reste la seule complexité ajoutée — pas d'authentification multi-utilisateurs, pas de queue de traitement, pas de microservices.
- **Portabilité des données** : même en ligne, Ulrich doit pouvoir exporter ou consulter facilement le contenu de sa base (Neon permet une connexion directe avec n'importe quel client Postgres) — pas de dépendance totale à l'interface web.

## 9. Hors périmètre (volontairement exclu du MVP)

- Scraping en temps réel ou multi-fois par jour — une passe quotidienne suffit.
- Système de comptes utilisateurs ou de partage avec d'autres personnes (un seul utilisateur : Ulrich).
- Application mobile native (le site web fonctionne aussi depuis un navigateur mobile).
- Notifications par email ou SMS dans la V1 (voir 4.6).

## 10. Prochaines étapes suggérées

1. Remplir un premier CV de base par profil (Informaticien en priorité).
2. Définir précisément les filtres de recherche par profil (villes, mots-clés).
3. Créer les comptes Vercel et Neon (gratuits), et récupérer la chaîne de connexion Neon.
4. Construire dans l'ordre : le schéma de la base Neon → le tableau de bord (lecture seule d'abord) → les actions d'écriture (changer un statut) → le script de génération CV/lettre en local → la tâche planifiée quotidienne en dernier (c'est la partie la plus fragile à faire tourner correctement, mieux vaut valider le reste avant).

## 11. Correspondance avec les pratiques DevOps vues précédemment

Ce projet s'inspire de la méthodologie montrée par le frère d'Ulrich (skills Claude, CI/CD, GitOps, agents autonomes), adaptée à l'échelle réelle d'un projet solo. Certaines briques transfèrent directement, d'autres sont déjà remplacées par les choix d'architecture, et certaines ne s'appliquent tout simplement pas à cette taille de projet.

**Transfère directement, à mettre en place dès le départ :**
- Dépôt Git propre et versionné.
- Un dossier `.claude/skills/` à la racine du projet, avec des skills propres à ce projet — par exemple `generer-cv-lettre/SKILL.md` (documente comment appeler l'API Claude avec le bon format d'entrée/sortie) et `ajouter-un-profil/SKILL.md` (documente la structure à respecter pour créer un nouveau profil de recherche). Même principe que le repo factory-skills du frère d'Ulrich, appliqué ici.

**Déjà couvert par Vercel + Neon, pas besoin de le recréer :**
- CI/CD façon Jenkins : Vercel déploie automatiquement à chaque push Git.
- GitOps façon ArgoCD : le tableau de bord de déploiement Vercel montre déjà l'état de chaque déploiement.
- Kubernetes / Harbor : pas de conteneurs à gérer soi-même, Vercel s'en charge.

**Hors de propos à cette échelle (ne pas ajouter) :**
- Keycloak : beaucoup trop lourd pour un dashboard à un seul utilisateur — une authentification simple (mot de passe en variable d'environnement, ou solution légère type Clerk/NextAuth en plan gratuit) suffit.
- Kafka : aucun besoin de file de messages avec un seul utilisateur et un faible volume d'événements.

**Transfère sous une autre forme :**
- L'agent IA autonome (observer → décider → agir → vérifier) : la tâche cron quotidienne sur Vercel remplit exactement ce rôle — elle observe les nouvelles offres, décide si elles sont déjà connues, agit en les ajoutant à la base. Pas besoin de construire un "agent" séparé, l'automatisation prévue en est déjà un.

## 12. Journal de bord du projet

Le projet doit contenir un fichier `JOURNAL.md` à la racine, qui sert de mémoire du projet dans le temps — utile aussi bien pour Ulrich que pour Claude Code d'une session à l'autre.

À chaque session de travail significative (une fonctionnalité construite, une décision technique prise, un problème résolu), une nouvelle entrée est ajoutée en haut du fichier, avec :
- la date
- ce qui a été fait ou décidé
- pourquoi (si la décision n'est pas évidente)
- ce qui reste à faire ensuite

Ce fichier n'est pas un changelog technique automatique (type liste de commits) — c'est un résumé humain et lisible, qui permet de reprendre le projet après une pause sans avoir à tout se remémorer ou à relire tout le code. Il doit être commité dans Git comme le reste du projet.

Exemple de format d'entrée :

```
## 2026-08-15
- Fait : schéma Neon créé (tables profils + candidatures), déployé.
- Décision : authentification par mot de passe simple plutôt que Clerk, pour rester gratuit tant que l'usage reste solo.
- Prochaine étape : construire le tableau de bord en lecture seule.
```
