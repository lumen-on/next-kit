import { intro, outro, text } from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import {
  ensureFileDoesNotExist,
  generateFile,
  readFile,
  resolvePath,
} from '../core/file-system.js';
import { renderTemplate, toKebabCase, toPascalCase } from '../core/template-engine.js';

export async function layoutCommand(name: string): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit layout ')));

  const layoutName = toKebabCase(name);
  const componentName = toPascalCase(name);

  const targetDir = resolvePath(process.cwd(), `src/app/${layoutName}`);
  const layoutPath = path.join(targetDir, 'layout.tsx');

  await ensureFileDoesNotExist(layoutPath, 'Layout');

  const templatePath = resolvePath(
    import.meta.dirname,
    '../../templates/layout/layout.tsx.tpl'
  );
  const template = await readFile(templatePath);
  const code = renderTemplate(template, { Name: componentName });

  await generateFile(
    layoutPath,
    code,
    `Created ${pc.dim(`src/app/${layoutName}/layout.tsx`)}`
  );

  outro(pc.green('Layout created!'));
}