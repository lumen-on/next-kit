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
next-kit init --yes          # Use all defaults
```

### `next-kit component <name>`

Generate a React component.

```bash
next-kit component Button
next-kit component UserCard --client --shadcn --test
```

### `next-kit api <name>`

Generate API routes or Server Actions.

```bash
next-kit api users
next-kit api posts --action
```

### `next-kit page <name>`

Generate a Next.js page.

```bash
next-kit page dashboard
next-kit page profile --layout
```

### `next-kit hook <name>`

Generate a custom React hook.

```bash
next-kit hook local-storage
```

### `next-kit layout <name>`

Generate a layout file.

```bash
next-kit layout dashboard
```

### `next-kit middleware`

Generate `middleware.ts`.

```bash
next-kit middleware
```

### `next-kit env`

Generate environment files.

```bash
next-kit env
```

### `next-kit server-action <name>`

Generate a Server Action with Zod validation.

```bash
next-kit server-action create-user
```

### `next-kit config init`

Create `next-kit.config.ts` for customizing paths and behavior.

```bash
next-kit config init
```

## Configuration

You can create a `next-kit.config.ts` file to customize where files are generated:

```ts
import type { NextKitConfig } from 'next-kit-cli';

const config: NextKitConfig = {
  componentDir: 'src/components',
  hookDir: 'src/hooks',
  apiDir: 'src/app/api',
  actionDir: 'src/app/actions',
  typescript: true,
  tailwind: true,
  shadcn: false,
};

export default config;
```

## Architecture

- `src/commands/` — command handlers
- `src/core/` — shared utilities (logger, file system, template engine, config, project detector)
- `templates/` — file-based templates
- Designed to be extensible for future LLM integration

## Roadmap

- [x] Config system + project detection
- [x] All core generators
- [ ] Custom templates
- [ ] LLM-powered generation

## License

MIT
