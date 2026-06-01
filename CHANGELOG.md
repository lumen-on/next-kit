# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-06-01

### Added
- `init` command with interactive stack selection (TypeScript, Tailwind, shadcn, ESLint, Prisma)
- `component` command with `--client`, `--shadcn`, `--test` options
- `api` command for routes and server actions
- `page` command with optional layout
- `hook` command for custom React hooks
- `layout` command
- `middleware` command
- `env` command for environment files
- `server-action` command with Zod validation
- File-based templates system
- GitHub Actions CI workflow
- Comprehensive README

### Changed
- Improved `template-engine` with conditional block support
- Refactored all commands to use file templates

[0.2.0]: https://github.com/lumen-on/next-kit/releases/tag/v0.2.0
