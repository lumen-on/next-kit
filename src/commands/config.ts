import { intro, outro, select } from '@clack/prompts';
import pc from 'picocolors';
import { logger } from '../core/logger.js';
import { createDefaultConfig } from '../core/config.js';

export async function configInitCommand(): Promise<void> {
  intro(pc.bgCyan(pc.black(' next-kit config init ')));

  try {
    await createDefaultConfig();
    logger.success('Created next-kit.config.ts');
    logger.dim('You can now customize paths and behavior in the config file.');
  } catch (error: any) {
    logger.error(error.message);
    process.exit(1);
  }

  outro(pc.green('Config created!'));
}
