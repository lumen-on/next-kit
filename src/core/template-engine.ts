import fs from 'fs-extra';
import path from 'path';

export interface TemplateVariables {
  [key: string]: string | boolean;
}

export async function renderTemplate(
  templatePath: string,
  targetPath: string,
  variables: TemplateVariables
): Promise<void> {
  const content = await fs.readFile(templatePath, 'utf-8');
  
  let rendered = content;
  
  // Simple variable replacement {{name}} and {{Name}}
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === 'string') {
      rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), value);
      // PascalCase version
      const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
      const pascalValue = value.charAt(0).toUpperCase() + value.slice(1);
      rendered = rendered.replace(new RegExp(`{{${pascalKey}}}`, 'g'), pascalValue);
    }
  }
  
  await fs.ensureDir(path.dirname(targetPath));
  await fs.writeFile(targetPath, rendered);
}