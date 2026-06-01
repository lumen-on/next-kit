import { intro, text, select, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile } from '../core/file-system.js';
import { toPascalCase, toKebabCase } from '../core/template-engine.js';
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

  logger.info(`Creating component: ${pc.cyan(componentName)}`);

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

  // Генерация кода компонента
  let code = '';

  if (isClient) {
    code += `'use client';\n\n`;
  }

  if (useShadcn) {
    code += `import { cn } from '@/lib/utils';\n\n`;
  }

  code += `interface ${componentName}Props {\n`;
  code += `  className?: string;\n`;
  code += `}\n\n`;

  code += `export function ${componentName}({ className }: ${componentName}Props) {\n`;
  code += `  return (\n`;
  code += `    <div className={${useShadcn ? 'cn("...", className)' : 'className'}}>\n`;
  code += `      {/* TODO: Implement ${componentName} */}\n`;
  code += `    </div>\n`;
  code += `  );\n`;
  code += `}\n`;

  await writeFile(componentPath, code);
  logger.success(`Created ${pc.dim(`src/components/${fileName}.tsx`)}`);

  // Тест файл
  if (generateTest) {
    const testPath = path.join(targetDir, `${fileName}.test.tsx`);
    const testCode = `import { render, screen } from '@testing-library/react';\nimport { ${componentName} } from './${fileName}';\n\ndescribe('${componentName}', () => {\n  it('renders correctly', () => {\n    render(<${componentName} />);\n    expect(screen.getByRole('generic')).toBeInTheDocument();\n  });\n});\n`;
    await writeFile(testPath, testCode);
    logger.success(`Created ${pc.dim(`src/components/${fileName}.test.tsx`)}`);
  }

  outro(pc.green('Component created!'));
}
