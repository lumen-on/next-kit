import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import { logger } from '../core/logger.js';
import {
  ensureFileDoesNotExist,
  generateFile,
  readFile,
  resolvePath,
} from '../core/file-system.js';
import { renderTemplate, toPascalCase, toKebabCase } from '../core/template-engine.js';

export async function hookCommand(name: string): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit hook ')));

  const hookName = toPascalCase(name);
  const fileName = toKebabCase(name);

  const targetDir = resolvePath(process.cwd(), 'src/hooks');
  const hookPath = path.join(targetDir, `use-${fileName}.ts`);

  await ensureFileDoesNotExist(hookPath, 'Hook');

  const templatePath = resolvePath(
    import.meta.dirname,
    '../../templates/hook/hook.ts.tpl'
  );
  const template = await readFile(templatePath);
  const code = renderTemplate(template, {
    Name: hookName,
    name: fileName,
  });

  await generateFile(
    hookPath,
    code,
    `Created ${pc.dim(`src/hooks/use-${fileName}.ts`)}`
  );

  outro(pc.green('Hook created!'));
}