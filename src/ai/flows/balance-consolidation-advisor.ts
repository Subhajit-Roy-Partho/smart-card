'use server';

/**
 * @fileOverview An AI agent that advises users on whether to consolidate credit card balances.
 *
 * - balanceConsolidationAdvisor - A function that handles the balance consolidation advice process.
 * - BalanceConsolidationAdvisorInput - The input type for the balanceConsolidationAdvisor function.
 * - BalanceConsolidationAdvisorOutput - The return type for the balanceConsolidationAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BalanceConsolidationAdvisorInputSchema = z.object({
  currentCreditUtilization: z.number().describe('The user\'s current overall credit utilization ratio (e.g., 0.3 for 30%).'),
  fromCardBalance: z.number().describe('The balance on the card to transfer from.'),
  fromCardApr: z.number().describe('The APR of the card to transfer from (e.g., 0.20 for 20%).'),
  toCardApr: z.number().describe('The APR of the card to transfer to (e.g., 0.15 for 15%).'),
  toCardCreditLimit: z.number().describe('The credit limit of the card to transfer to.'),
  monthlySpending: z.number().describe('The user\'s average monthly spending.'),
  monthlyPayment: z.number().describe('The user\'s average monthly credit card payment.'),
});
export type BalanceConsolidationAdvisorInput = z.infer<typeof BalanceConsolidationAdvisorInputSchema>;

const BalanceConsolidationAdvisorOutputSchema = z.object({
  shouldConsolidate: z.boolean().describe('Whether or not the user should consolidate their balances.'),
  reason: z.string().describe('The detailed reason for the recommendation, including potential savings or risks.'),
  newCreditUtilization: z.number().describe('The new credit utilization if balance is transferred.'),
});
export type BalanceConsolidationAdvisorOutput = z.infer<typeof BalanceConsolidationAdvisorOutputSchema>;

export async function balanceConsolidationAdvisor(input: BalanceConsolidationAdvisorInput): Promise<BalanceConsolidationAdvisorOutput> {
  return balanceConsolidationAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'balanceConsolidationAdvisorPrompt',
  input: {schema: BalanceConsolidationAdvisorInputSchema},
  output: {schema: BalanceConsolidationAdvisorOutputSchema},
  prompt: `You are a financial advisor who advises users on whether to consolidate credit card balances.

  Given the following information, determine if the user should consolidate their balance from one card to another.

  Current Credit Utilization: {{currentCreditUtilization}}
  Balance on Card to Transfer From: {{fromCardBalance}}
  APR of Card to Transfer From: {{fromCardApr}}
  APR of Card to Transfer To: {{toCardApr}}
  Credit Limit of Card to Transfer To: {{toCardCreditLimit}}
  Average Monthly Spending: {{monthlySpending}}
  Average Monthly Credit Card Payment: {{monthlyPayment}}

  Consider factors such as the potential savings in interest payments, the impact on the user's credit utilization ratio, and their ability to manage the debt.

  {{#if (gt toCardApr fromCardApr)}}
  Since the APR of the card to transfer to ({{toCardApr}}) is lower than the APR of the card to transfer from ({{fromCardApr}}), this could result in substantial savings.
  {{/if}}

  {{#if (lt toCardApr fromCardApr)}}
  Since the APR of the card to transfer to ({{toCardApr}}) is higher than the APR of the card to transfer from ({{fromCardApr}}), this could result in paying more interest.
  {{/if}}

  Here is the required output:
  shouldConsolidate: Whether or not the user should consolidate their balances.
  reason: The detailed reason for the recommendation, including potential savings or risks. Be as detailed as possible, and consider the user's ability to pay off debt.
  newCreditUtilization: The new credit utilization if balance is transferred.
  `,
});

const balanceConsolidationAdvisorFlow = ai.defineFlow(
  {
    name: 'balanceConsolidationAdvisorFlow',
    inputSchema: BalanceConsolidationAdvisorInputSchema,
    outputSchema: BalanceConsolidationAdvisorOutputSchema,
  },
  async input => {
    const newCreditUtilization = (input.fromCardBalance / input.toCardCreditLimit);
    const {
      output: {reason, shouldConsolidate},
    } = await prompt({...input, newCreditUtilization});
    return {shouldConsolidate, reason, newCreditUtilization};
  }
);
