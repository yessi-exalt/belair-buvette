# La Buvette de Bel'Air : construire une application web pour la célèbre buvette du festival eXalt. Avec TypeScript/React, IA, et amour.

Version anglaise : [README.md](README.md)  
Version española : [README_es.md](README_es.md)

>[!note]
> 
> Ce projet fait partie du parcours d'apprentissage eXalt IT augmented engineer, disponible dans son [academy](https://academy.exalt-company.com/paths/699c49f3a1dffef24c46c739/home).

Bonjour et bienvenue dans le dépôt du projet La Buvette de Bel'Air !

Ce projet est votre terrain de jeu pour créer une application web et un design system pour l'expérience boissons et snacks du festival !

Vous allez construire le meilleur frontend possible en utilisant TypeScript et React.

Mais plus important encore, votre nouveau meilleur ami : GitHub Copilot, votre canard en caoutchouc / stagiaire trop enthousiaste pour le pair programming !

## Structure du projet

```
belair_buvette_frontend/
 packages/
  domain/           # Logique métier, entités et interfaces de domaine
  application/      # Cas d'usage et services applicatifs
  infrastructure/   # Clients API, adaptateurs et intégrations externes
  ui/               # Design system  composants React, tokens de design, Storybook
```

## Installation de la chaîne d'outils

| Outil | Version | Documentation |
|-------|---------|---------------|
| Node.js | 24.14.0+ | [nodejs.org](https://nodejs.org/en/download) |
| pnpm | 9+ | [pnpm.io/installation](https://pnpm.io/installation) |
| Git | latest | [git-scm.com](https://git-scm.com/downloads) |

> Ce projet embarque un fichier `.nvmrc`. Si vous utilisez [nvm](https://github.com/nvm-sh/nvm) (Linux/macOS) ou [nvm-windows](https://github.com/coreybutler/nvm-windows) (Windows), lancez `nvm use` pour basculer automatiquement vers la bonne version de Node.js.

## Démarrage

### Prérequis

- Node.js 24.14.0+
- pnpm 9+
- Git

### Fork & Clone

Forkez ce dépôt sur votre propre compte Gitlab (branche main uniquement), puis clonez-le :

```bash
git clone <URL_DE_VOTRE_FORK>
cd belair_buvette_frontend
```

### Installer les dépendances

```bash
pnpm install
```

### Miroir vers GitHub

Pour pouvoir utiliser correctement les fonctionnalités IA avancées avec Copilot, miroir ce dépôt sur votre compte GitHub :

```bash
git remote add github <the URL of your new GitHub repository>
git branch -M main
git push -u github main
```

### Lancer Storybook

```bash
pnpm storybook
```

### Lancer les tests

```bash
pnpm test
```

### Compiler tous les packages

```bash
pnpm build
```

## Étapes suivantes

Commencez par suivre le reste du matériel de formation dans l'[academy](https://academy.exalt-company.com/paths/699c49f3a1dffef24c46c739/home).

Consultez le fichier [FEATURES_fr.md](./FEATURES_fr.md) pour la liste des user stories et des critères d'acceptation.

Bon codage !
