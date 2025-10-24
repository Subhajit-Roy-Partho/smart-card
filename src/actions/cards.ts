
'use server';

import { initializeFirebaseAdmin } from '@/firebase/server-init';
import { revalidatePath } from 'next/cache';
import { getAuth } from 'firebase-admin/auth';
import { getApp } from 'firebase-admin/app';

type FormState = {
  success: boolean;
  message: string;
};

export async function suggestCard(
  prevState: FormState,
  formData: FormData,
  idToken: string,
): Promise<FormState> {
  try {
    const { firestore } = await initializeFirebaseAdmin();
    const cardName = formData.get('card-name') as string;
    const cardIssuer = formData.get('card-issuer') as string;
    const cardImage = formData.get('card-image') as string;

    if (!idToken) {
        return {
            success: false,
            message: 'User is not authenticated.',
        };
    }

    const decodedToken = await getAuth(getApp()).verifyIdToken(idToken);
    const userId = decodedToken.uid;


    if (!cardName || !cardIssuer) {
      return {
        success: false,
        message: 'Card Name and Issuer are required.',
      };
    }

    const docData = {
        name: cardName,
        issuer: cardIssuer,
        benefits: '', // Added to match schema
        userId: userId,
        createdAt: new Date(),
    };

    if (cardImage) {
        (docData as any).imageUrl = cardImage;
    }

    const newSuggestionRef = await firestore.collection('suggested_cards').add(docData);
    
    await firestore.collection('suggested_cards').doc(newSuggestionRef.id).update({ id: newSuggestionRef.id });

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
