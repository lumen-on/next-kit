import { intro, select, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile, readFile } from '../core/file-system.js';
import { toPascalCase, toKebabCase, renderTemplate } from '../core/template-engine.js';
import path from 'path';

interface ComponentOptions {
  client?: boolean;
  shadcn?: boolean;
  test?: boolean;
}

export async function componentCommand(name: string, options: ComponentOptions = {}): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit component ')));

  const componentName = toPascalCase(name);
  const fileName = toKebabCase(name);

  // Определяем тип компонента
  let isClient = options.client;
  if (isClient === undefined) {
    const choice = await select({
      message: 'Component type?',
      options: [
        { value: false, label: 'Server Component (default)' },
        { value: true, label: 'Client Component ("use client")' },
      ],
    });
    isClient = choice === true;
  }

  const useShadcn = options.shadcn ?? await confirm({
    message: 'Add shadcn/ui imports?',
    initialValue: false,
  });

  const generateTest = options.test ?? await confirm({
    message: 'Generate test file?',
    initialValue: false,
  });

  const targetDir = path.resolve(process.cwd(), 'src/components');
  await ensureDir(targetDir);

  const componentPath = path.join(targetDir, `${fileName}.tsx`);

  if (await pathExists(componentPath)) {
    logger.error(`Component "${fileName}" already exists`);
    process.exit(1);
  }

  // Читаем шаблон
  const templatePath = path.resolve(
    import.meta.dirname,
    '../../templates/component/component.tsx.tpl'
  );
  const template = await readFile(templatePath);

  const code = renderTemplate(template, {
    Name: componentName,
    name: fileName,
    client: isClient,
    shadcn: useShadcn,
    defaultClass: useShadcn ? '' : '',
  });

  await writeFile(componentPath, code);
  logger.success(`Created ${pc.dim(`src/components/${fileName}.tsx`)}`);

  // Генерация теста
  if (generateTest) {
    const testTemplatePath = path.resolve(
      import.meta.dirname,
      '../../templates/component/component.test.tsx.tpl'
    );
    const testTemplate = await readFile(testTemplatePath);
    const testCode = renderTemplate(testTemplate, {
      Name: componentName,
      name: fileName,
    });

    const testPath = path.join(targetDir, `${fileName}.test.tsx`);
    await writeFile(testPath, testCode);
    logger.success(`Created ${pc.dim(`src/components/${fileName}.test.tsx`)}`);
  }

  outro(pc.green('Component created!'));
}
