'use server';

import { ai } from '@/ai/genkit';

export async function testAiConnection() {
  try {
    const { text } = await ai.generate({
      prompt: 'Hello!',
    });

    if (text) {
      return { status: 'success' as const, message: 'Successfully received a response from the model.' };
    } else {
      return { status: 'error' as const, message: 'Received an empty response from the model.' };
    }
  } catch (e: any) {
    return { status: 'error' as const, message: e.message || 'An unknown error occurred.' };
  }
}
