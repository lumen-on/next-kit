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

### `next-kit hook <name>`

Generate a custom React hook.

```bash
next-kit hook local-storage
next-kit hook window-size
```

### `next-kit layout <name>`

Generate a layout file.

```bash
next-kit layout dashboard
```

### `next-kit middleware`

Generate `middleware.ts` at the root of the project.

```bash
next-kit middleware
```

### `next-kit env`

Generate environment files (`.env.example` and `.env.local`).

```bash
next-kit env
```

### `next-kit server-action <name>`

Generate a Server Action with Zod validation schema.

```bash
next-kit server-action create-user
```

## Architecture

- `src/commands/` — command handlers
- `src/core/` — shared utilities (logger, file system, template engine)
- `templates/` — file-based templates for each generator
- Simple and extensible design for future LLM integration

## Roadmap

- [x] `init` command
- [x] `component` command
- [x] `api` command
- [x] `page` command
- [x] `hook` command
- [x] `layout` command
- [x] `middleware` command
- [x] `env` command
- [x] `server-action` command
- [ ] Custom template support
- [ ] Configuration file (`next-kit.config.ts`)
- [ ] LLM-powered generation

## License

MIT
