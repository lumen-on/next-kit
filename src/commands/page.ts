import { intro, text, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile } from '../core/file-system.js';
import { toKebabCase, toPascalCase } from '../core/template-engine.js';
import path from 'path';

export async function pageCommand(name: string, options: { layout?: boolean } = {}): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit page ')));

  const pageName = toKebabCase(name);
  const componentName = toPascalCase(name);
  const includeLayout = options.layout ?? false;

  const targetDir = path.resolve(process.cwd(), `src/app/${pageName}`);
  await ensureDir(targetDir);

  const pagePath = path.join(targetDir, 'page.tsx');
  const layoutPath = path.join(targetDir, 'layout.tsx');

  if (await pathExists(pagePath)) {
    logger.error(`Page "${pageName}" already exists`);
    process.exit(1);
  }

  // page.tsx
  const pageCode = `export default function ${componentName}Page() {\n`;
  pageCode += `  return (\n`;
  pageCode += `    <div className="container mx-auto px-4 py-8">\n`;
  pageCode += `      <h1 className="text-3xl font-bold">${componentName}</h1>\n`;
  pageCode += `      {/* TODO: Implement ${componentName} page */}\n`;
  pageCode += `    </div>\n`;
  pageCode += `  );\n`;
  pageCode += `}\n`;

  await writeFile(pagePath, pageCode);
  logger.success(`Created ${pc.dim(`src/app/${pageName}/page.tsx`)}`);

  // layout.tsx (опционально)
  if (includeLayout) {
    const layoutCode = `export default function ${componentName}Layout({\n`;
    layoutCode += `  children,\n`;
    layoutCode += `}: {\n`;
    layoutCode += `  children: React.ReactNode;\n`;
    layoutCode += `}) {\n`;
    layoutCode += `  return <>{children}</>;\n`;
    layoutCode += `}\n`;

    await writeFile(layoutPath, layoutCode);
    logger.success(`Created ${pc.dim(`src/app/${pageName}/layout.tsx`)}`);
  }

  outro(pc.green('Page created!'));
}
