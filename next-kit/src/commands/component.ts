import { intro, outro, text, confirm, spinner } from '@clack/prompts';
import pc from 'picocolors';
import path from 'path';
import fs from 'fs-extra';
import { logger } from '../core/logger.js';

interface ComponentOptions {
  client?: boolean;
  shadcn?: boolean;
  test?: boolean;
}

export async function componentCommand(name: string, options: ComponentOptions) {
  intro(pc.bgCyan(pc.black(' next-kit component ')));

  const componentName = name.charAt(0).toUpperCase() + name.slice(1);
  const isClient = options.client ?? false;
  const useShadcn = options.shadcn ?? false;
  const withTest = options.test ?? false;

  const s = spinner();
  s.start(`Generating component ${componentName}...`);

  const componentsDir = path.join(process.cwd(), 'src/components');
  await fs.ensureDir(componentsDir);

  const componentPath = path.join(componentsDir, `${componentName}.tsx`);

  // Generate component content
  let componentContent = '';

  if (isClient) {
    componentContent += `'use client';\n\n`;
  }

  if (useShadcn) {
    componentContent += `import { Button } from '@/components/ui/button';\n\n`;
  }

  componentContent += `interface ${componentName}Props {
  // Add props here
}

export function ${componentName}({}: ${componentName}Props) {
  return (
    <div className="p-4">
      <h2>${componentName}</h2>
      ${useShadcn ? '<Button>Click me</Button>' : ''}
    </div>
  );
}
`;

  await fs.writeFile(componentPath, componentContent);

  // Generate test file if requested
  if (withTest) {
    const testContent = `import { render, screen } from '@testing-library/react';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    render(<${componentName} />);
    expect(screen.getByText('${componentName}')).toBeInTheDocument();
  });
});
`;
    await fs.writeFile(
      path.join(componentsDir, `${componentName}.test.tsx`),
      testContent
    );
  }

  s.stop('Component generated successfully!');

  logger.success(`Created: src/components/${componentName}.tsx`);
  if (withTest) {
    logger.success(`Created: src/components/${componentName}.test.tsx`);
  }

  outro(pc.green('Done!'));
}