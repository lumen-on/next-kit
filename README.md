# next-kit

> A powerful, modern CLI toolkit that supercharges Next.js development.

[![npm version](https://img.shields.io/npm/v/next-kit-cli)](https://www.npmjs.com/package/next-kit-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/lumen-on/next-kit?style=social)](https://github.com/lumen-on/next-kit)

**next-kit** helps Next.js developers ship faster by providing intelligent code generators, project scaffolding, and workflow automation — all from the terminal.

---

## Why next-kit?

Next.js projects often involve repetitive boilerplate: creating components, pages, API routes, Server Actions, and configuring files. `next-kit` eliminates this friction with a beautiful interactive CLI and smart defaults.

- **Fast scaffolding** — start a production-ready Next.js app in seconds
- **Consistent code generation** — follow best practices automatically
- **Developer happiness** — beautiful prompts powered by `@clack/prompts`
- **Extensible** — supports custom configuration and future LLM integration

---

## Installation

```bash
npm install -g next-kit-cli
```

Or use it directly with `npx`:

```bash
npx next-kit-cli init
```

---

## Quick Start

```bash
# Create a new Next.js project
next-kit init my-app

# Generate a component
next-kit component Button --client --test

# Generate a Server Action with validation
next-kit server-action create-user
```

---

## Available Commands

| Command                    | Description                                      | Example                                      |
|---------------------------|--------------------------------------------------|----------------------------------------------|
| `next-kit init`           | Initialize a new Next.js project                 | `next-kit init my-app --yes`                 |
| `next-kit component`      | Generate a React component                       | `next-kit component UserCard --shadcn`       |
| `next-kit page`           | Generate a Next.js page                          | `next-kit page dashboard --layout`           |
| `next-kit api`            | Generate API routes or Server Actions            | `next-kit api users --action`                |
| `next-kit hook`           | Generate a custom React hook                     | `next-kit hook use-local-storage`            |
| `next-kit layout`         | Generate a layout file                           | `next-kit layout dashboard`                  |
| `next-kit middleware`     | Generate `middleware.ts`                         | `next-kit middleware`                        |
| `next-kit env`            | Generate environment variable files              | `next-kit env`                               |
| `next-kit server-action`  | Generate a Server Action with Zod validation     | `next-kit server-action create-user`         |
| `next-kit config init`    | Create a configuration file                      | `next-kit config init`                       |

---

## Features

- **Interactive & beautiful CLI** using `@clack/prompts`
- **TypeScript-first** with full type safety
- **Smart project detection** — works in existing Next.js projects
- **Configurable paths** via `next-kit.config.ts`
- **Template-based generation** — easy to extend
- **Roadmap**: LLM-powered generation and custom templates

---

## Configuration

You can customize generation paths by creating a `next-kit.config.ts`:

```ts
import type { NextKitConfig } from 'next-kit-cli';

const config: NextKitConfig = {
  componentDir: 'src/components',
  hookDir: 'src/hooks',
  apiDir: 'src/app/api',
  typescript: true,
  tailwind: true,
  shadcn: true,
};

export default config;
```

---

## Roadmap

### v0.3.0 — Custom Templates & DX
- [ ] Custom user templates (локальные + глобальные)
- [ ] Multi-file generation via `files.json`
- [ ] Generation flags (`--no-test`, `--with-story`, etc.)
- [ ] `next-kit generate` command (aliases: `g`, `new`, `create`)
- [ ] `next-kit template` management commands

### Future
- [ ] LLM-powered code generation
- [ ] Plugin system

---

## Contributing

Contributions are welcome! Whether it's bug reports, feature suggestions, or pull requests — feel free to open an issue.

1. Fork the repository
2. Create your feature branch
3. Submit a pull request

---

## License

MIT © [lumen-on](https://github.com/lumen-on)

---

*Built with ❤️ for the Next.js community.*