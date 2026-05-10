# Consulter le menu : impact package ui

**Contexte**
La page menu affiche les articles en deux sections (Boissons et Nourriture) avec les sous-catégories correspondantes. Les articles inaccessibles sont visuellement grisés mais restent accessibles. Un filtre par catégorie (Tout / Boissons / Nourriture) permet de restreindre l'affichage.

**Critères d'acceptation**
Feature: Browse menu UI

1. Scenario: Afficher les sections Drinks et Food avec leurs sous-catégories
    Given le menu contient des boissons Non-Alcoholic, Alcoholic Normal et Alcoholic Premium
    And le menu contient des plats Snack et Meal
    When la page menu est rendue
    Then une section "Drinks" est visible avec les sous-catégories attendues
    And une section "Food" est visible avec les sous-catégories Snack et Meal

2. Scenario: Afficher le filtre All avec tous les articles du menu
    Given le filtre "All" est sélectionné sur la page menu
    When la page est rendue
    Then les cartes boissons sont visibles
    And les cartes nourriture sont visibles

3. Scenario: Filtrer les articles en sélectionnant la catégorie Drinks
    Given le filtre "Drinks" est sélectionné sur la page menu
    When la page est rendue
    Then seules les cartes boissons sont affichées
    And les cartes nourriture ne sont pas visibles

4. Scenario: Filtrer les articles en sélectionnant la catégorie Food
    Given le filtre "Food" est sélectionné sur la page menu
    When la page est rendue
    Then seules les cartes nourriture sont affichées
    And les cartes boissons ne sont pas visibles

5. Scenario: Garder un article inaccessible visible mais visuellement atténué
    Given un festivalier avec 1 drink token
    And le menu contient une boisson premium coûtant 2 drink tokens et une boisson non alcoolisée
    When la page menu est rendue
    Then la carte de la boisson premium est affichée de manière grisée
    And la carte de la boisson non alcoolisée affiche le libellé "Free"
