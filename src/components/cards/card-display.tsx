'use client';

import type { Card } from '@/lib/definitions';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface CardDisplayProps {
  card: Card;
  className?: string;
}

export function CardDisplay({ card, className }: CardDisplayProps) {
  return (
    <div
      className={cn(
        'relative flex h-48 w-full flex-col justify-between overflow-hidden rounded-lg p-4 text-white shadow-lg',
        className
      )}
    >
      <Image
        src={card.imageUrl}
        alt={`${card.name} background image`}
        fill
        className="absolute inset-0 z-0 object-cover"
        data-ai-hint="credit card background"
      />
      <div className="absolute inset-0 z-10 bg-black/40" />
      <div className="relative z-20">
        <h3 className="text-xl font-bold tracking-tight">{card.name}</h3>
      </div>
      <div className="relative z-20 flex justify-between">
        <p className="text-sm font-light">{card.issuer}</p>
        <p className="font-mono text-sm tracking-wider">•••• {card.last4}</p>
      </div>
    </div>
  );
}
