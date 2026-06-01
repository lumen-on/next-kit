import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import {
  ensureFileDoesNotExist,
  generateFile,
  readFile,
  resolvePath,
} from '../core/file-system.js';

export async function middlewareCommand(): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit middleware ')));

  const targetPath = resolvePath(process.cwd(), 'src/middleware.ts');

  await ensureFileDoesNotExist(targetPath, 'Middleware');

  const templatePath = resolvePath(
    import.meta.dirname,
    '../../templates/middleware/middleware.ts.tpl'
  );
  const template = await readFile(templatePath);

  await generateFile(
    targetPath,
    template,
    `Created ${pc.dim('src/middleware.ts')}`
  );

  outro(pc.green('Middleware created!'));
}