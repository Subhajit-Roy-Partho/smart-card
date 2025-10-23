'use server';

import { ai } from '@/ai/genkit';

export async function testAiConnection() {
  try {
    // const { text } = await ai.generate({
    //   prompt: 'Hello!',
    // });
    const text = 'AI connection is currently disabled.';

    if (text) {
      // return { status: 'success' as const, message: 'Successfully received a response from the model.' };
      return { status: 'error' as const, message: text };
    } else {
      return { status: 'error' as const, message: 'Received an empty response from the model.' };
    }
  } catch (e: any) {
    return { status: 'error' as const, message: e.message || 'An unknown error occurred.' };
  }
}
