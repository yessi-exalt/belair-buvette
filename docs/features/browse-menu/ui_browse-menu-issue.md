# Consulter le menu : impact package ui

**Contexte**
La page menu affiche les articles en deux sections (Boissons et Nourriture) avec les sous-catégories correspondantes. Les articles inaccessibles sont visuellement grisés mais restent accessibles. Un filtre par catégorie (Tout / Boissons / Nourriture) permet de restreindre l'affichage.

**Critères d'acceptation**
Feature: Browse menu UI

1. Scenario: Afficher les sections Boissons et Nourriture avec leurs articles
    Given le menu contient 3 boissons et 2 plats
    When la page menu est rendue
    Then une section "Drinks" affichant 3 articles est visible
    And une section "Food" affichant 2 articles est visible

2. Scenario: Griser les articles inaccessibles visuellement
    Given un festivalier avec 1 drink token
    And le menu contient une boisson premium coûtant 2 drink tokens
    When la page menu est rendue
    Then la carte de la boisson premium est affichée de manière grisée

3. Scenario: Filtrer les articles en sélectionnant la catégorie Drinks
    Given le filtre "Drinks" est sélectionné sur la page menu
    When la page est rendue
    Then seules les cartes boissons sont affichées
    And les cartes nourriture ne sont pas visibles

4. Scenario: Afficher "Free" pour les boissons non alcoolisées
    Given le menu contient une boisson non alcoolisée
    When la page menu est rendue
    Then la carte de la boisson non alcoolisée affiche le libellé "Free"
