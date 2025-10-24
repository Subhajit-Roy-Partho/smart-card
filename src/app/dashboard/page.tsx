'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { CreditCard, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { useCollection, useFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Card as CardType, Transaction } from '@/lib/definitions';
import { useMemo } from 'react';

export default function DashboardPage() {
  const { firestore, user } = useFirebase();

  const cardsQuery = useMemo(
    () =>
      user
        ? collection(firestore, 'users', user.uid, 'credit_cards')
        : null,
    [firestore, user]
  );
  const { data: cards, isLoading: cardsLoading } =
    useCollection<CardType>(cardsQuery);

  const transactionsQuery = useMemo(() => {
    if (!user || !cards || cards.length === 0) return null;
    // Note: Firestore doesn't support collection group queries with multiple `in` clauses
    // on different fields. A more scalable approach for a real app might involve
    // a single top-level 'transactions' collection with a 'userId' field.
    // For this demo, we'll query the first card's transactions.
    return collection(
      firestore,
      'users',
      user.uid,
      'credit_cards',
      cards[0].id,
      'transactions'
    );
  }, [firestore, user, cards]);

  const { data: transactions, isLoading: transactionsLoading } =
    useCollection<Transaction>(transactionsQuery);

  const {
    totalBalance,
    totalLimit,
    totalSpendingMonth,
    creditUtilization,
    availableCredit,
  } = useMemo(() => {
    if (!cards || cards.length === 0) {
      return {
        totalBalance: 0,
        totalLimit: 0,
        totalSpendingMonth: 0,
        creditUtilization: 0,
        availableCredit: 0,
      };
    }

    const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);
    const totalLimit = cards.reduce(
      (sum, card) => sum + card.creditLimit,
      0
    );
    const creditUtilization =
      totalLimit > 0 ? (totalBalance / totalLimit) * 100 : 0;
    const availableCredit = totalLimit - totalBalance;

    const totalSpendingMonth = (transactions || [])
      .filter((t) => {
        const transactionDate = new Date(t.date);
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return transactionDate.getMonth() === lastMonth.getMonth();
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance,
      totalLimit,
      totalSpendingMonth,
      creditUtilization,
      availableCredit,
    };
  }, [cards, transactions]);

  const isLoading = cardsLoading || transactionsLoading;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalBalance.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Across {cards?.length || 0} cards
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Credit Utilization
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {creditUtilization.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Healthy range is below 30%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Spending
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalSpendingMonth.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Credit Limit
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalLimit.toLocaleString('en-US')}
            </div>
            <p className="text-xs text-muted-foreground">
              Available: ${availableCredit.toLocaleString('en-US')}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              {transactions
                ? `You made ${transactions.length} transactions this month.`
                : 'No transactions to display.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentTransactions transactions={transactions || []} cards={cards || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
