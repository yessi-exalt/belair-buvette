# Consulter le menu : impact package domain

**Contexte**
Le package domain doit modéliser les articles du menu avec leurs catégories (boissons / nourriture), sous-catégories et coûts en tokens. Il doit exposer une règle permettant de déterminer si un article est accessible au festivalier selon son solde courant.

**Critères d'acceptation**
Feature: Browse menu domain model

1. Scenario: Modéliser les sous-catégories de boissons avec leurs coûts
    Given un article de menu de sous-catégorie Non-Alcoholic
    And un article de menu de sous-catégorie Alcoholic Premium
    When le domain calcule leurs coûts
    Then l'article Non-Alcoholic coûte 0 drink token
    And l'article Alcoholic Premium coûte 2 drink tokens

2. Scenario: Modéliser les sous-catégories de nourriture avec leurs coûts
    Given un article de menu de sous-catégorie Snack
    And un article de menu de sous-catégorie Meal
    When le domain calcule leurs coûts
    Then l'article Snack coûte 1 food token
    And l'article Meal coûte 3 food tokens

3. Scenario: Marquer une boisson comme inaccessible si le solde drink est insuffisant
    Given un festivalier avec 1 drink token
    And un article de type boisson premium coûtant 2 drink tokens
    When le domain évalue l'accessibilité de l'article
    Then l'article est marqué comme inaccessible

4. Scenario: Marquer un plat comme inaccessible si le solde food est insuffisant
    Given un festivalier avec 2 food tokens
    And un article de type meal coûtant 3 food tokens
    When le domain évalue l'accessibilité de l'article
    Then l'article est marqué comme inaccessible
