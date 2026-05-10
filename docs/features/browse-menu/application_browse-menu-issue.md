# Consulter le menu : impact package application

**Contexte**
Le package application doit orchestrer la récupération du menu depuis l'infrastructure, appliquer le filtre de catégorie sélectionné et intégrer le solde courant du festivalier pour enrichir les articles avec leur état d'accessibilité.

**Critères d'acceptation**
Feature: Browse menu application use case

1. Scenario: Charger le menu complet avec ses sections et sous-catégories
    Given le menu contient des boissons Non-Alcoholic, Alcoholic Normal et Alcoholic Premium
    And le menu contient des plats Snack et Meal
    When l'application charge le menu
    Then elle retourne une section Drinks et une section Food
    And chaque article est rattaché à sa sous-catégorie

2. Scenario: Conserver tous les articles quand le filtre All est sélectionné
    Given le filtre "All" est sélectionné
    When l'application charge le menu filtré
    Then tous les articles boissons et nourriture sont retournés

3. Scenario: Ne retourner que les boissons quand le filtre Drinks est sélectionné
    Given le filtre "Drinks" est sélectionné
    When l'application charge le menu filtré
    Then seuls les articles de type boisson sont inclus dans le résultat

4. Scenario: Enrichir les articles avec leur état d'accessibilité selon le solde courant
    Given un festivalier avec 1 drink token et 2 food tokens
    And le menu contient une boisson premium coûtant 2 drink tokens et un meal coûtant 3 food tokens
    When l'application charge le menu avec le solde courant
    Then la boisson premium est retournée avec l'état inaccessible
    And le meal est retourné avec l'état inaccessible
