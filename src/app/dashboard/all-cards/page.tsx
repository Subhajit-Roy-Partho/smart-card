'use client';

import { CardDisplay } from '@/components/cards/card-display';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import type { Card as CardType } from '@/lib/definitions';
import { collection } from 'firebase/firestore';

export default function AllCardsPage() {
  const { firestore } = useFirebase();
  const allCardsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'credit_cards') : null),
    [firestore]
  );
  const { data: allCards, isLoading: isLoadingAllCards } =
    useCollection<CardType>(allCardsQuery);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          All Credit Cards
        </h1>
        <p className="text-muted-foreground">
          Browse all available credit cards in the system.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoadingAllCards &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 w-full animate-pulse rounded-lg bg-muted"
            />
          ))}
        {allCards?.map((card) => <CardDisplay key={card.id} card={card} />)}
      </div>
    </div>
  );
}
