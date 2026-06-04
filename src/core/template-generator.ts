import path from 'path';
import { ensureDir, writeFile, readFile, pathExists } from './file-system.js';
import { renderTemplate, toKebabCase } from './template-engine.js';
import { loadTemplateConfig, shouldGenerateFile, TemplateFile } from './template-config.js';

export interface GenerateOptions {
  variables: Record<string, any>;
  flags?: Record<string, boolean>;
  targetDir?: string;
}

/**
 * Нормализует CLI флаги (поддержка --no-xxx)
 */
export function normalizeFlags(rawFlags: Record<string, any>): Record<string, boolean> {
  const result: Record<string, boolean> = {};

  for (const [key, value] of Object.entries(rawFlags)) {
    if (key.startsWith('no-')) {
      const realKey = key.replace('no-', '');
      result[realKey] = !value;
    } else {
      result[key] = Boolean(value);
    }
  }

  return result;
}

/**
 * Генерирует файлы по шаблону (используя files.json если есть)
 */
export async function generateFromTemplate(
  templatePath: string,
  options: GenerateOptions
): Promise<string[]> {
  const { variables, flags = {}, targetDir = process.cwd() } = options;
  const createdFiles: string[] = [];

  const config = await loadTemplateConfig(templatePath);

  if (config) {
    for (const file of config.files) {
      const shouldGenerate = shouldGenerateFile(file, { ...variables, ...flags });

      if (!shouldGenerate) continue;

      const templateFilePath = path.join(templatePath, file.template);

      if (!(await pathExists(templateFilePath))) {
        console.warn(`Template file not found: ${file.template}`);
        continue;
      }

      const templateContent = await readFile(templateFilePath);
      const renderedName = renderTemplate(file.output, variables);
      const outputPath = path.resolve(targetDir, renderedName);

      await ensureDir(path.dirname(outputPath));
      const renderedContent = renderTemplate(templateContent, variables);
      await writeFile(outputPath, renderedContent);

      createdFiles.push(renderedName);
    }
  } else {
    // Fallback для старых шаблонов без files.json
    const fallbackFiles = ['component.tsx.tpl', 'index.ts.tpl'];

    for (const tpl of fallbackFiles) {
      const tplPath = path.join(templatePath, tpl);
      if (await pathExists(tplPath)) {
        const content = await readFile(tplPath);
        const rendered = renderTemplate(content, variables);
        const name = toKebabCase(variables.name || 'component');
        const outputPath = path.join(targetDir, rendered.includes('test') ? `${name}.test.tsx` : `${name}.tsx`);
        await writeFile(outputPath, rendered);
        createdFiles.push(path.basename(outputPath));
      }
    }
  }

  return createdFiles;
}
