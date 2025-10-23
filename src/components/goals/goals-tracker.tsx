import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { goals, cards } from '@/lib/data';
import { Target } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';

export function GoalsTracker() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {goals.map((goal) => {
        const card = cards.find((c) => c.id === goal.cardId);
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const daysLeft = differenceInDays(new Date(goal.deadline), new Date());

        return (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                <span>{goal.description}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 font-mono text-sm">
                  <span>${goal.currentAmount.toLocaleString()}</span>
                  <span>${goal.targetAmount.toLocaleString()}</span>
                </div>
                <Progress value={progress} />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>{progress.toFixed(1)}% Complete</span>
                  <span>
                    {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                For your <span className="font-medium text-foreground">{card?.name}</span> card. Deadline: {format(new Date(goal.deadline), 'PPP')}.
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
