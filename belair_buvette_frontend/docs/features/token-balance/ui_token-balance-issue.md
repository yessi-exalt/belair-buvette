# Affichage du solde de tokens : impact package ui

**Contexte**
Le composant TokenBalance accepte drinkTokens et foodTokens comme props et affiche chaque type avec une icône et une couleur distinctes. Un solde nul rend la section correspondante grisée avec un libellé "No tokens remaining". Le composant est responsive et dispose d'une story Storybook pour chaque état.

**Critères d'acceptation**
Feature: TokenBalance component rendering

1. Scenario: Afficher visuellement les deux types de tokens avec des codes distincts
    Given un composant TokenBalance avec drinkTokens à 4 et foodTokens à 3
    When le composant est rendu
    Then la section drink tokens affiche une icône et une couleur dédiées aux boissons
    And la section food tokens affiche une icône et une couleur dédiées à la nourriture

2. Scenario: Griser un solde nul avec le libellé attendu
    Given un composant TokenBalance avec drinkTokens à 0 et foodTokens à 3
    When le composant est rendu
    Then la section drink tokens est affichée en grisé
    And le libellé "No tokens remaining" est visible pour les drink tokens

3. Scenario: Rester lisible sur petit écran
    Given un composant TokenBalance affiché sur un écran mobile
    When le composant est rendu
    Then les sections drink tokens et food tokens restent visibles sans chevauchement

4. Scenario: Exposer une story Storybook pour les états normal, zéro et mixte
    Given la Storybook du composant TokenBalance
    When le développeur consulte les stories disponibles
    Then une story de solde normal est disponible
    And une story de solde nul est disponible
    And une story de solde mixte est disponible
