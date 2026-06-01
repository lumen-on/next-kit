import { revalidatePath } from 'next/cache';

export async function {{name}}Action(formData: FormData) {
  // TODO: Implement {{name}} action
  revalidatePath('/');
  return { success: true };
}
