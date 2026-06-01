import { z } from 'zod';
import path from 'path';
import { pathExists, readFile, writeFile } from './file-system.js';

export const NextKitConfigSchema = z.object({
  // Куда складывать компоненты
  componentDir: z.string().default('src/components'),

  // Куда складывать хуки
  hookDir: z.string().default('src/hooks'),

  // Куда складывать API routes / Server Actions
  apiDir: z.string().default('src/app/api'),

  // Куда складывать Server Actions
  actionDir: z.string().default('src/app/actions'),

  // Использовать ли TypeScript
  typescript: z.boolean().default(true),

  // Использовать ли Tailwind
  tailwind: z.boolean().default(true),

  // Использовать ли shadcn/ui
  shadcn: z.boolean().default(false),

  // Префикс для алиасов (@/components и т.д.)
  aliasPrefix: z.string().default('@'),

  // Кастомные пути (переопределяют стандартные)
  paths: z.record(z.string()).optional(),
});

export type NextKitConfig = z.infer<typeof NextKitConfigSchema>;

const CONFIG_FILE = 'next-kit.config.ts';

export async function loadConfig(cwd: string = process.cwd()): Promise<NextKitConfig> {
  const configPath = path.join(cwd, CONFIG_FILE);

  if (!(await pathExists(configPath))) {
    return NextKitConfigSchema.parse({});
  }

  try {
    // Динамический импорт конфига
    const configModule = await import(configPath);
    const rawConfig = configModule.default || configModule;

    return NextKitConfigSchema.parse(rawConfig);
  } catch (error) {
    console.warn('Failed to parse next-kit.config.ts, using defaults');
    return NextKitConfigSchema.parse({});
  }
}

export async function createDefaultConfig(cwd: string = process.cwd()): Promise<void> {
  const configPath = path.join(cwd, CONFIG_FILE);

  if (await pathExists(configPath)) {
    throw new Error('next-kit.config.ts already exists');
  }

  const defaultConfig = `import type { NextKitConfig } from 'next-kit-cli';

const config: NextKitConfig = {
  componentDir: 'src/components',
  hookDir: 'src/hooks',
  apiDir: 'src/app/api',
  actionDir: 'src/app/actions',
  typescript: true,
  tailwind: true,
  shadcn: false,
  aliasPrefix: '@',
};

export default config;
`;

  await writeFile(configPath, defaultConfig);
}
