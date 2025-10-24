
'use client';

import {
  useCollection,
  useDoc,
  useFirebase,
  useMemoFirebase,
} from '@/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { collection, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { Card as CardType, UserProfile } from '@/lib/definitions';
import { Skeleton } from '../ui/skeleton';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

export function PersonalCards() {
  const { firestore, user } = useFirebase();

  const allCardsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'credit_cards') : null),
    [firestore]
  );
  const { data: allCards, isLoading: isLoadingAllCards } =
    useCollection<CardType>(allCardsQuery);

  const userProfileRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isLoadingUserProfile } =
    useDoc<UserProfile>(userProfileRef);

  const handleCardToggle = async (cardId: string, isOwned: boolean) => {
    if (!userProfileRef) return;
    try {
      await updateDoc(userProfileRef, {
        personalCards: isOwned ? arrayUnion(cardId) : arrayRemove(cardId),
      });
    } catch (error) {
      console.error('Error updating personal cards:', error);
      // Here you might want to show a toast to the user
    }
  };

  const isLoading = isLoadingAllCards || isLoadingUserProfile;
  const personalCardIds = new Set(userProfile?.personalCards || []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Cards</CardTitle>
        <CardDescription>
          Select the credit cards you personally own. This helps us tailor your
          experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
            <>
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </>
        )}
        {!isLoading && allCards && allCards.map((card) => {
            const isOwned = personalCardIds.has(card.id);
            const checkboxId = `card-${card.id}`;
            return (
              <div key={card.id} className="flex items-center space-x-3 rounded-md border p-4">
                <Checkbox 
                    id={checkboxId}
                    checked={isOwned}
                    onCheckedChange={(checked) => handleCardToggle(card.id, !!checked)}
                />
                <Label htmlFor={checkboxId} className="w-full cursor-pointer">
                    <div className="flex justify-between">
                        <span className="font-bold">{card.name}</span>
                        <span className="text-sm text-muted-foreground">{card.issuer}</span>
                    </div>
                </Label>
              </div>
            )
        })}
         {!isLoading && (!allCards || allCards.length === 0) && (
            <p className="text-center text-muted-foreground">No cards available to select.</p>
        )}
      </CardContent>
    </Card>
  );
}


const CardSkeleton = () => (
    <div className="flex items-center space-x-3 rounded-md border p-4">
        <Skeleton className="h-4 w-4" />
        <div className="w-full space-y-1.5">
            <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
            </div>
        </div>
    </div>
)
