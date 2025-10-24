import { Avatar } from '@/components/ui/avatar';
import type { Transaction, Card } from '@/lib/definitions';

interface RecentTransactionsProps {
  transactions: Transaction[];
  cards: Card[];
}

export function RecentTransactions({ transactions, cards }: RecentTransactionsProps) {
  return (
    <div className="space-y-8">
      {transactions.slice(0, 5).map((transaction) => {
        const card = cards.find((c) => c.id === transaction.cardId);
        return (
          <div key={transaction.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <div
                className="h-full w-full rounded-full"
                style={{
                  backgroundColor: card?.color || 'hsl(var(--muted))',
                }}
              />
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                {transaction.outlet}
              </p>
              <p className="text-sm text-muted-foreground">
                {card?.name}
              </p>
            </div>
            <div className="ml-auto font-medium">
              +${transaction.amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        );
      })}
       {transactions.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">No recent transactions.</p>
      )}
    </div>
  );
}
