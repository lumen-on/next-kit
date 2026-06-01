#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import { initCommand } from './commands/init.js';
import { componentCommand } from './commands/component.js';
import { apiCommand } from './commands/api.js';
import { pageCommand } from './commands/page.js';

const program = new Command();

program
  .name('next-kit')
  .description('Modern code and template generator for Next.js')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize a new Next.js project')
  .action(initCommand);

program
  .command('component')
  .description('Generate a React component')
  .argument('<name>', 'Component name')
  .option('--client', 'Create as client component')
  .option('--shadcn', 'Include shadcn/ui imports')
  .option('--test', 'Generate test file')
  .action(componentCommand);

program
  .command('api')
  .description('Generate API routes and Server Actions')
  .argument('[name]', 'Route name')
  .action(apiCommand);

program
  .command('page')
  .description('Generate a new page')
  .argument('[name]', 'Page name')
  .action(pageCommand);

program.parse(process.argv);