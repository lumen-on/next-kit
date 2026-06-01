import { intro, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile, readFile } from '../core/file-system.js';
import { toKebabCase, toPascalCase, renderTemplate } from '../core/template-engine.js';
import path from 'path';

export async function pageCommand(name: string, options: { layout?: boolean } = {}): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit page ')));

  const pageName = toKebabCase(name);
  const componentName = toPascalCase(name);
  const includeLayout = options.layout ?? false;

  const targetDir = path.resolve(process.cwd(), `src/app/${pageName}`);
  await ensureDir(targetDir);

  const pagePath = path.join(targetDir, 'page.tsx');

  if (await pathExists(pagePath)) {
    logger.error(`Page "${pageName}" already exists`);
    process.exit(1);
  }

  // page.tsx
  const pageTemplatePath = path.resolve(
    import.meta.dirname,
    '../../templates/page/page.tsx.tpl'
  );
  const pageTemplate = await readFile(pageTemplatePath);
  const pageCode = renderTemplate(pageTemplate, { Name: componentName });

  await writeFile(pagePath, pageCode);
  logger.success(`Created ${pc.dim(`src/app/${pageName}/page.tsx`)}`);

  // layout.tsx (опционально)
  if (includeLayout) {
    const layoutTemplatePath = path.resolve(
      import.meta.dirname,
      '../../templates/page/layout.tsx.tpl'
    );
    const layoutTemplate = await readFile(layoutTemplatePath);
    const layoutCode = renderTemplate(layoutTemplate, { Name: componentName });

    const layoutPath = path.join(targetDir, 'layout.tsx');
    await writeFile(layoutPath, layoutCode);
    logger.success(`Created ${pc.dim(`src/app/${pageName}/layout.tsx`)}`);
  }

  outro(pc.green('Page created!'));
}
