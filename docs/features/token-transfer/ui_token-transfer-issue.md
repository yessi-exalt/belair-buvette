# Transférer des tokens : impact package ui

**Contexte**
La page "Transfer Tokens" permet au festivalier de saisir l'identifiant du destinataire, de sélectionner les montants à transférer (jusqu'à 3 de chaque type), de confirmer le récapitulatif et de recevoir une notification de succès après le transfert.

**Critères d'acceptation**
Feature: Token transfer UI

1. Scenario: Saisir l'identifiant du destinataire et les deux montants
    Given le festivalier accède à la page Transfer Tokens
    When il saisit l'identifiant "user-42" et sélectionne 2 drink tokens et 1 food token
    Then le formulaire affiche l'identifiant et les deux montants sélectionnés

2. Scenario: Restreindre les sélecteurs au solde disponible et au maximum de 3 par type
    Given un festivalier avec 2 drink tokens et 1 food token
    When il ouvre les sélecteurs de transfert
    Then le sélecteur de drink tokens ne permet pas de dépasser 2
    And le sélecteur de food tokens ne permet pas de dépasser 1

3. Scenario: Afficher l'étape de confirmation avec le récapitulatif complet
    Given un transfert de 2 drink tokens et 1 food token vers "user-42" prêt à être soumis
    When le festivalier accède à l'étape de confirmation
    Then le récapitulatif affiche la source, la destination, les drink tokens et les food tokens

4. Scenario: Afficher une notification de succès après le transfert
    Given un transfert confirmé de 2 drink tokens et 1 food token vers "user-42"
    When le transfert est traité avec succès
    Then une notification de succès est affichée
    And le solde de la page d'accueil est mis à jour
