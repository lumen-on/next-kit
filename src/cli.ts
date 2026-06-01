#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { componentCommand } from './commands/component.js';
import { apiCommand } from './commands/api.js';
import { pageCommand } from './commands/page.js';
import { hookCommand } from './commands/hook.js';
import { middlewareCommand } from './commands/middleware.js';
import { layoutCommand } from './commands/layout.js';
import { envCommand } from './commands/env.js';
import { serverActionCommand } from './commands/server-action.js';

const program = new Command();

program
  .name('next-kit')
  .description('Modern CLI toolkit for Next.js developers')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize a new Next.js project')
  .action(initCommand);

program
  .command('component <name>')
  .description('Generate a React component')
  .option('--client', 'Create as client component')
  .option('--shadcn', 'Include shadcn/ui imports')
  .option('--test', 'Generate test file')
  .action(componentCommand);

program
  .command('api <name>')
  .description('Generate API route or Server Action')
  .option('--action', 'Generate Server Action instead of route')
  .action(apiCommand);

program
  .command('page <name>')
  .description('Generate a Next.js page')
  .option('--layout', 'Include layout file')
  .action(pageCommand);

program
  .command('hook <name>')
  .description('Generate a custom React hook')
  .action(hookCommand);

program
  .command('middleware')
  .description('Generate middleware.ts')
  .action(middlewareCommand);

program
  .command('layout <name>')
  .description('Generate a layout file')
  .action(layoutCommand);

program
  .command('env')
  .description('Generate environment files (.env.example, .env.local)')
  .action(envCommand);

program
  .command('server-action <name>')
  .description('Generate a Server Action with Zod validation')
  .action(serverActionCommand);

program.parse(process.argv);