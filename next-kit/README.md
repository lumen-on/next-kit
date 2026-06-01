# next-kit

Modern CLI tool for generating Next.js code and templates.

## Installation

```bash
npm install -g next-kit
```

## Commands

### `next-kit init`

Initialize a new Next.js project.

```bash
next-kit init
```

### `next-kit component`

Generate React components.

```bash
next-kit component Button
next-kit component UserCard --client --shadcn --test
```

**Options:**
- `--client` — create as client component (`'use client'`)
- `--shadcn` — add shadcn/ui imports
- `--test` — generate test file

### `next-kit api`

Generate API routes and Server Actions.

```bash
next-kit api users
next-kit api posts --action
```

### `next-kit page`

Generate pages with optional layout.

```bash
next-kit page dashboard
next-kit page profile
```

## Architecture

The project is designed to be modular and extensible for future LLM integration.

- `src/commands/` — command handlers
- `src/core/` — shared utilities (logger, template engine)
- `templates/` — file-based templates (planned)

## Roadmap

- [x] `init` command
- [x] `component` command
- [x] `api` command
- [x] `page` command
- [ ] Custom template support
- [ ] Configuration file (`next-kit.config.ts`)
- [ ] LLM-powered generation

## License

MIT
