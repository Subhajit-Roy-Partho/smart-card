import { PaymentAlerts } from '@/components/reminders/payment-alerts';

export default function RemindersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Payment Reminders</h1>
        <p className="text-muted-foreground">
          Stay on top of your payment due dates to avoid late fees.
        </p>
      </div>
      <PaymentAlerts />
    </div>
  );
}
