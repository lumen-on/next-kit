import fs from 'fs-extra';
import path from 'path';
import pc from 'picocolors';
import { logger } from './logger.js';

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function pathExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.writeFile(filePath, content, 'utf8');
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf8');
}

export function resolvePath(...paths: string[]): string {
  return path.resolve(...paths);
}

/**
 * Проверяет, существует ли файл, и если да — выводит ошибку и завершает процесс
 */
export async function ensureFileDoesNotExist(filePath: string, fileDescription: string): Promise<void> {
  if (await pathExists(filePath)) {
    logger.error(`${fileDescription} already exists at ${pc.dim(filePath)}`);
    process.exit(1);
  }
}

/**
 * Создаёт файл с проверкой на существование + логирование
 */
export async function generateFile(
  filePath: string,
  content: string,
  successMessage: string
): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, content);
  logger.success(successMessage);
}