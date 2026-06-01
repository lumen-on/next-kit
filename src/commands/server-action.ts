import { intro, text, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile, readFile } from '../core/file-system.js';
import { toKebabCase, renderTemplate } from '../core/template-engine.js';
import path from 'path';

export async function serverActionCommand(name: string): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit server-action ')));

  const actionName = toKebabCase(name);

  const targetDir = path.resolve(process.cwd(), 'src/app/actions');
  await ensureDir(targetDir);

  const actionPath = path.join(targetDir, `${actionName}.ts`);

  if (await pathExists(actionPath)) {
    logger.error(`Action "${actionName}" already exists`);
    process.exit(1);
  }

  const templatePath = path.resolve(
    import.meta.dirname,
    '../../templates/server-action/action.ts.tpl'
  );
  const template = await readFile(templatePath);
  const code = renderTemplate(template, { name: actionName });

  await writeFile(actionPath, code);
  logger.success(`Created ${pc.dim(`src/app/actions/${actionName}.ts`)}`);

  outro(pc.green('Server Action created!'));
}
