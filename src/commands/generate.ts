import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { resolveTemplate } from '../core/template-resolver.js';
import { generateFromTemplate, normalizeFlags } from '../core/template-generator.js';

interface GenerateOptions {
  [key: string]: any;
}

export async function generateCommand(templateName: string, entityName: string, options: GenerateOptions = {}): Promise<void> {
  intro(pc.bgCyan(pc.black(` next-kit generate (${templateName}) `)));

  const templateLocation = await resolveTemplate(templateName);
  if (!templateLocation) {
    logger.error(`Template "${templateName}" not found`);
    logger.info('Run "next-kit template list" to see available templates');
    process.exit(1);
  }

  const variables = {
    name: entityName.toLowerCase(),
    Name: entityName.charAt(0).toUpperCase() + entityName.slice(1),
    ...options,
  };

  const flags = normalizeFlags(options);

  try {
    const createdFiles = await generateFromTemplate(templateLocation.path, {
      variables,
      flags,
      targetDir: process.cwd(),
    });

    if (createdFiles.length === 0) {
      logger.warn('No files were generated');
    } else {
      createdFiles.forEach(file => {
        logger.success(`Created ${pc.dim(file)}`);
      });
    }

    outro(pc.green('Generation complete!'));
  } catch (error) {
    logger.error(`Failed to generate: ${error}`);
    process.exit(1);
  }
}
