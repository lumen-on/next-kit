import path from 'path';
import { readFile, pathExists } from './file-system.js';

export interface TemplateFile {
  template: string;           // имя файла шаблона (например: "component.tsx.tpl")
  output: string;             // имя выходного файла (поддерживает {{name}})
  condition?: string | boolean; // условие генерации (например: "{{withTest}}" или true)
}

export interface TemplateConfig {
  name: string;
  description?: string;
  files: TemplateFile[];
}

/**
 * Читает и парсит files.json из папки шаблона
 */
export async function loadTemplateConfig(templatePath: string): Promise<TemplateConfig | null> {
  const configPath = path.join(templatePath, 'files.json');

  if (!(await pathExists(configPath))) {
    return null;
  }

  try {
    const content = await readFile(configPath);
    const config = JSON.parse(content) as TemplateConfig;
    return config;
  } catch (error) {
    console.error(`Failed to parse files.json in ${templatePath}:`, error);
    return null;
  }
}

/**
 * Проверяет, нужно ли генерировать файл на основе условия и переданных флагов
 */
export function shouldGenerateFile(
  file: TemplateFile,
  variables: Record<string, any>
): boolean {
  if (file.condition === undefined || file.condition === true) {
    return true;
  }

  if (typeof file.condition === 'boolean') {
    return file.condition;
  }

  // Поддержка строковых условий вида "{{withTest}}"
  const conditionStr = file.condition as string;
  const match = conditionStr.match(/^{{\s*(\w+)\s*}}$/);

  if (match) {
    const key = match[1];
    return variables[key] === true;
  }

  // Если условие не распознано — генерируем по умолчанию
  return true;
}
