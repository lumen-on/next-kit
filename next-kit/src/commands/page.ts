import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import {
  ensureFileDoesNotExist,
  generateFile,
  readFile,
  resolvePath,
} from '../core/file-system.js';
import { renderTemplate, toPascalCase, toKebabCase } from '../core/template-engine.js';

interface PageOptions {
  layout?: boolean;
}

export async function pageCommand(name: string, options: PageOptions = {}) {
  intro(pc.bgCyan(pc.black(' next-kit page ')));

  const pageName = toPascalCase(name);
  const folderName = toKebabCase(name);

  const targetDir = resolvePath(process.cwd(), 'src/app', folderName);
  const pagePath = path.join(targetDir, 'page.tsx');

  await ensureFileDoesNotExist(pagePath, 'Page');

  const templatePath = resolvePath(
    import.meta.dirname,
    '../../templates/page/page.tsx.tpl'
  );
  const template = await readFile(templatePath);
  const code = renderTemplate(template, { Name: pageName });

  await generateFile(
    pagePath,
    code,
    `Created ${pc.dim(`src/app/${folderName}/page.tsx`)}`
  );

  if (options.layout) {
    const layoutPath = path.join(targetDir, 'layout.tsx');
    const layoutTemplatePath = resolvePath(
      import.meta.dirname,
      '../../templates/layout/layout.tsx.tpl'
    );
    const layoutTemplate = await readFile(layoutTemplatePath);
    const layoutCode = renderTemplate(layoutTemplate, { Name: pageName });

    await generateFile(
      layoutPath,
      layoutCode,
      `Created ${pc.dim(`src/app/${folderName}/layout.tsx`)}`
    );
  }

  outro(pc.green('Page created!'));
}