# Transférer des tokens : impact package infrastructure

**Contexte**
Le package infrastructure doit fournir l'adapter HTTP pour envoyer la demande de transfert à l'API et mapper la réponse ou l'erreur en résultat exploitable par l'application.

**Critères d'acceptation**
Feature: Token transfer infrastructure adapter

1. Scenario: Envoyer la demande de transfert à l'API
    Given un transfert de 2 drink tokens vers "user-42"
    When l'adapter HTTP envoie la requête de transfert
    Then il appelle le endpoint de transfert une seule fois
    And le corps de la requête contient les montants et l'identifiant destinataire

2. Scenario: Mapper une réponse de succès
    Given l'API retourne un succès avec les soldes mis à jour
    When l'adapter HTTP mappe la réponse
    Then il retourne un résultat de succès avec les nouveaux soldes

3. Scenario: Mapper une erreur de destinataire introuvable
    Given l'API répond avec une erreur 404 pour l'identifiant destinataire
    When l'adapter HTTP mappe l'erreur
    Then il retourne un résultat de type RecipientNotFound failure
