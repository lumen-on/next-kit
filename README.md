# next-kit

Modern CLI toolkit for Next.js developers.

## Installation

```bash
npm install -g next-kit-cli
```

## Commands

### `next-kit init`

Initialize a new Next.js project with sensible defaults.

```bash
next-kit init
```

### `next-kit component <name>`

Generate a React component.

```bash
next-kit component Button
next-kit component UserCard --client --shadcn --test
```

**Options:**
- `--client` — create as client component (`'use client'`)
- `--shadcn` — add shadcn/ui imports
- `--test` — generate test file

### `next-kit api <name>`

Generate API routes or Server Actions.

```bash
next-kit api users
next-kit api posts --action
```

### `next-kit page <name>`

Generate a Next.js page (and optionally layout).

```bash
next-kit page dashboard
next-kit page profile --layout
```

## Architecture

- `src/commands/` — command handlers
- `src/core/` — shared utilities (logger, file system, template engine)
- Simple and extensible design for future LLM integration

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
