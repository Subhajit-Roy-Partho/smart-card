'use server';

/**
 * @fileOverview Suggests the optimal credit card for a specific store based on user data, store-specific benefits, and current promotions.
 *
 * - outletSpecificCardSuggestion - A function that handles the credit card suggestion process for a given outlet.
 * - OutletSpecificCardSuggestionInput - The input type for the outletSpecificCardSuggestion function.
 * - OutletSpecificCardSuggestionOutput - The return type for the outletSpecificCardSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OutletSpecificCardSuggestionInputSchema = z.object({
  outlet: z.string().describe('The name of the store or outlet where the user is making a purchase.'),
  spendingAmount: z.number().describe('The amount the user is planning to spend at the outlet.'),
  userData: z
    .string()
    .optional()
    .describe('Optional user data including spending habits and credit card portfolio.'),
  availableCards: z
    .string()
    .optional()
    .describe('List of available credit cards to choose from.'),
});
export type OutletSpecificCardSuggestionInput = z.infer<
  typeof OutletSpecificCardSuggestionInputSchema
>;

const OutletSpecificCardSuggestionOutputSchema = z.object({
  suggestedCard: z.string().describe('The name of the suggested credit card.'),
  reason: z.string().describe('The reason for suggesting the card.'),
});
export type OutletSpecificCardSuggestionOutput = z.infer<
  typeof OutletSpecificCardSuggestionOutputSchema
>;

export async function outletSpecificCardSuggestion(
  input: OutletSpecificCardSuggestionInput
): Promise<OutletSpecificCardSuggestionOutput> {
  return outletSpecificCardSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'outletSpecificCardSuggestionPrompt',
  input: {schema: OutletSpecificCardSuggestionInputSchema},
  output: {schema: OutletSpecificCardSuggestionOutputSchema},
  prompt: `You are an expert in credit card rewards and benefits. Given the following information, suggest the best credit card for the user to use at the specified outlet.

Outlet: {{{outlet}}}
Spending Amount: {{{spendingAmount}}}
User Data: {{{userData}}}
Available Cards: {{{availableCards}}}

Consider factors such as category bonuses, current promotions, and the user's spending habits. Provide a clear reason for your suggestion.

Output should be formatted as a JSON object with "suggestedCard" and "reason" fields.`,
});

const outletSpecificCardSuggestionFlow = ai.defineFlow(
  {
    name: 'outletSpecificCardSuggestionFlow',
    inputSchema: OutletSpecificCardSuggestionInputSchema,
    outputSchema: OutletSpecificCardSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
