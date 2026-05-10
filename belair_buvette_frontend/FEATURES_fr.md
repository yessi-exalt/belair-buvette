# Fonctionnalités de la Buvette de Bel'Air

Bienvenue dans le projet **Bel'Air's Buvette** ! Ce document présente les fonctionnalités clés de l'application web et du design system destinés aux festivaliers pour gérer leurs jetons et passer des commandes.

## Fonctionnalités

### En tant que développeureuse, je veux un composant Token Balance pour afficher le solde du festivalier

Règles :
- Le composant accepte `drinkTokens` et `foodTokens` comme props
- Les jetons boisson et nourriture sont visuellement distincts (icônes et couleurs différentes)
- Un solde nul affiche le compteur grisé avec un libellé  Aucun jeton restant 
- Le composant est responsive sur toutes les tailles d'écran
- Une story Storybook présente tous les états : solde normal, solde nul et solde mixte

### En tant que festivalierère, je veux parcourir le menu sur l'application web

Règles :
- La page menu est divisée en deux sections : Boissons et Nourriture
- La section Boissons affiche des sous-catégories : Non-alcoolisées (gratuites) et Alcoolisées (Normale : 1 jeton, Premium : 2 jetons)
- La section Nourriture affiche des sous-catégories : Snacks (1 jeton) et Repas (3 jetons)
- Chaque carte d'article affiche le nom et le coût en jetons ; les boissons non-alcoolisées affichent  Gratuit 
- Les articles que l'utilisateur ne peut pas se permettre sont visuellement grisés mais restent accessibles
- Le menu est filtrable par catégorie (Tout / Boissons / Nourriture)

### En tant que festivalierère, je veux ajouter des articles à un panier et voir le total en cours

Règles :
- Cliquer sur  Ajouter au panier  ajoute l'article au panneau latéral/tiroir du panier
- Le panier affiche le coût courant en jetons boisson et en jetons nourriture séparément
- Les articles peuvent être retirés ou leur quantité ajustée dans le panier
- Si l'ajout d'un article dépasse le solde disponible, le bouton d'ajout est désactivé pour cet article et une infobulle explique pourquoi
- Le sous-total du panier se met à jour en temps réel

### En tant que festivalierère, je veux passer ma commande depuis le panier

Règles :
- Le bouton  Passer la commande  n'est actif que si le panier est non vide et le solde est suffisant
- Un clic affiche une modale de confirmation avec le récapitulatif complet et le temps estimé de préparation
- Après confirmation, la commande est soumise et l'utilisateur est redirigé vers la page de statut de commande
- Le solde affiché se met à jour immédiatement après la commande
- En cas d'erreur (ex. : panne réseau), le panier est conservé et un toast d'erreur s'affiche

### En tant que festivalierère, je veux une page de statut de commande pour suivre ma commande

Règles :
- La page affiche l'état actuel : En attente, Prise en charge, Prête à récupérer ou Annulée
- En état Prise en charge, un décompte du temps estimé de préparation est affiché en direct
- En état Prête à récupérer, une bannière pleine largeur  Votre commande est prête !   s'affiche
- La page se rafraîchit automatiquement toutes les 30 secondes
- Un bouton Annuler est visible uniquement si la commande est en état En attente

### En tant que festivalierère, je veux modifier ou annuler ma commande en attente

Règles :
- Un bouton  Modifier la commande  s'affiche sur la page de statut si la commande est en état En attente
- Un clic ouvre le panier pré-rempli avec les articles actuels de la commande
- Les mêmes règles de panier et de vérification du solde s'appliquent lors de la modification
- Un bouton  Annuler la commande  affiche une boîte de dialogue de confirmation avant l'annulation
- Après une annulation réussie, une bannière de succès s'affiche et le solde est mis à jour

### En tant que groupe de festivaliers, je veux participer à une commande de groupe mutualisée

Règles :
- Une entrée  Rejoindre une commande de groupe  sur la page de commande permet de saisir un code
- Le festivalier sélectionne le nombre de jetons boisson et nourriture à contribuer (dans la limite de son solde)
- Un écran récapitulatif affiche le total des jetons mis en commun, le coût restant et la part de chaque contributeur
- La soumission de la contribution redirige vers la page de statut de commande

### En tant que festivalierère, je veux transférer des jetons à une autre festivalierère

Règles :
- Une page  Transférer des jetons  permet de saisir l'identifiant du destinataire
- Jusqu'à 3 jetons boisson et 3 jetons nourriture peuvent être transférés par transaction
- Les sélecteurs de jetons respectent le solde disponible et le maximum de 3 par type
- Une étape de confirmation affiche la source, la destination et les montants avant soumission
- Une notification de succès s'affiche après transfert confirmé et le solde sur la page d'accueil se met à jour

### En tant que festivalierère, je veux recevoir des rappels d'hydratation dans l'application web

Règles :
- Une notification bannière apparaît dans l'app rappelant au festivalier de boire de l'eau
- Le message est amical et encourage une consommation responsable
- La bannière se ferme automatiquement après 30 secondes mais peut être fermée manuellement
- Les rappels d'hydratation apparaissent toutes les heures entre 11h00 et 19h00
- Si le festivalier a passé plus de 3 commandes de boissons alcoolisées dans la dernière heure, les rappels arrivent toutes les 30 minutes
- Une page d'historique des notifications affiche les rappels passés
