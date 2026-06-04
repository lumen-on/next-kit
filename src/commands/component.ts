import { intro, select, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { toPascalCase, toKebabCase } from '../core/template-engine.js';
import { resolveTemplate } from '../core/template-resolver.js';
import { generateFromTemplate, normalizeFlags } from '../core/template-generator.js';

interface ComponentOptions {
  client?: boolean;
  shadcn?: boolean;
  test?: boolean;
  [key: string]: any;
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

  // Разрешаем шаблон
  const templateLocation = await resolveTemplate('component');
  if (!templateLocation) {
    logger.error('Component template not found');
    process.exit(1);
  }

  const variables = {
    Name: componentName,
    name: fileName,
    client: isClient,
    shadcn: useShadcn,
  };

  const flags = normalizeFlags({
    test: generateTest,
    ...options,
  });

  try {
    const createdFiles = await generateFromTemplate(templateLocation.path, {
      variables,
      flags,
      targetDir: process.cwd(),
    });

    createdFiles.forEach(file => {
      logger.success(`Created ${pc.dim(file)}`);
    });

    outro(pc.green('Component created!'));
  } catch (error) {
    logger.error(`Failed to generate component: ${error}`);
    process.exit(1);
  }
}
