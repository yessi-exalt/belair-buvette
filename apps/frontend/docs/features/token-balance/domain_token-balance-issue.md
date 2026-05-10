# Affichage du solde de tokens : impact package domain

**Contexte**
Le package domain doit modéliser les deux types de tokens (drink tokens et food tokens), leurs valeurs numériques et fournir une règle permettant de détecter si un solde est nul pour chaque type.

**Critères d'acceptation**
Feature: Token balance domain model

1. Scenario: Modéliser un solde mixte drink et food tokens
    Given un solde initialisé avec 6 drink tokens et 9 food tokens
    When le domain crée un objet TokenBalance
    Then l'objet expose 6 pour les drink tokens et 9 pour les food tokens

2. Scenario: Détecter un solde de drink tokens nul
    Given un solde de 0 drink tokens et 3 food tokens
    When le domain évalue si les drink tokens sont vides
    Then les drink tokens sont marqués comme nuls

3. Scenario: Détecter un solde de food tokens nul
    Given un solde de 4 drink tokens et 0 food tokens
    When le domain évalue si les food tokens sont vides
    Then les food tokens sont marqués comme nuls

4. Scenario: Considérer les deux soldes comme non nuls quand ils sont positifs
    Given un solde de 2 drink tokens et 5 food tokens
    When le domain évalue l'état des deux types de tokens
    Then ni les drink tokens ni les food tokens ne sont marqués comme nuls
