
import { SpendingSuggestions } from '@/components/suggestions/spending-suggestions';

export default function SuggestionsPage() {
  return (
    <div className="flex w-full flex-col space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Spending Suggestions</h1>
        <p className="text-muted-foreground">
          Get personalized advice from our AI to optimize your credit card usage.
        </p>
      </div>
      <SpendingSuggestions />
    </div>
  );
}
