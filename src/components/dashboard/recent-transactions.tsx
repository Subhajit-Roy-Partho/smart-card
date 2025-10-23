import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { transactions, cards } from '@/lib/data';

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      {transactions.slice(0, 5).map(transaction => {
        const card = cards.find(c => c.id === transaction.cardId);
        return (
        <div key={transaction.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <div className="w-full h-full rounded-full" style={{ backgroundColor: card?.color || 'hsl(var(--muted))' }} />
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">{card?.name} ({transaction.category})</p>
            </div>
            <div className="ml-auto font-medium">
                +${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>
      )})}
    </div>
  );
}
