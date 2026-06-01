import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile, readFile } from '../core/file-system.js';
import { toPascalCase, toKebabCase, renderTemplate } from '../core/template-engine.js';
import path from 'path';

export async function hookCommand(name: string): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit hook ')));

  const hookName = toPascalCase(name);
  const fileName = toKebabCase(name);

  const targetDir = path.resolve(process.cwd(), 'src/hooks');
  await ensureDir(targetDir);

  const hookPath = path.join(targetDir, `use-${fileName}.ts`);

  if (await pathExists(hookPath)) {
    logger.error(`Hook "use-${fileName}" already exists`);
    process.exit(1);
  }

  const templatePath = path.resolve(
    import.meta.dirname,
    '../../templates/hook/hook.ts.tpl'
  );
  const template = await readFile(templatePath);
  const code = renderTemplate(template, {
    Name: hookName,
    name: fileName,
  });

  await writeFile(hookPath, code);
  logger.success(`Created ${pc.dim(`src/hooks/use-${fileName}.ts`)}`);

  outro(pc.green('Hook created!'));
}
