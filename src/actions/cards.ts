'use server';

import { initializeFirebaseAdmin } from '@/firebase/server-init';
import { revalidatePath } from 'next/cache';
import { getAuth } from 'firebase-admin/auth';
import { getApp } from 'firebase-admin/app';

type FormState = {
  success: boolean;
  message: string;
};

// This server action is being deprecated in favor of an API route
// to ensure proper environment variable handling for Firebase Admin SDK.
// The logic is moved to /api/suggest-card/route.ts
export async function suggestCard(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  return {
    success: false,
    message: 'This action is deprecated. Please use the API route.',
  };
}
