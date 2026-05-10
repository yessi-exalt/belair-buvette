# Transférer des tokens : impact package application

**Contexte**
Le package application doit orchestrer la saisie de l'identifiant du destinataire, la sélection des montants à transférer, la confirmation et la soumission. Après un transfert réussi, le solde de la page d'accueil est mis à jour.

**Critères d'acceptation**
Feature: Token transfer application use case

1. Scenario: Soumettre un transfert valide
    Given un festivalier avec 4 drink tokens transfère 2 drink tokens au destinataire "user-42"
    When l'application soumet le transfert
    Then le transfert est envoyé à l'infrastructure avec les montants et l'identifiant destinataire
    And le solde restant est 2 drink tokens

2. Scenario: Refuser un transfert dépassant le solde
    Given un festivalier avec 1 drink token tente de transférer 2 drink tokens
    When l'application valide le transfert
    Then le transfert est rejeté avec une erreur de solde insuffisant
    And aucune requête n'est envoyée

3. Scenario: Retourner une erreur si le destinataire est introuvable
    Given un identifiant destinataire inconnu
    When l'application soumet le transfert
    Then elle retourne une erreur de destinataire introuvable
