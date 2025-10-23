import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { reminders, cards } from '@/lib/data';
import { differenceInDays, format, isPast } from 'date-fns';
import { AlertCircle, CheckCircle, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PaymentAlerts() {
  const sortedReminders = [...reminders].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="divide-y divide-border">
          {sortedReminders.map((reminder) => {
            const card = cards.find((c) => c.id === reminder.cardId);
            const dueDate = new Date(reminder.dueDate);
            const daysLeft = differenceInDays(dueDate, new Date());
            const isOverdue = isPast(dueDate) && daysLeft < 0;

            let statusIcon;
            let statusColor;

            if (isOverdue) {
              statusIcon = <AlertCircle className="h-5 w-5 text-destructive" />;
              statusColor = 'text-destructive';
            } else if (daysLeft <= 7) {
              statusIcon = <AlertCircle className="h-5 w-5 text-yellow-500" />;
              statusColor = 'text-yellow-600 dark:text-yellow-400';
            } else {
              statusIcon = <Bell className="h-5 w-5 text-muted-foreground" />;
              statusColor = 'text-muted-foreground';
            }

            return (
              <li key={reminder.id} className="flex items-center justify-between p-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  {statusIcon}
                  <div>
                    <p className="font-medium">{reminder.title}</p>
                    <p className={cn("text-sm", statusColor)}>
                      Due: {format(dueDate, 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className={cn("text-right font-medium", statusColor)}>
                  {isOverdue
                    ? `Overdue by ${Math.abs(daysLeft)} day(s)`
                    : `${daysLeft} day(s) left`}
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
