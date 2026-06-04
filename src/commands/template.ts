import { intro, outro, select, text } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { listAvailableTemplates } from '../core/template-resolver.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const LOCAL_TEMPLATES_DIR = path.join(process.cwd(), '.next-kit/templates');
const GLOBAL_TEMPLATES_DIR = path.join(os.homedir(), '.next-kit/templates');

export async function templateListCommand(): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit template list ')));

  const templates = await listAvailableTemplates();

  if (templates.length === 0) {
    logger.warn('No templates found');
    outro('');
    return;
  }

  logger.info('Available templates:\n');

  templates.forEach(t => {
    const typeLabel = t.type === 'builtin' ? pc.dim('[builtin]') : 
                      t.type === 'local' ? pc.green('[local]') : 
                      pc.blue('[global]');
    console.log(`  ${pc.cyan(t.name)} ${typeLabel}`);
  });

  outro('');
}

export async function templateInitCommand(name?: string): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit template init ')));

  const templateName = name || await text({
    message: 'Template name?',
    placeholder: 'my-component',
  }) as string;

  if (!templateName) {
    logger.error('Template name is required');
    process.exit(1);
  }

  // Создаём в локальной папке по умолчанию
  const templateDir = path.join(LOCAL_TEMPLATES_DIR, templateName);
  await fs.mkdir(templateDir, { recursive: true });

  // Создаём пример files.json
  const filesJson = {
    name: templateName,
    description: `Custom template: ${templateName}`,
    files: [
      {
        template: `${templateName}.tsx.tpl`,
        output: `src/components/{{name}}.tsx`,
        condition: true
      }
    ]
  };

  await fs.writeFile(
    path.join(templateDir, 'files.json'),
    JSON.stringify(filesJson, null, 2)
  );

  // Создаём пустой шаблон
  await fs.writeFile(
    path.join(templateDir, `${templateName}.tsx.tpl`),
    `export function {{Name}}() {\n  return <div>Hello {{name}}</div>;\n}\n`
  );

  logger.success(`Template "${templateName}" created at .next-kit/templates/${templateName}/`);
  outro(pc.green('Done!'));
}

export async function templateCommand(subcommand?: string, arg?: string): Promise<void> {
  if (!subcommand) {
    // Показываем меню
    const choice = await select({
      message: 'What do you want to do?',
      options: [
        { value: 'list', label: 'List available templates' },
        { value: 'init', label: 'Create new template' },
      ],
    }) as string;

    if (choice === 'list') await templateListCommand();
    if (choice === 'init') await templateInitCommand();
    return;
  }

  if (subcommand === 'list') await templateListCommand();
  if (subcommand === 'init') await templateInitCommand(arg);
}
