import { intro, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile } from '../core/file-system.js';
import path from 'path';

export async function envCommand(): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit env ')));

  const createExample = await confirm({
    message: 'Create .env.example?',
    initialValue: true,
  });

  const createLocal = await confirm({
    message: 'Create .env.local?',
    initialValue: true,
  });

  if (createExample) {
    const examplePath = path.resolve(process.cwd(), '.env.example');
    if (!(await pathExists(examplePath))) {
      await writeFile(
        examplePath,
        'DATABASE_URL=\nNEXT_PUBLIC_API_URL=\n'
      );
      logger.success('Created .env.example');
    }
  }

  if (createLocal) {
    const localPath = path.resolve(process.cwd(), '.env.local');
    if (!(await pathExists(localPath))) {
      await writeFile(
        localPath,
        'DATABASE_URL=\nNEXT_PUBLIC_API_URL=\n'
      );
      logger.success('Created .env.local');
    }
  }

  outro(pc.green('Environment files created!'));
}
