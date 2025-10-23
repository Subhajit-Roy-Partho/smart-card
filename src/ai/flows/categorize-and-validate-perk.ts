'use server';
/**
 * @fileOverview A Genkit flow for categorizing and validating credit card perks.
 *
 * - categorizeAndValidatePerk - A function that handles the perk categorization and validation process.
 * - CategorizeAndValidatePerkInput - The input type for the categorizeAndValidatePerk function.
 * - CategorizeAndValidatePerkOutput - The return type for the categorizeAndValidatePerk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeAndValidatePerkInputSchema = z.object({
  perkDescription: z
    .string()
    .describe('The description of the credit card perk to be categorized and validated.'),
  existingCategories: z.array(z.string()).describe('A list of existing perk categories.'),
});

export type CategorizeAndValidatePerkInput = z.infer<typeof CategorizeAndValidatePerkInputSchema>;

const CategorizeAndValidatePerkOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the perk is valid and not erroneous.'),
  category: z
    .string()
    .describe(
      'The category to which the perk belongs.  Must be one of the existing categories or a new category if appropriate.'
    ),
});

export type CategorizeAndValidatePerkOutput = z.infer<typeof CategorizeAndValidatePerkOutputSchema>;

export async function categorizeAndValidatePerk(
  input: CategorizeAndValidatePerkInput
): Promise<CategorizeAndValidatePerkOutput> {
  return categorizeAndValidatePerkFlow(input);
}

const categorizeAndValidatePerkPrompt = ai.definePrompt({
  name: 'categorizeAndValidatePerkPrompt',
  input: {schema: CategorizeAndValidatePerkInputSchema},
  output: {schema: CategorizeAndValidatePerkOutputSchema},
  prompt: `You are an expert credit card perk validator and categorizer.

You will receive a description of a credit card perk and a list of existing categories.
Your task is to determine if the perk is valid and to categorize it appropriately.

Here are the existing categories: {{{existingCategories}}}

Perk Description: {{{perkDescription}}}

Consider the perk description carefully.  If the perk is nonsensical or fraudulent, mark isValid as false.

If the perk seems legitimate, categorize it into one of the existing categories. If none of the categories are appropriate, use a new category that best describes the perk.

Ensure that the category you choose is descriptive and accurate.

Return the isValid boolean and the category.

Make sure that the category is a simple string, and isValid is a boolean value.  Do not return explanations.`,
});

const categorizeAndValidatePerkFlow = ai.defineFlow(
  {
    name: 'categorizeAndValidatePerkFlow',
    inputSchema: CategorizeAndValidatePerkInputSchema,
    outputSchema: CategorizeAndValidatePerkOutputSchema,
  },
  async input => {
    const {output} = await categorizeAndValidatePerkPrompt(input);
    return output!;
  }
);
