
import { OutletCardSuggestion } from '@/components/cards/outlet-card-suggestion';
import { CommunityCardSuggestion } from '@/components/cards/community-card-suggestion';

export default function CardsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Card Suggestions</h1>
        <p className="text-muted-foreground">
          Tools to help you choose the best card and contribute to our community.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <OutletCardSuggestion />
        <CommunityCardSuggestion />
      </div>
    </div>
  );
}
