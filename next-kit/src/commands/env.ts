import { intro, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import {
  pathExists,
  readFile,
  resolvePath,
  writeFile,
} from '../core/file-system.js';

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
    const examplePath = resolvePath(process.cwd(), '.env.example');
    if (await pathExists(examplePath)) {
      logger.warn('.env.example already exists, skipping');
    } else {
      const templatePath = resolvePath(
        import.meta.dirname,
        '../../templates/env/env.example.tpl'
      );
      const template = await readFile(templatePath);
      await writeFile(examplePath, template);
      logger.success('Created .env.example');
    }
  }

  if (createLocal) {
    const localPath = resolvePath(process.cwd(), '.env.local');
    if (await pathExists(localPath)) {
      logger.warn('.env.local already exists, skipping');
    } else {
      await writeFile(localPath, '# Add your local environment variables here\n');
      logger.success('Created .env.local');
    }
  }

  outro(pc.green('Environment files created!'));
}