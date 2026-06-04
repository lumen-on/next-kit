import { intro, confirm, outro } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { toKebabCase } from '../core/template-engine.js';
import { resolveTemplate } from '../core/template-resolver.js';
import { generateFromTemplate, normalizeFlags } from '../core/template-generator.js';

export async function apiCommand(name: string, options: { action?: boolean } = {}): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit api ')));

  const routeName = toKebabCase(name);
  const isAction = options.action ?? false;

  // Если это Server Action — используем отдельный шаблон
  const templateName = isAction ? 'server-action' : 'api';

  const templateLocation = await resolveTemplate(templateName);
  if (!templateLocation) {
    logger.error(`${templateName} template not found`);
    process.exit(1);
  }

  const variables = { name: routeName };

  try {
    const createdFiles = await generateFromTemplate(templateLocation.path, {
      variables,
      targetDir: process.cwd(),
    });

    createdFiles.forEach(file => logger.success(`Created ${pc.dim(file)}`));
    outro(pc.green('API created!'));
  } catch (error) {
    logger.error(`Failed to generate API: ${error}`);
    process.exit(1);
  }
}
