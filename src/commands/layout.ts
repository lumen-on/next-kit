import { intro, text, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile, readFile } from '../core/file-system.js';
import { toKebabCase, toPascalCase, renderTemplate } from '../core/template-engine.js';
import path from 'path';

export async function layoutCommand(name: string): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit layout ')));

  const layoutName = toKebabCase(name);
  const componentName = toPascalCase(name);

  const targetDir = path.resolve(process.cwd(), `src/app/${layoutName}`);
  await ensureDir(targetDir);

  const layoutPath = path.join(targetDir, 'layout.tsx');

  if (await pathExists(layoutPath)) {
    logger.error(`Layout "${layoutName}" already exists`);
    process.exit(1);
  }

  const templatePath = path.resolve(
    import.meta.dirname,
    '../../templates/layout/layout.tsx.tpl'
  );
  const template = await readFile(templatePath);
  const code = renderTemplate(template, { Name: componentName });

  await writeFile(layoutPath, code);
  logger.success(`Created ${pc.dim(`src/app/${layoutName}/layout.tsx`)}`);

  outro(pc.green('Layout created!'));
}
