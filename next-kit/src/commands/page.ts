import { intro, outro, text, select, spinner } from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import fs from 'fs-extra';
import { logger } from '../core/logger.js';

export async function pageCommand(pageName?: string) {
  intro(pc.bgCyan(pc.black(' next-kit page ')));

  let name = pageName;

  if (!name) {
    const result = await text({
      message: 'Page name? (e.g. dashboard)',
      placeholder: 'dashboard',
    });
    if (typeof result === 'symbol') {
      logger.error('Cancelled');
      process.exit(0);
    }
    name = result as string;
  }

  const layout = await select({
    message: 'Include layout file?',
    options: [
      { value: false, label: 'No' },
      { value: true, label: 'Yes' },
    ],
  });

  const s = spinner();
  s.start('Generating page...');

  const pageDir = path.join(process.cwd(), 'src/app', name as string);
  await fs.ensureDir(pageDir);

  const pageContent = `export default function ${name!.charAt(0).toUpperCase() + name!.slice(1)}Page() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">${name} Page</h1>
    </div>
  );
}
`;

  await fs.writeFile(path.join(pageDir, 'page.tsx'), pageContent);
  logger.success(`Created: src/app/${name}/page.tsx`);

  if (layout) {
    const layoutContent = `export default function ${name!.charAt(0).toUpperCase() + name!.slice(1)}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
`;
    await fs.writeFile(path.join(pageDir, 'layout.tsx'), layoutContent);
    logger.success(`Created: src/app/${name}/layout.tsx`);
  }

  s.stop('Page generated!');
  outro(pc.green('Done!'));
}