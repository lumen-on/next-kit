import { intro, outro, select } from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import {
  ensureFileDoesNotExist,
  generateFile,
  readFile,
  resolvePath,
} from '../core/file-system.js';
import { renderTemplate, toKebabCase } from '../core/template-engine.js';

interface ApiOptions {
  action?: boolean;
}

export async function apiCommand(name: string, options: ApiOptions = {}) {
  intro(pc.bgCyan(pc.black(' next-kit api ')));

  const routeName = toKebabCase(name);
  const targetDir = resolvePath(process.cwd(), 'src/app/api', routeName);
  const routePath = path.join(targetDir, 'route.ts');

  await ensureFileDoesNotExist(routePath, 'API route');

  const templatePath = resolvePath(
    import.meta.dirname,
    '../../templates/api/route.ts.tpl'
  );
  const template = await readFile(templatePath);
  const code = renderTemplate(template, { name: routeName });

  await generateFile(
    routePath,
    code,
    `Created ${pc.dim(`src/app/api/${routeName}/route.ts`)}`
  );

  outro(pc.green('API route created!'));
}