'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useActionState } from 'react';
import { categorizeAndValidatePerk } from '@/ai/flows/categorize-and-validate-perk';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type PerkFormState = {
  isValid?: boolean;
  category?: string;
  error?: string;
} | null;

const existingCategories = ['Travel', 'Dining', 'Groceries', 'Cashback', 'Gas', 'Entertainment', 'Shopping'];

async function perkFormAction(
  prevState: PerkFormState,
  formData: FormData
): Promise<PerkFormState> {
  try {
    const perkDescription = formData.get('perk-description') as string;
    if (!perkDescription) {
        return { error: 'Please enter a perk description.' };
    }
    const result = await categorizeAndValidatePerk({ perkDescription, existingCategories });
    return result;
  } catch (e) {
    return { error: 'An error occurred during validation.' };
  }
}

export function CommunityCardSuggestion() {
    const [perkState, perkFormActionWithState, isPerkPending] = useActionState(perkFormAction, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Contributions</CardTitle>
        <CardDescription>
          Help us grow by suggesting new cards or perks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add-perk">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-perk">Add a Perk</TabsTrigger>
            <TabsTrigger value="suggest-card">Suggest a Card</TabsTrigger>
          </TabsList>
          <TabsContent value="add-perk" className="space-y-4 pt-4">
            <form action={perkFormActionWithState} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="perk-description">Perk Description</Label>
                    <Textarea
                    id="perk-description"
                    name="perk-description"
                    placeholder="e.g., 5% cashback on all streaming services."
                    />
                </div>
                {perkState && (perkState.isValid !== undefined || perkState.error) && (
                    <Alert variant={perkState.error || !perkState.isValid ? 'destructive' : 'default'}>
                        {perkState.isValid ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        <AlertTitle>{perkState.error ? 'Error' : perkState.isValid ? 'Perk Validated' : 'Perk Invalid'}</AlertTitle>
                        <AlertDescription>
                            {perkState.error || (perkState.isValid ? `Categorized as: ${perkState.category}` : "This perk seems invalid or erroneous.")}
                        </AlertDescription>
                    </Alert>
                )}
                <Button type="submit" disabled={isPerkPending}>
                    {isPerkPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Validate & Add Perk
                </Button>
            </form>
          </TabsContent>
          <TabsContent value="suggest-card" className="space-y-4 pt-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-name">Card Name</Label>
                <Input id="card-name" placeholder="e.g., Ultimate Rewards Card" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-issuer">Issuer</Label>
                <Input id="card-issuer" placeholder="e.g., Global Bank" />
              </div>
              <Button disabled>Submit Suggestion</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
