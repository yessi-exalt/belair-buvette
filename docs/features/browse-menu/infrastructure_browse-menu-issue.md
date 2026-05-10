# Consulter le menu : impact package infrastructure

**Contexte**
Le package infrastructure doit fournir un adapter HTTP chargé de récupérer les articles du menu depuis l'API Bel'Air et de les convertir en modèles domain exploitables par l'application.

**Critères d'acceptation**
Feature: Browse menu infrastructure adapter

1. Scenario: Récupérer et mapper les articles du menu depuis l'API
    Given l'API retourne une liste de 5 articles de menu
    When l'adapter HTTP appelle le endpoint menu
    Then il retourne 5 articles mappés en modèles domain

2. Scenario: Mapper les catégories et sous-catégories attendues
    Given l'API retourne des articles Non-Alcoholic, Alcoholic Normal, Alcoholic Premium, Snack et Meal
    When l'adapter HTTP mappe la réponse
    Then les articles boissons sont rattachés à la section Drinks avec leurs sous-catégories
    And les articles nourriture sont rattachés à la section Food avec leurs sous-catégories

3. Scenario: Conserver le coût nul d'une boisson non alcoolisée
    Given l'API retourne une boisson non alcoolisée avec un coût nul
    When l'adapter HTTP mappe la réponse
    Then le modèle retourné conserve un coût de 0 drink token

4. Scenario: Retourner une erreur de transport en cas d'échec réseau
    Given la requête réseau vers le endpoint menu échoue
    When l'adapter HTTP tente de récupérer le menu
    Then il retourne un résultat de type transport failure
    And aucun article n'est produit
