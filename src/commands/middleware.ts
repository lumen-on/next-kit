import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile, readFile } from '../core/file-system.js';
import path from 'path';

export async function middlewareCommand(): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit middleware ')));

  const targetPath = path.resolve(process.cwd(), 'src/middleware.ts');

  if (await pathExists(targetPath)) {
    logger.error('middleware.ts already exists');
    process.exit(1);
  }

  const templatePath = path.resolve(
    import.meta.dirname,
    '../../templates/middleware/middleware.ts.tpl'
  );
  const template = await readFile(templatePath);

  await writeFile(targetPath, template);
  logger.success(`Created ${pc.dim('src/middleware.ts')}`);

  outro(pc.green('Middleware created!'));
}
