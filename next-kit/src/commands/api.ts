import { intro, outro, text, select, spinner } from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import fs from 'fs-extra';
import { logger } from '../core/logger.js';

interface ApiOptions {
  route?: string;
  action?: boolean;
}

export async function apiCommand(routeName?: string, options: ApiOptions = {}) {
  intro(pc.bgCyan(pc.black(' next-kit api ')));

  let route = routeName;

  if (!route) {
    const result = await text({
      message: 'API route name? (e.g. users)',
      placeholder: 'users',
    });
    if (typeof result === 'symbol') {
      logger.error('Cancelled');
      process.exit(0);
    }
    route = result as string;
  }

  const type = await select({
    message: 'What do you want to generate?',
    options: [
      { value: 'route', label: 'API Route (GET, POST, etc.)' },
      { value: 'action', label: 'Server Action' },
      { value: 'both', label: 'Both Route + Server Action' },
    ],
  });

  const s = spinner();
  s.start('Generating API...');

  const apiDir = path.join(process.cwd(), 'src/app/api', route as string);
  await fs.ensureDir(apiDir);

  if (type === 'route' || type === 'both') {
    const routeContent = `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello from ${route}' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ received: body });
}
`;
    await fs.writeFile(path.join(apiDir, 'route.ts'), routeContent);
    logger.success(`Created: src/app/api/${route}/route.ts`);
  }

  if (type === 'action' || type === 'both') {
    const actionContent = `'use server';

export async function ${route}Action(formData: FormData) {
  // Implement your server action here
  const data = Object.fromEntries(formData);
  console.log('Server action called with:', data);
  return { success: true };
}
`;
    const actionPath = path.join(process.cwd(), 'src/actions', `${route}.ts`);
    await fs.ensureDir(path.dirname(actionPath));
    await fs.writeFile(actionPath, actionContent);
    logger.success(`Created: src/actions/${route}.ts`);
  }

  s.stop('API generated!');
  outro(pc.green('Done!'));
}