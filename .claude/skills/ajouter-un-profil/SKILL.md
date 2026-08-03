---
name: ajouter-un-profil
description: Documente la structure à respecter pour créer un nouveau profil de recherche d'emploi (ex: un 4e métier en plus d'Informaticien / Cuisinier / Gardien de sécurité).
---

# Ajouter un nouveau profil de recherche

## Quand utiliser ce skill

L'utilisateur veut chercher un emploi sous un nouveau profil (un métier qui n'est pas encore suivi), sans toucher au code — juste ajouter une entrée de données.

## Ce qu'un profil contient (voir cahier-des-charges-suivi-emploi.md, section 3 et 6)

- un **nom** affiché (ex: "Réceptionniste"),
- un **CV de base** (fichier source, jamais modifié directement par la génération CV/lettre),
- des **filtres de recherche** : villes, mots-clés de poste (peuvent être stockés en JSON dans une colonne Neon si plus simple).

## Étapes pour ajouter un profil

1. Créer/fournir le CV de base du nouveau profil.
2. Définir les filtres : liste de villes, liste de mots-clés de poste pertinents pour ce métier.
3. Insérer une nouvelle ligne dans la table `Profils` de Neon (identifiant, nom, référence au CV de base, filtres).
4. Vérifier que le sélecteur de profil du dashboard et la veille quotidienne prennent bien en compte ce nouveau profil sans changement de code (la structure est prévue pour ça — section 3 du cahier des charges).

## Contraintes à respecter

- Chaque profil est indépendant : aucune donnée (candidatures, CV, filtres) d'un profil ne doit se mélanger avec un autre.
- Pas de changement de code nécessaire pour ajouter un profil — uniquement des données.

## Statut

Ce skill décrit le comportement attendu. Le schéma Neon (table `Profils`) reste à construire — voir JOURNAL.md pour l'état d'avancement.
