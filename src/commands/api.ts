import { intro, select, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile, readFile } from '../core/file-system.js';
import { toKebabCase, renderTemplate } from '../core/template-engine.js';
import path from 'path';

export async function apiCommand(name: string, options: { action?: boolean } = {}): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit api ')));

  const routeName = toKebabCase(name);
  const isAction = options.action ?? false;

  const targetDir = isAction
    ? path.resolve(process.cwd(), 'src/app/actions')
    : path.resolve(process.cwd(), `src/app/api/${routeName}`);

  await ensureDir(targetDir);

  const fileName = isAction ? `${routeName}.ts` : 'route.ts';
  const filePath = path.join(targetDir, fileName);

  if (await pathExists(filePath)) {
    logger.error(`${isAction ? 'Action' : 'Route'} already exists`);
    process.exit(1);
  }

  const templateFile = isAction ? 'action.ts.tpl' : 'route.ts.tpl';
  const templatePath = path.resolve(
    import.meta.dirname,
    `../../templates/api/${templateFile}`
  );

  const template = await readFile(templatePath);
  const code = renderTemplate(template, { name: routeName });

  await writeFile(filePath, code);
  logger.success(`Created ${pc.dim(isAction ? `src/app/actions/${fileName}` : `src/app/api/${routeName}/route.ts`)}`);

  outro(pc.green('API created!'));
}
