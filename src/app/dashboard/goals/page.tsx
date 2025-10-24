
import { GoalsTracker } from '@/components/goals/goals-tracker';

export default function GoalsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Goal Tracker</h1>
        <p className="text-muted-foreground">
          Monitor your progress towards unlocking valuable card benefits.
        </p>
      </div>
      <GoalsTracker />
    </div>
  );
}
