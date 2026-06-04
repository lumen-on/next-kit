import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { toKebabCase } from '../core/template-engine.js';
import { resolveTemplate } from '../core/template-resolver.js';
import { generateFromTemplate } from '../core/template-generator.js';

export async function layoutCommand(name: string): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit layout ')));

  const layoutName = toKebabCase(name);

  const templateLocation = await resolveTemplate('layout');
  if (!templateLocation) {
    logger.error('Layout template not found');
    process.exit(1);
  }

  const variables = { name: layoutName };

  try {
    const createdFiles = await generateFromTemplate(templateLocation.path, {
      variables,
      targetDir: process.cwd(),
    });

    createdFiles.forEach(file => logger.success(`Created ${pc.dim(file)}`));
    outro(pc.green('Layout created!'));
  } catch (error) {
    logger.error(`Failed to generate layout: ${error}`);
    process.exit(1);
  }
}
