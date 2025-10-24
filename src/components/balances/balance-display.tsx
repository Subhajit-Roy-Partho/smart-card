'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import type { Card as CardType } from '@/lib/definitions';
import { collection } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

export function BalanceDisplay() {
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
        <CardTitle>Card Balances</CardTitle>
        <CardDescription>
          An overview of your current credit card balances and utilization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <>
            <BalanceSkeleton />
            <BalanceSkeleton />
            <BalanceSkeleton />
          </>
        )}
        {!isLoading &&
          cards &&
          cards.map((card) => {
            const utilization = (card.balance / card.creditLimit) * 100;
            return (
              <div key={card.id}>
                <div className="mb-1 flex justify-between">
                  <span className="font-medium">
                    {card.name} ({card.last4})
                  </span>
                  <span className="text-muted-foreground">
                    ${card.balance.toLocaleString()} / $
                    {card.creditLimit.toLocaleString()}
                  </span>
                </div>
                <Progress value={utilization} />
                <div className="mt-1 flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    APR: {card.apr}%
                  </span>
                  <span className="text-xs font-medium">
                    {utilization.toFixed(1)}% Used
                  </span>
                </div>
              </div>
            );
          })}
        {!isLoading && (!cards || cards.length === 0) && (
            <p className="text-center text-muted-foreground">No cards found.</p>
        )}
      </CardContent>
    </Card>
  );
}

const BalanceSkeleton = () => (
    <div>
        <div className="mb-1 flex justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
        </div>
        <Skeleton className="h-4 w-full" />
        <div className="mt-1 flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
        </div>
    </div>
)
