'use server';

import { z } from 'zod';

const {{name}}Schema = z.object({
  // TODO: Define schema fields
});

export async function {{name}}Action(formData: FormData) {
  const data = Object.fromEntries(formData);
  const parsed = {{name}}Schema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: 'Validation failed' };
  }

  // TODO: Implement action logic

  return { success: true };
}
