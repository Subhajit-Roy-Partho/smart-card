'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import type { Card as CardType } from '@/lib/definitions';
import { collection, doc, deleteDoc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Check, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

export function CardReview() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  
  const suggestedCardsQuery = useMemoFirebase(
    () => (firestore ? collection(firestore, 'suggested_cards') : null),
    [firestore]
  );
  const { data: suggestedCards, isLoading } =
    useCollection<CardType>(suggestedCardsQuery);
    
  const handleApprove = async (card: CardType) => {
    if (!firestore) return;
    try {
        const newCardRef = doc(firestore, 'credit_cards', card.id);
        const suggestedCardRef = doc(firestore, 'suggested_cards', card.id);
        
        await setDoc(newCardRef, {
            ...card,
            last4: Math.floor(1000 + Math.random() * 9000).toString(),
            balance: 0,
            creditLimit: 5000, // default value
            apr: 19.99, // default value
            paymentDueDate: new Date().toISOString(), // default value
            color: `hsl(${Math.floor(Math.random() * 360)} 55% 57%)`
        });
        await deleteDoc(suggestedCardRef);

        toast({
            title: 'Card Approved',
            description: `${card.name} has been added to the main collection.`,
        });
    } catch (error) {
        console.error("Error approving card: ", error);
        toast({
            variant: 'destructive',
            title: 'Approval Failed',
            description: 'Could not approve the card.',
        });
    }
  };

  const handleReject = async (cardId: string, cardName: string) => {
    if (!firestore) return;
     try {
        await deleteDoc(doc(firestore, 'suggested_cards', cardId));
        toast({
            title: 'Card Rejected',
            description: `${cardName} has been removed from suggestions.`,
        });
     } catch (error) {
         console.error("Error rejecting card: ", error);
         toast({
            variant: 'destructive',
            title: 'Rejection Failed',
            description: 'Could not reject the card.',
        });
     }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Card Suggestions</CardTitle>
        <CardDescription>
          Approve or reject cards suggested by the community.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}
        {!isLoading && suggestedCards && suggestedCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {suggestedCards.map((card) => (
              <div key={card.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={card.imageUrl || `https://picsum.photos/seed/${card.id}/600/400`}
                  alt={card.name}
                  width={600}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint="credit card background"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-between p-4 text-white">
                    <h3 className="text-xl font-bold tracking-tight drop-shadow-md">{card.name}</h3>
                    <p className="text-sm font-light drop-shadow-sm">{card.issuer}</p>
                </div>
                 <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="icon" variant="outline" className="h-12 w-12 rounded-full bg-green-500/80 text-white hover:bg-green-600" onClick={() => handleApprove(card)}>
                        <Check className="h-6 w-6" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-12 w-12 rounded-full bg-red-500/80 text-white hover:bg-red-600" onClick={() => handleReject(card.id, card.name)}>
                        <X className="h-6 w-6" />
                    </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !isLoading && <p className="text-center text-muted-foreground">No pending card suggestions.</p>
        )}
      </CardContent>
    </Card>
  );
}
