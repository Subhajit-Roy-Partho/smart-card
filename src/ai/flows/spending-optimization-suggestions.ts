'use server';

/**
 * @fileOverview A flow to provide personalized suggestions on how to optimize credit card usage based on spending patterns and card benefits.
 *
 * - `getSpendingOptimizationSuggestions` - A function that generates spending optimization suggestions.
 * - `SpendingOptimizationSuggestionsInput` - The input type for the `getSpendingOptimizationSuggestions` function.
 * - `SpendingOptimizationSuggestionsOutput` - The return type for the `getSpendingOptimizationSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SpendingOptimizationSuggestionsInputSchema = z.object({
  spendingPatterns: z
    .string()
    .describe(
      'A detailed description of the user\'s spending patterns, including categories, amounts, and frequency.'
    ),
  availableCardBenefits: z
    .string()
    .describe(
      'A comprehensive list of available credit card benefits, including rewards, cashback, and perks.'
    ),
  creditCardDetails: z
    .string()
    .describe(
      'Details for each card, including credit limit, APR, current balance, and rewards program. Example: Card A: Limit $5000, APR 18%, Balance $1000, 2% cashback on groceries. Card B: Limit $10000, APR 15%, Balance $2000, 1.5x points on travel.'
    ),
});
export type SpendingOptimizationSuggestionsInput = z.infer<
  typeof SpendingOptimizationSuggestionsInputSchema
>;

const SpendingOptimizationSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'Personalized suggestions on how to optimize credit card usage, considering spending patterns and card benefits.'
    ),
});
export type SpendingOptimizationSuggestionsOutput = z.infer<
  typeof SpendingOptimizationSuggestionsOutputSchema
>;

export async function getSpendingOptimizationSuggestions(
  input: SpendingOptimizationSuggestionsInput
): Promise<SpendingOptimizationSuggestionsOutput> {
  return spendingOptimizationSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'spendingOptimizationSuggestionsPrompt',
  input: {schema: SpendingOptimizationSuggestionsInputSchema},
  output: {schema: SpendingOptimizationSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized credit card spending optimization suggestions.

  Analyze the user's spending patterns, available card benefits, and credit card details to generate actionable recommendations.

  Spending Patterns: {{{spendingPatterns}}}
  Available Card Benefits: {{{availableCardBenefits}}}
  Credit Card Details: {{{creditCardDetails}}}

  Provide clear, concise, and easy-to-understand suggestions to help the user make smarter financial decisions and maximize their credit card rewards and benefits.
  Make sure to incorporate specific details about each card's limit, APR, balance and rewards program into your recommendations.
  Focus on suggesting the user shift spending to cards that give better benefits based on their spending pattern, so that they can achieve greater rewards and save money on APR.
  If some spending patterns are not ideal based on their card details, give clear suggestions about that as well, for example: "Consider paying off your Card A balance more aggressively to reduce interest charges, given its high APR."
  Output suggestions in a bulleted list.
  Do not repeat any content from the input in the response.
  `,
});

const spendingOptimizationSuggestionsFlow = ai.defineFlow(
  {
    name: 'spendingOptimizationSuggestionsFlow',
    inputSchema: SpendingOptimizationSuggestionsInputSchema,
    outputSchema: SpendingOptimizationSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
