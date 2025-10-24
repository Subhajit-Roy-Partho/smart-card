import { BalanceDisplay } from '@/components/balances/balance-display';
import { ConsolidationAdvisor } from '@/components/balances/consolidation-advisor';

export default function BalancesPage() {
  return (
    <div className="flex w-full flex-col space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Balance Management</h1>
        <p className="text-muted-foreground">
          Track your balances and get advice on consolidation.
        </p>
      </div>
      <BalanceDisplay />
      <ConsolidationAdvisor />
    </div>
  );
}
