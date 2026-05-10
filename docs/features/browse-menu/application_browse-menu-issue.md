# Consulter le menu : impact package application

**Contexte**
Le package application doit orchestrer la récupération du menu depuis l'infrastructure, appliquer le filtre de catégorie sélectionné et intégrer le solde courant du festivalier pour enrichir les articles avec leur état d'accessibilité.

**Critères d'acceptation**
Feature: Browse menu application use case

1. Scenario: Charger l'ensemble du menu sans filtre actif
    Given aucun filtre de catégorie sélectionné
    When l'application charge le menu
    Then tous les articles boissons et nourriture sont retournés

2. Scenario: Filtrer le menu par catégorie Drinks
    Given le filtre "Drinks" est sélectionné
    When l'application charge le menu filtré
    Then seuls les articles de type boisson sont inclus dans le résultat

3. Scenario: Filtrer le menu par catégorie Food
    Given le filtre "Food" est sélectionné
    When l'application charge le menu filtré
    Then seuls les articles de type nourriture sont inclus dans le résultat

4. Scenario: Marquer les articles inaccessibles selon le solde courant
    Given un festivalier avec 1 drink token
    And le menu contient une boisson premium coûtant 2 drink tokens
    When l'application charge le menu avec le solde courant
    Then la boisson premium est retournée avec l'état inaccessible
