# Consulter le menu : impact package infrastructure

**Contexte**
Le package infrastructure doit fournir un adapter HTTP chargé de récupérer les articles du menu depuis l'API Bel'Air et de les convertir en modèles domain exploitables par l'application.

**Critères d'acceptation**
Feature: Browse menu infrastructure adapter

1. Scenario: Récupérer et mapper les articles du menu depuis l'API
    Given l'API retourne une liste de 5 articles de menu
    When l'adapter HTTP appelle le endpoint menu
    Then il retourne 5 articles mappés en modèles domain

2. Scenario: Distinguer les catégories boissons et nourriture dans la réponse
    Given l'API retourne 2 boissons et 3 plats
    When l'adapter HTTP mappe la réponse
    Then 2 articles sont de catégorie boissons et 3 de catégorie nourriture

3. Scenario: Retourner une erreur de transport en cas d'échec réseau
    Given la requête réseau vers le endpoint menu échoue
    When l'adapter HTTP tente de récupérer le menu
    Then il retourne un résultat de type transport failure
    And aucun article n'est produit
