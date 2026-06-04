import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { toPascalCase, toKebabCase } from '../core/template-engine.js';
import { resolveTemplate } from '../core/template-resolver.js';
import { generateFromTemplate } from '../core/template-generator.js';

export async function hookCommand(name: string): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit hook ')));

  const hookName = toPascalCase(name);
  const fileName = toKebabCase(name);

  const templateLocation = await resolveTemplate('hook');
  if (!templateLocation) {
    logger.error('Hook template not found');
    process.exit(1);
  }

  const variables = {
    Name: hookName,
    name: fileName,
  };

  try {
    const createdFiles = await generateFromTemplate(templateLocation.path, {
      variables,
      targetDir: process.cwd(),
    });

    createdFiles.forEach(file => {
      logger.success(`Created ${pc.dim(file)}`);
    });

    outro(pc.green('Hook created!'));
  } catch (error) {
    logger.error(`Failed to generate hook: ${error}`);
    process.exit(1);
  }
}
