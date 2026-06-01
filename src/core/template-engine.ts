export function renderTemplate(template: string, variables: Record<string, any>): string {
  let result = template;

  // Обработка условных блоков {{#if key}} ... {{/if}}
  const ifRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
  result = result.replace(ifRegex, (match, key, content) => {
    return variables[key] ? content : '';
  });

  // Простая замена переменных {{key}}
  for (const [key, value] of Object.entries(variables)) {
    if (typeof value === 'boolean') continue; // булевы уже обработаны выше
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, String(value));
  }

  return result.trim();
}

export function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[_\s]+/g, '-');
}
