import { intro, text, select, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { ensureDir, pathExists, writeFile } from '../core/file-system.js';
import { toKebabCase } from '../core/template-engine.js';
import path from 'path';

export async function apiCommand(name: string, options: { action?: boolean } = {}): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit api ')));

  const routeName = toKebabCase(name);
  const isAction = options.action ?? false;

  const targetDir = isAction 
    ? path.resolve(process.cwd(), 'src/app/actions')
    : path.resolve(process.cwd(), `src/app/api/${routeName}`);

  await ensureDir(targetDir);

  const fileName = isAction ? `${routeName}.ts` : 'route.ts';
  const filePath = path.join(targetDir, fileName);

  if (await pathExists(filePath)) {
    logger.error(`${isAction ? 'Action' : 'Route'} already exists`);
    process.exit(1);
  }

  let code = '';

  if (isAction) {
    code = `import { revalidatePath } from 'next/cache';\n\n`;
    code += `export async function ${routeName}Action(formData: FormData) {\n`;
    code += `  // TODO: Implement ${routeName} action\n`;
    code += `  revalidatePath('/');\n`;
    code += `  return { success: true };\n`;
    code += `}\n`;
  } else {
    code = `import { NextResponse } from 'next/server';\n\n`;
    code += `export async function GET() {\n`;
    code += `  return NextResponse.json({ message: '${routeName}' });\n`;
    code += `}\n\n`;
    code += `export async function POST(request: Request) {\n`;
    code += `  const body = await request.json();\n`;
    code += `  return NextResponse.json({ received: body });\n`;
    code += `}\n`;
  }

  await writeFile(filePath, code);
  logger.success(`Created ${pc.dim(isAction ? `src/app/actions/${fileName}` : `src/app/api/${routeName}/route.ts`)}`);

  outro(pc.green('API created!'));
}
