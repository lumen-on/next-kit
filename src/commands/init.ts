import { intro, text, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile } from '../core/file-system.js';
import path from 'path';

export async function initCommand(): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit ')));

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

  const useTailwind = await confirm({
    message: 'Use Tailwind CSS?',
    initialValue: true,
  });

  const useShadcn = await confirm({
    message: 'Use shadcn/ui?',
    initialValue: true,
  });

  const useTypeScript = await confirm({
    message: 'Use TypeScript?',
    initialValue: true,
  });

  const projectPath = path.resolve(process.cwd(), projectName);

  if (await pathExists(projectPath)) {
    logger.error(`Directory "${projectName}" already exists`);
    process.exit(1);
  }

  logger.info(`Creating project in ${pc.dim(projectPath)}...`);

  await ensureDir(projectPath);
  await ensureDir(path.join(projectPath, 'src/app'));

  // package.json
  const packageJson = {
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
    devDependencies: {
      ...(useTypeScript && { typescript: '^5', '@types/node': '^20', '@types/react': '^18', '@types/react-dom': '^18' }),
      ...(useTailwind && { tailwindcss: '^3.4', postcss: '^8', autoprefixer: '^10' }),
      ...(useShadcn && { 'tailwindcss-animate': '^1.0.7', 'class-variance-authority': '^0.7.0', clsx: '^2.1.1', 'tailwind-merge': '^2.3.0' }),
    },
  };

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
    `node_modules\n.next\nout\n.env*\n`
  );

  logger.success('Project initialized successfully!');
  logger.dim(`\nNext steps:\n  cd ${projectName}\n  npm install\n  npm run dev`);

  outro(pc.green('Done!'));
}
