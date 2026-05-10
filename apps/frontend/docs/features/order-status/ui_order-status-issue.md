# Suivre l'état de la commande : impact package ui

**Contexte**
La page Order Status affiche l'état courant de la commande, un décompte en temps réel quand elle est à l'état Acknowledged, une bannière "Your order is ready!" quand elle est Ready for Pickup, et un bouton d'annulation visible uniquement en état Pending. La page se rafraîchit automatiquement toutes les 30 secondes.

**Critères d'acceptation**
Feature: Order status UI

1. Scenario: Afficher le décompte quand la commande est Acknowledged
    Given une commande à l'état Acknowledged avec 5 minutes restantes
    When la page Order Status est rendue
    Then le décompte de 5 minutes est affiché en temps réel

2. Scenario: Afficher la bannière de succès quand la commande est Ready for Pickup
    Given une commande à l'état Ready for Pickup
    When la page Order Status est rendue
    Then une bannière pleine largeur "Your order is ready!" est affichée

3. Scenario: Afficher le bouton d'annulation uniquement en état Pending
    Given une commande à l'état Pending
    When la page Order Status est rendue
    Then le bouton "Cancel" est visible

4. Scenario: Masquer le bouton d'annulation quand la commande n'est plus Pending
    Given une commande à l'état Acknowledged
    When la page Order Status est rendue
    Then le bouton "Cancel" n'est pas visible
