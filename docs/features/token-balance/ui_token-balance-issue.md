# Affichage du solde de tokens : impact package ui

**Contexte**
Le composant TokenBalance accepte drinkTokens et foodTokens comme props et affiche chaque type avec une icône et une couleur distinctes. Un solde nul rend la section correspondante grisée avec un libellé "No tokens remaining". Le composant est responsive et dispose d'une story Storybook pour chaque état.

**Critères d'acceptation**
Feature: TokenBalance component rendering

1. Scenario: Afficher un solde normal de drink et food tokens
    Given un composant TokenBalance avec drinkTokens à 4 et foodTokens à 3
    When le composant est rendu
    Then la section drink tokens affiche 4 avec une icône boisson
    And la section food tokens affiche 3 avec une icône nourriture

2. Scenario: Griser la section drink tokens quand son solde est nul
    Given un composant TokenBalance avec drinkTokens à 0 et foodTokens à 3
    When le composant est rendu
    Then la section drink tokens est affichée grisée
    And le libellé "No tokens remaining" est visible pour les drink tokens

3. Scenario: Griser la section food tokens quand son solde est nul
    Given un composant TokenBalance avec drinkTokens à 2 et foodTokens à 0
    When le composant est rendu
    Then la section food tokens est affichée grisée
    And le libellé "No tokens remaining" est visible pour les food tokens

4. Scenario: Afficher les deux sections grisées quand les deux soldes sont nuls
    Given un composant TokenBalance avec drinkTokens à 0 et foodTokens à 0
    When le composant est rendu
    Then les deux sections affichent le libellé "No tokens remaining"
