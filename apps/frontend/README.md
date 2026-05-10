# The Bel'Air's Buvette : building a web app for eXalt famous festival drinks and snacks bar. With TypeScript/React, AI, and love.

Version française : [README_fr.md](README_fr.md)  
Version española : [README_es.md](README_es.md)

>[!note]
> 
> This project is part of the eXalt IT augmented engineer learning path, located in its [academy](https://academy.exalt-company.com/paths/699c49f3a1dffef24c46c739/home).

Hello there and welcome to the Bel'Air's Buvette project repository!

This project is your playground to create a web application and design system for the drinks and snacks festival experience!

You will build the most fantastic frontend using TypeScript and React.

But more importantly, your new best friend: Github Copilot, your new rubber ducky / overenthusiastic intern pair programmer buddy!

## Project Structure

```
belair-buvette/
 apps/
  frontend/
   packages/
    domain/           # Core business logic, entities and domain interfaces
    application/      # Use cases and application services
    infrastructure/   # API clients, adapters and external integrations
    ui/               # Design system  React components, design tokens, Storybook
```

## Installing the Toolchain

| Tool | Version | Documentation |
|------|---------|---------------|
| Node.js | 24.14.0+ | [nodejs.org](https://nodejs.org/en/download) |
| pnpm | 9+ | [pnpm.io/installation](https://pnpm.io/installation) |
| Git | latest | [git-scm.com](https://git-scm.com/downloads) |

> This project ships an `.nvmrc` file. If you use [nvm](https://github.com/nvm-sh/nvm) (Linux/macOS) or [nvm-windows](https://github.com/coreybutler/nvm-windows) (Windows), run `nvm use` to automatically switch to the correct Node.js version.

## Getting Started

### Prerequisites

- Node.js 24.14.0+
- pnpm 9+
- Git

### Fork & Clone

Fork this repository to your own Gitlab account (main branch only), then clone it:

```bash
git clone <YOUR_FORK_URL>
cd belair-buvette/apps/frontend
```

### Install dependencies

```bash
pnpm install
```

### Mirror to GitHub

To properly use advanced AI features with Copilot, mirror this repository to your GitHub account:

```bash
git remote add github <the URL of your new GitHub repository>
git branch -M main
git push -u github main
```

### Run Storybook

```bash
pnpm storybook
```

### Run the tests

```bash
pnpm test
```

### Build all packages

```bash
pnpm build
```

## Next Steps

Start by following the formation material in the [academy](https://academy.exalt-company.com/paths/699c49f3a1dffef24c46c739/home).

Read [FEATURES.md](./FEATURES.md) for the list of user stories and acceptance criteria.

Happy coding!
