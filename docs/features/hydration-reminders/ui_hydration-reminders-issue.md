# Rappels d'hydratation : impact package ui

**Contexte**
Une bannière de notification s'affiche dans l'application pour rappeler au festivalier de boire de l'eau avec un message bienveillant. La bannière s'auto-ferme après 30 secondes et peut être fermée manuellement. Une page d'historique liste les rappels passés.

**Critères d'acceptation**
Feature: Hydration reminder UI

1. Scenario: Afficher la bannière de rappel avec un message d'encouragement
    Given un rappel d'hydratation est déclenché
    When la bannière est rendue
    Then elle affiche un message bienveillant encourageant à boire de l'eau

2. Scenario: Auto-fermer la bannière après 30 secondes
    Given une bannière de rappel est affichée à l'écran
    When 30 secondes s'écoulent sans interaction
    Then la bannière se ferme automatiquement

3. Scenario: Fermer la bannière manuellement
    Given une bannière de rappel est affichée à l'écran
    When le festivalier clique sur le bouton de fermeture
    Then la bannière disparaît immédiatement

4. Scenario: Afficher l'historique des rappels passés
    Given le festivalier accède à la page d'historique des notifications
    When la page est rendue
    Then les rappels passés sont listés avec leurs horodatages
