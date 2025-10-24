
'use server';

import { initializeFirebaseAdmin } from '@/firebase/server-init';
import { revalidatePath } from 'next/cache';
import { getAuth } from 'firebase-admin/auth';

type FormState = {
  success: boolean;
  message: string;
};

export async function suggestCard(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const { firestore } = await initializeFirebaseAdmin();
  const cardName = formData.get('card-name') as string;
  const cardIssuer = formData.get('card-issuer') as string;
  const cardImage = formData.get('card-image') as string;

  // This is a placeholder for getting the current user's ID
  // In a real app, you'd get this from the session
  const userId = 'anonymous-user'; 

  if (!cardName || !cardIssuer) {
    return {
      success: false,
      message: 'Card Name and Issuer are required.',
    };
  }

  try {
    await firestore.collection('suggested_cards').add({
      name: cardName,
      issuer: cardIssuer,
      imageUrl: cardImage,
      userId: userId,
      createdAt: new Date(),
    });

    revalidatePath('/dashboard/cards');
    return {
      success: true,
      message: 'Card suggested successfully!',
    };
  } catch (error) {
    console.error('Error suggesting card:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return {
      success: false,
      message: `Failed to suggest card: ${errorMessage}`,
    };
  }
}
