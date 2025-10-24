'use server';

import { revalidatePath } from 'next/cache';

type FormState = {
  success: boolean;
  message: string;
};

// This server action is deprecated in favor of an API route
// to ensure proper environment variable handling for Firebase Admin SDK.
// The logic is in /api/suggest-card/route.ts
export async function suggestCard(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return {
    success: false,
    message: 'This action is deprecated. Please use the API route.',
  };
}
