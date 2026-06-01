import { intro, text, confirm, select, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile, readFile } from '../core/file-system.js';
import { renderTemplate } from '../core/template-engine.js';
import path from 'path';

interface InitOptions {
  yes?: boolean;
}

export async function initCommand(options: InitOptions = {}): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit init ')));

  const useDefaults = options.yes ?? false;

  let projectName = 'my-next-app';
  let useTypeScript = true;
  let useTailwind = true;
  let useShadcn = true;
  let useEslint = true;
  let usePrettier = true;
  let usePrisma = false;

  if (!useDefaults) {
    const nameInput = await text({
      message: 'Project name?',
      placeholder: projectName,
      validate: (value) => {
        if (!value) return 'Project name is required';
        if (!/^[a-z0-9-]+$/.test(value)) return 'Use lowercase letters, numbers and hyphens only';
      },
    });
    if (typeof nameInput === 'string') projectName = nameInput;

    useTypeScript = await confirm({ message: 'Use TypeScript?', initialValue: true });
    useTailwind = await confirm({ message: 'Use Tailwind CSS?', initialValue: true });
    useShadcn = useTailwind ? await confirm({ message: 'Use shadcn/ui?', initialValue: true }) : false;
    useEslint = await confirm({ message: 'Use ESLint?', initialValue: true });
    usePrettier = await confirm({ message: 'Use Prettier?', initialValue: true });
    usePrisma = await confirm({ message: 'Use Prisma?', initialValue: false });
  }

  const projectPath = path.resolve(process.cwd(), projectName);

  if (await pathExists(projectPath)) {
    logger.error(`Directory "${projectName}" already exists`);
    process.exit(1);
  }

  logger.info(`Creating project in ${pc.dim(projectPath)}...`);
  await ensureDir(projectPath);
  await ensureDir(path.join(projectPath, 'src/app'));

  // Базовые файлы
  await writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify({
      name: projectName,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
        ...(usePrettier && { format: 'prettier --write .' }),
      },
    }, null, 2)
  );

  await writeFile(path.join(projectPath, 'README.md'), `# ${projectName}\n\nCreated with next-kit.\n`);
  await writeFile(path.join(projectPath, '.gitignore'), 'node_modules\n.next\nout\n.env*\n');

  // Конфиги
  if (useTypeScript) {
    const tsconfigTpl = await readFile(
      path.resolve(import.meta.dirname, '../../templates/init/tsconfig.json.tpl')
    );
    await writeFile(path.join(projectPath, 'tsconfig.json'), tsconfigTpl);
  }

  if (useTailwind) {
    const tailwindTpl = await readFile(
      path.resolve(import.meta.dirname, '../../templates/init/tailwind.config.ts.tpl')
    );
    await writeFile(path.join(projectPath, 'tailwind.config.ts'), tailwindTpl);

    const postcssTpl = await readFile(
      path.resolve(import.meta.dirname, '../../templates/init/postcss.config.js.tpl')
    );
    await writeFile(path.join(projectPath, 'postcss.config.js'), postcssTpl);
  }

  if (useEslint) {
    const eslintTpl = await readFile(
      path.resolve(import.meta.dirname, '../../templates/init/.eslintrc.json.tpl')
    );
    await writeFile(path.join(projectPath, '.eslintrc.json'), eslintTpl);
  }

  if (usePrettier) {
    const prettierTpl = await readFile(
      path.resolve(import.meta.dirname, '../../templates/init/prettier.config.js.tpl')
    );
    await writeFile(path.join(projectPath, 'prettier.config.js'), prettierTpl);
  }

  if (usePrisma) {
    await ensureDir(path.join(projectPath, 'prisma'));
    const prismaTpl = await readFile(
      path.resolve(import.meta.dirname, '../../templates/init/prisma.schema.prisma.tpl')
    );
    await writeFile(path.join(projectPath, 'prisma/schema.prisma'), prismaTpl);
  }

  logger.success('Project initialized successfully!');
  logger.dim(`\nNext steps:\n  cd ${projectName}\n  npm install\n  npm run dev`);

  outro(pc.green('Done!'));
}
