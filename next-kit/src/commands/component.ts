import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import { logger } from '../core/logger.js';
import {
  ensureDir,
  ensureFileDoesNotExist,
  generateFile,
  readFile,
  resolvePath,
} from '../core/file-system.js';
import { renderTemplate, toPascalCase, toKebabCase } from '../core/template-engine.js';

interface ComponentOptions {
  client?: boolean;
  shadcn?: boolean;
  test?: boolean;
}

export async function componentCommand(name: string, options: ComponentOptions) {
  intro(pc.bgCyan(pc.black(' next-kit component ')));

  const componentName = toPascalCase(name);
  const fileName = toKebabCase(name);

  const targetDir = resolvePath(process.cwd(), 'src/components');
  const componentPath = path.join(targetDir, `${componentName}.tsx`);

  await ensureFileDoesNotExist(componentPath, 'Component');

  // Читаем шаблон
  const templatePath = resolvePath(
    import.meta.dirname,
    '../../templates/component/component.tsx.tpl'
  );
  const template = await readFile(templatePath);

  const code = renderTemplate(template, {
    Name: componentName,
    name: fileName,
    client: options.client ?? false,
    shadcn: options.shadcn ?? false,
    defaultClass: options.shadcn ? '' : 'p-4 border rounded',
  });

  await generateFile(
    componentPath,
    code,
    `Created ${pc.dim(`src/components/${componentName}.tsx`)}`
  );

  // Генерация теста
  if (options.test) {
    const testTemplatePath = resolvePath(
      import.meta.dirname,
      '../../templates/component/component.test.tsx.tpl'
    );
    const testTemplate = await readFile(testTemplatePath);
    const testCode = renderTemplate(testTemplate, { Name: componentName });

    const testPath = path.join(targetDir, `${componentName}.test.tsx`);
    await generateFile(
      testPath,
      testCode,
      `Created ${pc.dim(`src/components/${componentName}.test.tsx`)}`
    );
  }

  outro(pc.green('Component created successfully!'));
}