# Commande groupée : impact package infrastructure

**Contexte**
Le package infrastructure doit fournir l'adapter HTTP pour rejoindre une commande groupée et soumettre la contribution du festivalier, puis mapper les réponses API en résultats exploitables par l'application.

**Critères d'acceptation**
Feature: Group order infrastructure adapter

1. Scenario: Charger les informations d'une commande groupée par code
    Given l'API retourne les données de la commande groupée pour le code "GRP-001"
    When l'adapter HTTP appelle le endpoint de commande groupée
    Then il retourne le résumé mappé avec les totaux groupés en drink tokens et food tokens
    And il retourne le coût restant et la part de chaque contributeur

2. Scenario: Envoyer une contribution mixte à l'API
    Given une contribution de 2 drink tokens et 1 food token
    When l'adapter HTTP envoie la contribution
    Then il appelle le endpoint de contribution une seule fois
    And le corps de la requête contient les montants de drink tokens et food tokens

3. Scenario: Gérer un code de commande groupée invalide
    Given l'API répond avec une erreur 404 pour le code saisi
    When l'adapter HTTP mappe la réponse
    Then il retourne un résultat de type GroupOrderNotFound failure
