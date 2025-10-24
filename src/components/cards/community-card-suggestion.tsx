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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import type { Card as CardType } from '@/lib/definitions';
import { collection } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

export function CommunityCardSuggestion() {
  const { firestore, user } = useFirebase();
  const cardsQuery = useMemoFirebase(
    () =>
      user && firestore
        ? collection(firestore, 'users', user.uid, 'credit_cards')
        : null,
    [firestore, user]
  );
  const { data: cards, isLoading } = useCollection<CardType>(cardsQuery);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Contributions</CardTitle>
        <CardDescription>
          Suggest new cards to the community or add benefits to your existing
          cards.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="add-benefit">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add-benefit">Add a Benefit</TabsTrigger>
            <TabsTrigger value="suggest-card">Suggest a Card</TabsTrigger>
          </TabsList>
          <TabsContent value="add-benefit" className="space-y-4 pt-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="select-card">Select a Card</Label>
                {isLoading ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Select name="select-card">
                    <SelectTrigger id="select-card">
                      <SelectValue placeholder="Choose a card..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cards?.map((card) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name} ({card.last4})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefit-store">Store / Outlet</Label>
                <Input
                  id="benefit-store"
                  name="benefit-store"
                  placeholder="e.g., Starbucks, Amazon"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefit-description">Benefit Details</Label>
                <Input
                  id="benefit-description"
                  name="benefit-description"
                  placeholder="e.g., 5% cashback, $10 coupon, 2x points"
                />
              </div>
              <Button disabled>Add Benefit</Button>
            </form>
          </TabsContent>
          <TabsContent value="suggest-card" className="space-y-4 pt-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-name">Card Name</Label>
                <Input
                  id="card-name"
                  placeholder="e.g., Ultimate Rewards Card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-issuer">Issuer</Label>
                <Input id="card-issuer" placeholder="e.g., Global Bank" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-image">Background Image URL</Label>
                <Input
                  id="card-image"
                  placeholder="https://example.com/card-image.png"
                />
              </div>
              <Button disabled>Submit Suggestion</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}