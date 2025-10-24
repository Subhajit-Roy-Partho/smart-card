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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cards } from '@/lib/data';
import { useActionState } from 'react';
import { balanceConsolidationAdvisor } from '@/ai/flows/balance-consolidation-advisor';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

type FormState = {
    shouldConsolidate?: boolean;
    reason?: string;
    newCreditUtilization?: number;
    error?: string;
} | null;

async function formAction(prevState: FormState, formData: FormData): Promise<FormState> {
    const fromCardId = formData.get('from-card') as string;
    const toCardId = formData.get('to-card') as string;

    if (!fromCardId || !toCardId || fromCardId === toCardId) {
        return { error: 'Please select two different cards.' };
    }

    const fromCard = cards.find(c => c.id === fromCardId);
    const toCard = cards.find(c => c.id === toCardId);

    if (!fromCard || !toCard) {
        return { error: 'Invalid card selection.' };
    }

    try {
        const result = await balanceConsolidationAdvisor({
            fromCardBalance: fromCard.balance,
            fromCardApr: fromCard.apr / 100,
            toCardApr: toCard.apr / 100,
            toCardCreditLimit: toCard.creditLimit,
            currentCreditUtilization: 0.3, // Mock data
            monthlySpending: 1500, // Mock data
            monthlyPayment: 800, // Mock data
        });
        return result;
    } catch (e) {
        return { error: 'An error occurred while getting advice.' };
    }
}

export function ConsolidationAdvisor() {
  const [state, formActionWithState, isPending] = useActionState(formAction, null);
    
  return (
    <Card>
      <form action={formActionWithState}>
        <CardHeader>
          <CardTitle>Balance Consolidation Advisor</CardTitle>
          <CardDescription>
            See if you can save money by transferring a balance.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="from-card">Transfer From</Label>
              <Select name="from-card">
                <SelectTrigger id="from-card">
                  <SelectValue placeholder="Select a card" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.name} (${card.balance.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-card">Transfer To</Label>
              <Select name="to-card">
                <SelectTrigger id="to-card">
                  <SelectValue placeholder="Select a card" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.name} (Limit: ${card.creditLimit.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {state && (state.reason || state.error) && (
             <Alert variant={state.error || !state.shouldConsolidate ? 'destructive' : 'default'}>
                {state.shouldConsolidate ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{state.error ? 'Error' : state.shouldConsolidate ? 'Recommendation: Consolidate' : 'Recommendation: Do Not Consolidate'}</AlertTitle>
                <AlertDescription>
                    {state.error || state.reason}
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Advise Me
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
