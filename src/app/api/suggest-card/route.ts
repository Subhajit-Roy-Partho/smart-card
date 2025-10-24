import { NextRequest, NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '@/firebase/server-init';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const { firestore } = await initializeFirebaseAdmin();
    const token = req.headers.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required.' },
        { status: 401 }
      );
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const formData = await req.formData();
    const cardName = formData.get('card-name') as string;
    const cardIssuer = formData.get('card-issuer') as string;
    const cardImage = formData.get('card-image') as string;

    if (!cardName || !cardIssuer) {
      return NextResponse.json(
        { message: 'Card Name and Issuer are required.' },
        { status: 400 }
      );
    }
    
    const suggestionRef = firestore.collection('suggested_cards').doc();
    const docData = {
      id: suggestionRef.id,
      name: cardName,
      issuer: cardIssuer,
      benefits: '', 
      userId: userId,
      createdAt: FieldValue.serverTimestamp(),
      imageUrl: cardImage || '',
    };

    await suggestionRef.set(docData);

    return NextResponse.json({
      success: true,
      message: 'Card suggested successfully!',
    });
  } catch (error) {
    console.error('Error in /api/suggest-card:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json(
      { success: false, message: `Failed to suggest card: ${errorMessage}` },
      { status: 500 }
    );
  }
}
