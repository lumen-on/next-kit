#!/usr/bin/env node
import { Command } from 'commander';
import pc from 'picocolors';
import { initCommand } from './commands/init.js';

const program = new Command();

program
  .name('next-kit')
  .description('Modern code and template generator for Next.js')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize a new Next.js project with next-kit')
  .action(initCommand);

program.parse(process.argv);