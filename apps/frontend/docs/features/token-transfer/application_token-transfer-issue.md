# Transférer des tokens : impact package application

**Contexte**
Le package application doit orchestrer la saisie de l'identifiant du destinataire, la sélection des montants à transférer, la confirmation et la soumission. Après un transfert réussi, le solde de la page d'accueil est mis à jour.

**Critères d'acceptation**
Feature: Token transfer application use case

1. Scenario: Soumettre un transfert valide avec les deux types de tokens
    Given un festivalier avec 4 drink tokens et 3 food tokens transfère 2 drink tokens et 1 food token au destinataire "user-42"
    When l'application soumet le transfert
    Then le transfert est envoyé à l'infrastructure avec les deux montants et l'identifiant destinataire
    And le résultat contient les soldes mis à jour pour la page d'accueil

2. Scenario: Refuser un transfert dépassant le maximum ou le solde disponible
    Given un festivalier avec 2 drink tokens et 1 food token tente de transférer 2 drink tokens et 2 food tokens
    When l'application valide le transfert
    Then le transfert est rejeté avec une erreur de validation
    And aucune requête n'est envoyée

3. Scenario: Retourner une erreur si le destinataire est introuvable
    Given un identifiant destinataire inconnu
    When l'application soumet le transfert
    Then elle retourne une erreur de destinataire introuvable

4. Scenario: Préparer la mise à jour du solde de la page d'accueil après succès
    Given un transfert valide vient d'être confirmé
    When l'application reçoit la réponse de succès
    Then elle expose les nouveaux soldes drink tokens et food tokens
