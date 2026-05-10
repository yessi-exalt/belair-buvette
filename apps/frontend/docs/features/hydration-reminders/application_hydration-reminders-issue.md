# Rappels d'hydratation : impact package application

**Contexte**
Le package application doit orchestrer l'affichage des rappels d'hydratation en fonction des règles du domain, gérer l'auto-fermeture après 30 secondes et maintenir un historique des rappels passés.

**Critères d'acceptation**
Feature: Hydration reminder application use case

1. Scenario: Planifier l'affichage d'un rappel selon la fréquence calculée
    Given le domain indique une fréquence de rappel horaire
    When l'application planifie le prochain rappel
    Then le prochain rappel est déclenché dans 60 minutes

2. Scenario: Marquer le rappel comme fermé après 30 secondes
    Given un rappel d'hydratation affiché à l'écran
    When 30 secondes s'écoulent sans interaction
    Then l'application marque le rappel comme fermé automatiquement

3. Scenario: Enregistrer le rappel dans l'historique après affichage
    Given un rappel d'hydratation a été affiché et fermé
    When le festivalier consulte l'historique des notifications
    Then le rappel est présent dans l'historique avec son horodatage
