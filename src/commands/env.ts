import { intro, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile, readFile } from '../core/file-system.js';
import path from 'path';

export async function envCommand(): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit env ')));

  const createExample = await confirm({
    message: 'Create .env.example?',
    initialValue: true,
  });

  const createLocal = await confirm({
    message: 'Create empty .env.local?',
    initialValue: true,
  });

  if (createExample) {
    const examplePath = path.resolve(process.cwd(), '.env.example');
    if (await pathExists(examplePath)) {
      logger.warn('.env.example already exists, skipping');
    } else {
      const templatePath = path.resolve(
        import.meta.dirname,
        '../../templates/env/env.example.tpl'
      );
      const template = await readFile(templatePath);
      await writeFile(examplePath, template);
      logger.success('Created .env.example');
    }
  }

  if (createLocal) {
    const localPath = path.resolve(process.cwd(), '.env.local');
    if (await pathExists(localPath)) {
      logger.warn('.env.local already exists, skipping');
    } else {
      await writeFile(localPath, '# Add your local environment variables here\n');
      logger.success('Created .env.local');
    }
  }

  outro(pc.green('Environment files created!'));
}
