'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lightbulb, Loader2 } from 'lucide-react';
import { outletSpecificCardSuggestion } from '@/ai/flows/outlet-specific-card-suggestion';
import { cards } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type FormState = {
  suggestedCard?: string;
  reason?: string;
  error?: string;
} | null;

const availableCardsString = cards.map(c => `${c.name} (${c.issuer})`).join(', ');

async function formAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  try {
    const outlet = formData.get('outlet') as string;
    const spendingAmount = Number(formData.get('amount') as string);
    
    if (!outlet || !spendingAmount) {
        return { error: 'Please fill in all fields.' };
    }

    const result = await outletSpecificCardSuggestion({
      outlet,
      spendingAmount,
      availableCards: availableCardsString,
    });
    return result;
  } catch (e) {
    return { error: 'An error occurred while getting suggestions.' };
  }
}

export function OutletCardSuggestion() {
  const [state, formActionWithState] = useFormState(formAction, null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);
    await formActionWithState(formData);
    setPending(false);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Outlet-Specific Suggestion</CardTitle>
          <CardDescription>
            Find the best card to use for your next purchase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="outlet">Store / Outlet</Label>
            <Input id="outlet" name="outlet" placeholder="e.g., Amazon, Starbucks" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Spending Amount ($)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="e.g., 150"
            />
          </div>
          {state && (state.suggestedCard || state.error) && (
            <Alert variant={state.error ? 'destructive' : 'default'}>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>{state.error ? 'Error' : `Suggested Card: ${state.suggestedCard}`}</AlertTitle>
              <AlertDescription>
                {state.error || state.reason}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Suggestion
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
