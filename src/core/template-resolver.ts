import path from 'path';
import os from 'os';
import { pathExists } from './file-system.js';

export interface TemplateLocation {
  name: string;
  path: string;
  type: 'builtin' | 'local' | 'global';
}

const LOCAL_TEMPLATES_DIR = '.next-kit/templates';
const GLOBAL_TEMPLATES_DIR = path.join(os.homedir(), '.next-kit/templates');

/**
 * Возвращает пути для поиска шаблонов (по приоритету)
 */
export function getTemplateSearchPaths(): string[] {
  const cwd = process.cwd();
  return [
    path.resolve(cwd, LOCAL_TEMPLATES_DIR),           // Локальные (высший приоритет)
    GLOBAL_TEMPLATES_DIR,                             // Глобальные
    path.resolve(import.meta.dirname, '../../templates'), // Встроенные
  ];
}

/**
 * Проверяет, существует ли шаблон по указанному пути
 */
export async function templateExists(templateName: string, basePath: string): Promise<boolean> {
  const templatePath = path.join(basePath, templateName);
  return await pathExists(templatePath);
}

/**
 * Ищет шаблон по имени во всех доступных расположениях.
 * Возвращает информацию о найденном шаблоне или null.
 */
export async function resolveTemplate(templateName: string): Promise<TemplateLocation | null> {
  const searchPaths = getTemplateSearchPaths();
  const types: Array<'local' | 'global' | 'builtin'> = ['local', 'global', 'builtin'];

  for (let i = 0; i < searchPaths.length; i++) {
    const basePath = searchPaths[i];
    const type = types[i];

    if (await templateExists(templateName, basePath)) {
      return {
        name: templateName,
        path: path.join(basePath, templateName),
        type,
      };
    }
  }

  return null;
}

/**
 * Возвращает список всех доступных шаблонов (уникальные имена)
 */
export async function listAvailableTemplates(): Promise<TemplateLocation[]> {
  const searchPaths = getTemplateSearchPaths();
  const types: Array<'local' | 'global' | 'builtin'> = ['local', 'global', 'builtin'];
  const foundTemplates = new Map<string, TemplateLocation>();

  for (let i = 0; i < searchPaths.length; i++) {
    const basePath = searchPaths[i];
    const type = types[i];

    if (!(await pathExists(basePath))) continue;

    try {
      const entries = await import('fs').then(fs => fs.promises.readdir(basePath, { withFileTypes: true }));
      
      for (const entry of entries) {
        if (entry.isDirectory() && !foundTemplates.has(entry.name)) {
          foundTemplates.set(entry.name, {
            name: entry.name,
            path: path.join(basePath, entry.name),
            type,
          });
        }
      }
    } catch {
      // Игнорируем ошибки чтения директории
    }
  }

  return Array.from(foundTemplates.values());
}
