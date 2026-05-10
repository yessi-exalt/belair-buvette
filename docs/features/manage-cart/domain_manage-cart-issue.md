# Gérer le panier : impact package domain

**Contexte**
Le package domain doit modéliser le panier en séparant le coût total en drink tokens et en food tokens. Il doit exposer une règle permettant de déterminer si un article peut être ajouté compte tenu du solde courant.

**Critères d'acceptation**
Feature: Manage cart domain model

1. Scenario: Calculer le total de drink tokens d'un panier mixte
    Given un panier contenant 1 boisson non alcoolisée, 1 boisson alcoolisée normale et 1 boisson premium
    When le domain calcule le total en drink tokens
    Then le total est 3 drink tokens

2. Scenario: Empêcher l'ajout d'un article qui dépasserait le solde disponible
    Given un festivalier avec 2 drink tokens
    And un panier contenant déjà 1 boisson alcoolisée normale
    When le domain évalue si une boisson premium peut être ajoutée
    Then l'ajout est refusé car le total dépasserait le solde

3. Scenario: Autoriser l'ajout d'un article gratuit même avec un solde nul
    Given un festivalier avec 0 drink token
    And un panier vide
    When le domain évalue si une boisson non alcoolisée peut être ajoutée
    Then l'ajout est autorisé car son coût est nul
