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
- **Extensible** — supports custom templates and future LLM integration

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

# Generate using unified command (recommended)
next-kit generate component Button --test
next-kit g page dashboard --layout

# Aliases also work
next-kit new hook use-local-storage
next-kit create server-action create-user

# Manage custom templates
next-kit template list
next-kit template init my-component
```

---

## Available Commands

| Command                        | Description                                      | Example                                              |
|--------------------------------|--------------------------------------------------|------------------------------------------------------|
| `next-kit init`                | Initialize a new Next.js project                 | `next-kit init my-app --yes`                         |
| `next-kit generate`            | Generate from template (unified command)         | `next-kit generate component Button --test`          |
| `next-kit g` / `new` / `create`| Aliases for generate                             | `next-kit g page dashboard`                          |
| `next-kit component`           | Generate a React component                       | `next-kit component UserCard --shadcn`               |
| `next-kit page`                | Generate a Next.js page                          | `next-kit page dashboard --layout`                   |
| `next-kit api`                 | Generate API route or Server Action              | `next-kit api users --action`                        |
| `next-kit server-action`       | Generate a Server Action                         | `next-kit server-action create-user`                 |
| `next-kit hook`                | Generate a custom React hook                     | `next-kit hook use-local-storage`                    |
| `next-kit layout`              | Generate a layout file                           | `next-kit layout dashboard`                          |
| `next-kit middleware`          | Generate `middleware.ts`                         | `next-kit middleware`                                |
| `next-kit env`                 | Generate environment variable files              | `next-kit env`                                       |
| `next-kit template list`       | List available templates                         | `next-kit template list`                             |
| `next-kit template init`       | Create a new custom template                     | `next-kit template init my-component`                |

---

## Custom Templates

You can create your own templates in `.next-kit/templates/`:

```
.next-kit/templates/
└── my-component/
    ├── files.json
    └── component.tsx.tpl
```

**Example `files.json`:**

```json
{
  "name": "my-component",
  "files": [
    {
      "template": "component.tsx.tpl",
      "output": "src/components/{{name}}.tsx",
      "condition": true
    },
    {
      "template": "component.test.tsx.tpl",
      "output": "src/components/{{name}}.test.tsx",
      "condition": "{{withTest}}"
    }
  ]
}
```

Then use it with:

```bash
next-kit generate my-component MyButton --withTest
```

---

## Roadmap

### v0.3.0 — Custom Templates & DX
- [x] Custom user templates (локальные + глобальные)
- [x] Multi-file generation via `files.json`
- [x] Generation flags (`--no-test`, `--with-story`, etc.)
- [x] `next-kit generate` command (aliases: `g`, `new`, `create`)
- [x] `next-kit template` management commands

### Future
- [ ] LLM-powered code generation
- [ ] Plugin system

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Submit a pull request

---

## License

MIT © [lumen-on](https://github.com/lumen-on)

---

*Built with ❤️ for the Next.js community.*