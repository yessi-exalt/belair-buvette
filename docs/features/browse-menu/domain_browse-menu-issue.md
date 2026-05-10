# Consulter le menu : impact package domain

**Contexte**
Le package domain doit modéliser les articles du menu avec leurs catégories (boissons / nourriture), sous-catégories et coûts en tokens. Il doit exposer une règle permettant de déterminer si un article est accessible au festivalier selon son solde courant.

**Critères d'acceptation**
Feature: Browse menu domain model

1. Scenario: Calculer le coût nul d'une boisson non alcoolisée
    Given un article de menu de type boisson non alcoolisée
    When le domain calcule son coût en drink tokens
    Then le coût est 0 drink token

2. Scenario: Calculer le coût d'une boisson alcoolisée normale
    Given un article de menu de type boisson alcoolisée normale
    When le domain calcule son coût en drink tokens
    Then le coût est 1 drink token

3. Scenario: Calculer le coût d'une boisson alcoolisée premium
    Given un article de menu de type boisson alcoolisée premium
    When le domain calcule son coût en drink tokens
    Then le coût est 2 drink tokens

4. Scenario: Marquer un article comme inaccessible si le solde est insuffisant
    Given un festivalier avec 1 drink token
    And un article de type boisson alcoolisée premium coûtant 2 drink tokens
    When le domain évalue l'accessibilité de l'article
    Then l'article est marqué comme inaccessible
