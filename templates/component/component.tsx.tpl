{{#if client}}
'use client';
{{/if}}

{{#if shadcn}}
import { cn } from '@/lib/utils';
{{/if}}

interface {{Name}}Props {
  className?: string;
  children?: React.ReactNode;
}

export function {{Name}}({ className, children }: {{Name}}Props) {
  return (
    <div className={{{#if shadcn}}cn("{{#if defaultClass}}{{defaultClass}}{{/if}}", className){{else}}"{{#if defaultClass}}{{defaultClass}}{{/if}} {{className}}"{{/if}}}>
      {children}
    </div>
  );
}
