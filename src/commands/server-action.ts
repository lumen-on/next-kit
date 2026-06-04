import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { toKebabCase } from '../core/template-engine.js';
import { resolveTemplate } from '../core/template-resolver.js';
import { generateFromTemplate } from '../core/template-generator.js';

export async function serverActionCommand(name: string): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit server-action ')));

  const actionName = toKebabCase(name);

  const templateLocation = await resolveTemplate('server-action');
  if (!templateLocation) {
    logger.error('Server Action template not found');
    process.exit(1);
  }

  const variables = { name: actionName };

  try {
    const createdFiles = await generateFromTemplate(templateLocation.path, {
      variables,
      targetDir: process.cwd(),
    });

    createdFiles.forEach(file => logger.success(`Created ${pc.dim(file)}`));
    outro(pc.green('Server Action created!'));
  } catch (error) {
    logger.error(`Failed to generate Server Action: ${error}`);
    process.exit(1);
  }
}
