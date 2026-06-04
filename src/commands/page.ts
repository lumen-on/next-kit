import { intro, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { toKebabCase, toPascalCase } from '../core/template-engine.js';
import { resolveTemplate } from '../core/template-resolver.js';
import { generateFromTemplate, normalizeFlags } from '../core/template-generator.js';

export async function pageCommand(name: string, options: { layout?: boolean } = {}): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit page ')));

  const pageName = toKebabCase(name);
  const componentName = toPascalCase(name);
  const includeLayout = options.layout ?? false;

  const templateLocation = await resolveTemplate('page');
  if (!templateLocation) {
    logger.error('Page template not found');
    process.exit(1);
  }

  const variables = {
    Name: componentName,
    name: pageName,
  };

  const flags = normalizeFlags({
    layout: includeLayout,
    ...options,
  });

  try {
    const createdFiles = await generateFromTemplate(templateLocation.path, {
      variables,
      flags,
      targetDir: process.cwd(),
    });

    createdFiles.forEach(file => {
      logger.success(`Created ${pc.dim(file)}`);
    });

    outro(pc.green('Page created!'));
  } catch (error) {
    logger.error(`Failed to generate page: ${error}`);
    process.exit(1);
  }
}
