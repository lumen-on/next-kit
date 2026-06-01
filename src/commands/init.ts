import { intro, text, select, confirm, outro, spinner } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile } from '../core/file-system.js';
import path from 'path';

interface InitOptions {
  yes?: boolean;
}

export async function initCommand(options: InitOptions = {}): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit init ')));

  const projectName = await text({
    message: 'Project name?',
    placeholder: 'my-next-app',
    validate: (value) => {
      if (!value) return 'Project name is required';
      if (!/^[a-z0-9-]+$/.test(value)) return 'Use lowercase letters, numbers and hyphens only';
    },
  });

  if (typeof projectName === 'symbol') {
    logger.error('Operation cancelled');
    process.exit(0);
  }

  // Если --yes, используем дефолтные значения
  const useTypeScript = options.yes ? true : await confirm({
    message: 'Use TypeScript?',
    initialValue: true,
  });

  const useTailwind = options.yes ? true : await confirm({
    message: 'Use Tailwind CSS?',
    initialValue: true,
  });

  const useShadcn = useTailwind && (options.yes ? true : await confirm({
    message: 'Use shadcn/ui?',
    initialValue: true,
  }));

  const useEslint = options.yes ? true : await confirm({
    message: 'Add ESLint + Prettier?',
    initialValue: true,
  });

  const usePrisma = options.yes ? false : await confirm({
    message: 'Add Prisma ORM?',
    initialValue: false,
  });

  const s = spinner();
  s.start('Creating project...');

  const projectPath = path.resolve(process.cwd(), projectName as string);

  if (await pathExists(projectPath)) {
    s.stop('Error');
    logger.error(`Directory "${projectName}" already exists`);
    process.exit(1);
  }

  await ensureDir(projectPath);
  await ensureDir(path.join(projectPath, 'src/app'));

  // package.json
  const packageJson: any = {
    name: projectName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      next: '14.2.3',
      react: '^18',
      'react-dom': '^18',
    },
    devDependencies: {},
  };

  if (useTypeScript) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      typescript: '^5.4',
      '@types/node': '^20',
      '@types/react': '^18',
      '@types/react-dom': '^18',
    };
  }

  if (useTailwind) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      tailwindcss: '^3.4',
      postcss: '^8',
      autoprefixer: '^10',
    };
  }

  if (useShadcn) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      'class-variance-authority': '^0.7.0',
      clsx: '^2.1.1',
      'tailwind-merge': '^2.3.0',
      'lucide-react': '^0.378.0',
    };
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      'tailwindcss-animate': '^1.0.7',
    };
  }

  if (useEslint) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      eslint: '^8',
      'eslint-config-next': '14.2.3',
      prettier: '^3.2',
    };
    packageJson.scripts.lint = 'next lint && prettier --check .';
    packageJson.scripts.format = 'prettier --write .';
  }

  if (usePrisma) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      '@prisma/client': '^5.14.0',
    };
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      prisma: '^5.14.0',
    };
    packageJson.scripts['db:generate'] = 'prisma generate';
    packageJson.scripts['db:push'] = 'prisma db push';
    packageJson.scripts['db:migrate'] = 'prisma migrate dev';
  }

  await writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // README
  await writeFile(
    path.join(projectPath, 'README.md'),
    `# ${projectName}\n\nNext.js project created with next-kit.\n`
  );

  // .gitignore
  await writeFile(
    path.join(projectPath, '.gitignore'),
    `node_modules\n.next\nout\n.env*\n*.log\n`
  );

  s.stop('Project created!');

  logger.success(`Created project in ${pc.cyan(projectName as string)}`);
  logger.dim(`\nNext steps:\n  cd ${projectName}\n  npm install\n  npm run dev`);

  outro(pc.green('Done!'));
}
