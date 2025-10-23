import { BalanceDisplay } from '@/components/balances/balance-display';
import { ConsolidationAdvisor } from '@/components/balances/consolidation-advisor';

export default function BalancesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Balance Management</h1>
        <p className="text-muted-foreground">
          Track your balances and get advice on consolidation.
        </p>
      </div>
      <BalanceDisplay />
      <ConsolidationAdvisor />
    </div>
  );
}
