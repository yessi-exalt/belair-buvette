# Examples

Use these examples to infer the expected level of decomposition across frontend
packages, the required file naming, and when to ask for clarification instead
of inventing missing requirements.

Even when the user request mentions a page, a shared component, or a feature
slice, the generated issue files must still use the repository package prefixes:
`domain_`, `application_`, `infrastructure_`, and `ui_`.

## Positive Example 1: simple request, one feature across three packages

Input: "As a festival goer, I want to add items to a cart and see the running total"

Output:
Three files: one for the domain rules, one for the application orchestration, and one for the rendered UI.

file `docs/features/manage-cart/domain_manage-cart-issue.md`
```markdown
# Gérer le panier : impact package domain

**Contexte**
Le package domain doit modéliser le panier en séparant le coût total en drink
tokens et en food tokens. Il doit exposer une règle permettant de déterminer si
un article peut être ajouté compte tenu du solde courant.

**Critères d'acceptation**
Feature: Manage cart domain model

1. Scenario: Calculer séparément les sous-totaux drink et food d'un panier mixte
    Given un panier contenant 1 boisson alcoolisée normale et 1 meal
    When le domain calcule les sous-totaux du panier
    Then le sous-total drink est 1 drink token
    And le sous-total food est 3 food tokens

2. Scenario: Empêcher l'ajout d'un article qui dépasserait le solde disponible
    Given un festivalier avec 2 food tokens
    And un panier contenant déjà 1 snack
    When le domain évalue si un meal peut être ajouté
    Then l'ajout est refusé car le total dépasserait le solde food disponible
```

file `docs/features/manage-cart/application_manage-cart-issue.md`
```markdown
# Gérer le panier : impact package application

**Contexte**
Le package application gère l'état du panier : ajout d'articles, suppression,
ajustement des quantités et mise à jour du total en temps réel. Il vérifie que
chaque ajout reste compatible avec le solde courant avant de modifier l'état.

**Critères d'acceptation**
Feature: Manage cart application use case

1. Scenario: Ajouter un article au panier et mettre à jour les sous-totaux en temps réel
    Given un festivalier avec 4 drink tokens et 4 food tokens
    And un panier vide
    When l'application ajoute 1 boisson alcoolisée normale et 1 snack
    Then le panier contient 2 articles
    And le sous-total drink affiché est 1 drink token
    And le sous-total food affiché est 1 food token

2. Scenario: Refuser l'ajout d'un article quand le solde est insuffisant
    Given un festivalier avec 1 food token
    And un panier contenant déjà 1 snack
    When l'application tente d'ajouter 1 meal
    Then l'ajout est refusé
    And l'état retourné explique qu'un tooltip doit être affiché
```

file `docs/features/manage-cart/ui_manage-cart-issue.md`
```markdown
# Gérer le panier : impact package ui

**Contexte**
Le composant panier affiche les articles sélectionnés, les sous-totaux courants,
et les contrôles d'ajout ou de suppression avec les états désactivés attendus.

**Critères d'acceptation**
Feature: Manage cart UI

1. Scenario: Afficher le panier dans un drawer avec les sous-totaux drink et food
    Given un festivalier ajoute 1 boisson alcoolisée normale et 1 snack au panier
    When le drawer du panier est rendu
    Then le panier affiche les 2 articles sélectionnés
    And le sous-total drink affiché est 1 drink token
    And le sous-total food affiché est 1 food token

2. Scenario: Désactiver le bouton Add to cart quand l'ajout dépasserait le solde
    Given un festivalier avec 1 food token
    And un panier contenant déjà 1 snack
    When la page menu est rendue avec un meal visible
    Then le bouton "Add to cart" du meal est désactivé
    And un tooltip expliquant l'insuffisance de solde est accessible
```

## Positive Example 2: complex request, one feature across all packages

Input: "As a festival goer, I want to place my order from the cart, confirm it, and then track it from the order status page"

Output:
Four files: one per impacted package for the `order-status` feature.

file `docs/features/order-status/domain_order-status-issue.md`
```markdown
# Suivre une commande : impact package domain

**Contexte**
Le package domain décrit l'état affichable d'une commande, ses transitions, et
les informations dérivées comme le texte lisible et les indicateurs temporels.

**Critères d'acceptation**
Feature: Order status domain model

1. Scenario: Exposer un libellé lisible pour une commande prête
    Given une commande dans l'état Ready for Pickup
    When le domain expose son état de suivi
    Then le libellé affichable est cohérent avec une commande prête à être retirée
```

file `docs/features/order-status/application_order-status-issue.md`
```markdown
# Suivre une commande : impact package application

**Contexte**
Le package application orchestre le chargement initial de la commande et le
rafraîchissement périodique de son statut pour la page de suivi.

**Critères d'acceptation**
Feature: Order status application flow

1. Scenario: Charger une commande à partir de son identifiant
    Given un identifiant de commande connu
    When l'application initialise le suivi de commande
    Then elle demande la commande correspondante à l'infrastructure

2. Scenario: Rafraîchir automatiquement le statut de la commande
    Given la page de suivi est ouverte
    When 30 secondes s'écoulent
    Then l'application déclenche un nouveau chargement du statut
```

file `docs/features/order-status/infrastructure_order-status-issue.md`
```markdown
# Suivre une commande : impact package infrastructure

**Contexte**
Le package infrastructure traduit les appels de l'application vers l'API et mappe
la réponse HTTP vers le modèle consommé par le frontend.

**Critères d'acceptation**
Feature: Order status infrastructure adapter

1. Scenario: Mapper une réponse API de commande vers le modèle frontend
    Given une réponse backend contenant un statut de commande et un temps restant
    When l'adaptateur infrastructure mappe la réponse
    Then l'application reçoit un modèle cohérent avec le contrat frontend
```

file `docs/features/order-status/ui_order-status-issue.md`
```markdown
# Suivre une commande : impact package ui

**Contexte**
Le package ui rend l'écran de suivi de commande, y compris le bandeau prêt, le
compte à rebours et les états de chargement visibles par le festivalier.

**Critères d'acceptation**
Feature: Order status UI

1. Scenario: Afficher le compte à rebours d'une commande acknowledged
    Given une commande acknowledged avec 6 minutes restantes
    When l'écran de suivi est rendu
    Then un compte à rebours visible est affiché

2. Scenario: Afficher un bandeau plein écran pour une commande prête
    Given une commande dans l'état Ready for Pickup
    When l'écran de suivi est rendu
    Then un bandeau de succès visible annonce que la commande est prête
```

## Positive Example 3: ambiguous request, clarify instead of guessing

Input: "I want a better order experience"

Output:
No issue file yet. Ask for clarification because the request is too broad to map reliably to slices, pages, or acceptance criteria.

```markdown
I need clarification before generating issue files.

Questions:
1. Does "better order experience" refer to browsing the menu, editing the cart, confirming the order, or tracking order status?
2. Do you expect a new feature slice, a page change, or only UX improvements inside an existing flow?
3. What user-visible outcome should be considered successful?

If you want, I can then create one or more issue files once the scope is precise.
```

## Negative Example 1: wrong decomposition

Input: "As a festival goer, I want to add items to a cart and see the running total"

Incorrect Output:
```markdown
Create one file `docs/features/cart-and-token-balance-and-menu-and-order-status.md` covering everything related to orders.
```

Why this is incorrect:
- It collapses unrelated concerns into one oversized issue.
- It does not respect the repository split by frontend package.
- It makes implementation and testing harder because there is no clear ownership boundary.

## Negative Example 2: inventing scope that was not requested

Input: "As a festival goer, I want to browse the menu on the web app"

Incorrect Output:
```markdown
Generate issues for menu browsing, cart, payment, bartender dashboard, and analytics because they are probably needed next.
```

Why this is incorrect:
- It adds payment and analytics although they are not part of the request.
- It expands the scope instead of staying anchored to the user story.
- It reduces trust because the generated work no longer matches the input.

## Negative Example 3: weak acceptance criteria

Input: "As a developer, I want a Token Balance component to display the festival goer's current balance"

Incorrect Output:
```markdown
Acceptance Criteria:
- The component works well
- The UI looks nice
- The user sees their tokens
```

Why this is incorrect:
- The criteria are not testable.
- Important states are missing, especially zero balances and responsive rendering.
- The wording is too vague to drive implementation or automated tests.

## Negative Example 4: wrong file prefix and wrong package mapping

Input: "As a festival goer, I want to track my current order on its own page"

Incorrect Output:
```markdown
file `docs/features/order-status/page_order-status-issue.md`

# Order Status Page : Page impact
```

Why this is incorrect:
- Frontend issue files in this repository use package prefixes such as `ui_`, not `page_`.
- A routed screen is still documented through impacted packages, especially `application_` and `ui_`.
- The title format must stay `# {Feature Title} : impact package {layer}`.

## Negative Example 5: wrong language and wrong section headers

Input: "As a developer, I want a reusable Token Balance component"

Incorrect Output:
```markdown
file `docs/features/token-balance/ui_token-balance-issue.md`

# Token Balance : impact package ui

**Context**
Reusable token balance component.

**Acceptance Criteria**
Feature: Token balance
```

Why this is incorrect:
- Frontend issue files are written in French in this repository.
- The required section headers are `**Contexte**` and `**Critères d'acceptation**`.
- The issue content is too vague to guide implementation or tests.
