import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { resolveTemplate } from '../core/template-resolver.js';
import { generateFromTemplate } from '../core/template-generator.js';

export async function middlewareCommand(): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit middleware ')));

  const templateLocation = await resolveTemplate('middleware');
  if (!templateLocation) {
    logger.error('Middleware template not found');
    process.exit(1);
  }

  try {
    const createdFiles = await generateFromTemplate(templateLocation.path, {
      variables: {},
      targetDir: process.cwd(),
    });

    createdFiles.forEach(file => logger.success(`Created ${pc.dim(file)}`));
    outro(pc.green('Middleware created!'));
  } catch (error) {
    logger.error(`Failed to generate middleware: ${error}`);
    process.exit(1);
  }
}