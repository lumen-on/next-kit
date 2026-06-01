import { intro, outro, text } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import {
  ensureFileDoesNotExist,
  generateFile,
  readFile,
  resolvePath,
} from '../core/file-system.js';
import { renderTemplate, toKebabCase } from '../core/template-engine.js';

export async function serverActionCommand(name: string): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit server-action ')));

  const actionName = toKebabCase(name);
  const targetDir = resolvePath(process.cwd(), 'src/actions');
  const actionPath = resolvePath(targetDir, `${actionName}.ts`);

  await ensureFileDoesNotExist(actionPath, 'Server Action');

  const templatePath = resolvePath(
    import.meta.dirname,
    '../../templates/server-action/action.ts.tpl'
  );
  const template = await readFile(templatePath);
  const code = renderTemplate(template, { name: actionName });

  await generateFile(
    actionPath,
    code,
    `Created ${pc.dim(`src/actions/${actionName}.ts`)}`
  );

  outro(pc.green('Server Action created!'));
}