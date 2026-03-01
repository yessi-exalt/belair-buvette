# The Bel'Air's Buvette : building a backend for eXalt famous festival drinks and snacks bar. With TypeScript/Node.js, AI, and love.

Version française : [README_fr.md](README_fr.md)  
Version española : [README_es.md](README_es.md)

>[!note]
> 
> This project is part of the eXalt IT augmented engineer learning path, located in its [academy](https://example.com).

Hello there and welcome to the Bel'Air's Buvette project repository!

This project is your playground to create a robust backend system for managing the drinks and snacks!

You will build the most fantastic backend using TypeScript and Node.js.

But more importantly, your new best friend: Github Copilot, your new rubber ducky / overenthusiastic intern pair programmer buddy!

## Project Structure

```
belairs-buvette/
 application/      # Entry point  wires domain and infrastructure together
 domain/           # Core business logic and domain model
 infrastructure/   # Adapters, persistence, external integrations
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
cd belairs-buvette
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

### Build

```bash
pnpm build
```

### Run the tests

```bash
pnpm test
```

## Next Steps

Start by following the formation material in the [academy](https://example.com).

Read [FEATURES.md](./FEATURES.md) for the list of user stories and acceptance criteria.

Happy coding!
