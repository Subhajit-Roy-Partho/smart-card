import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cards } from '@/lib/data';

export function BalanceDisplay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Balances</CardTitle>
        <CardDescription>
          An overview of your current credit card balances and utilization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {cards.map((card) => {
          const utilization = (card.balance / card.creditLimit) * 100;
          return (
            <div key={card.id}>
              <div className="flex justify-between mb-1">
                <span className="font-medium">{card.name} ({card.last4})</span>
                <span className="text-muted-foreground">
                  ${card.balance.toLocaleString()} / ${card.creditLimit.toLocaleString()}
                </span>
              </div>
              <Progress value={utilization} />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">APR: {card.apr}%</span>
                <span className="text-xs font-medium">{utilization.toFixed(1)}% Used</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
