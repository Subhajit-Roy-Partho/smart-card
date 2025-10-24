'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import { getSpendingOptimizationSuggestions } from '@/ai/flows/spending-optimization-suggestions';
import { transactions, cards } from '@/lib/data';
import { Loader2 } from 'lucide-react';

type FormState = {
  suggestions?: string;
  error?: string;
} | null;

const spendingPatterns = `User primarily spends on electronics, travel, and groceries. Recent large purchase was a laptop. Frequent small purchases at coffee shops.`;
const cardBenefits = `Tech Rewards card offers 3x points on electronics. Travel Points Plus gives 2x miles on travel and dining. Everyday Cash offers 1.5% cashback on all purchases.`;
const cardDetails = cards
  .map(
    (c) =>
      `${c.name}: Limit $${c.creditLimit}, APR ${c.apr}%, Balance $${c.balance}`
  )
  .join('. ');

async function formAction(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const result = await getSpendingOptimizationSuggestions({
            spendingPatterns: spendingPatterns,
            availableCardBenefits: cardBenefits,
            creditCardDetails: cardDetails
        });
        return result;
    } catch (e) {
        return { error: "An error occurred while generating suggestions." };
    }
}

export function SpendingSuggestions() {
  const [state, formActionWithState, isPending] = useActionState(formAction, null);
  
  return (
    <Card>
      <form action={formActionWithState}>
        <CardHeader>
          <CardTitle>Spending Optimization</CardTitle>
          <CardDescription>
            Click the button to get AI-powered suggestions based on your
            spending profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPending && (
            <div className="flex items-center space-x-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing your spending...</span>
            </div>
          )}
          {state?.suggestions && (
            <div className="prose prose-sm max-w-none text-foreground">
                <h3 className="font-semibold">Here are your suggestions:</h3>
                <ul>
                    {state.suggestions.split('\n- ').filter(s => s.trim()).map((suggestion, index) => (
                        <li key={index}>{suggestion.replace(/^- /, '')}</li>
                    ))}
                </ul>
            </div>
          )}
          {state?.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Suggestions
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
