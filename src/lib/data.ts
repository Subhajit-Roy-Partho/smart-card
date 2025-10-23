import type { Card, Transaction, Goal, Reminder } from './definitions';

export const cards: Card[] = [
  {
    id: 'card-1',
    name: 'Tech Rewards',
    issuer: 'FinBank',
    last4: '1234',
    balance: 1250.75,
    creditLimit: 5000,
    apr: 18.99,
    paymentDueDate: '2024-08-15',
    color: 'hsl(var(--chart-1))',
  },
  {
    id: 'card-2',
    name: 'Travel Points Plus',
    issuer: 'Global Union',
    last4: '5678',
    balance: 342.11,
    creditLimit: 10000,
    apr: 15.49,
    paymentDueDate: '2024-08-20',
    color: 'hsl(var(--chart-2))',
  },
  {
    id: 'card-3',
    name: 'Everyday Cash',
    issuer: 'Capital Trust',
    last4: '9012',
    balance: 87.90,
    creditLimit: 3000,
    apr: 22.50,
    paymentDueDate: '2024-08-25',
    color: 'hsl(var(--chart-3))',
  },
  {
    id: 'card-4',
    name: 'Business Pro',
    issuer: 'Enterprise Bank',
    last4: '3456',
    balance: 4899.20,
    creditLimit: 15000,
    apr: 12.99,
    paymentDueDate: '2024-09-01',
    color: 'hsl(var(--chart-4))',
  },
];

export const transactions: Transaction[] = [
  { id: 'txn-1', cardId: 'card-1', amount: 799.99, description: 'New Laptop', category: 'Electronics', date: '2024-07-20' },
  { id: 'txn-2', cardId: 'card-2', amount: 120.50, description: 'Flight to SFO', category: 'Travel', date: '2024-07-18' },
  { id: 'txn-3', cardId: 'card-3', amount: 45.67, description: 'Groceries', category: 'Food', date: '2024-07-22' },
  { id: 'txn-4', cardId: 'card-1', amount: 89.00, description: 'Software Subscription', category: 'Software', date: '2024-07-21' },
  { id: 'txn-5', cardId: 'card-4', amount: 150.00, description: 'Office Supplies', category: 'Business', date: '2024-07-19' },
  { id: 'txn-6', cardId: 'card-3', amount: 12.34, description: 'Coffee Shop', category: 'Food', date: '2024-07-23' },
  { id: 'txn-7', cardId: 'card-2', amount: 250.00, description: 'Hotel Stay', category: 'Travel', date: '2024-07-20' },
  { id: 'txn-8', cardId: 'card-1', amount: 25.00, description: 'Ride Share', category: 'Transport', date: '2024-07-22' },
];

export const goals: Goal[] = [
  {
    id: 'goal-1',
    cardId: 'card-2',
    description: 'Welcome Bonus: Spend $3,000 in 3 months',
    targetAmount: 3000,
    currentAmount: 1845.50,
    deadline: '2024-09-30',
  },
  {
    id: 'goal-2',
    cardId: 'card-1',
    description: 'Tier Upgrade: Spend $5,000 in a year',
    targetAmount: 5000,
    currentAmount: 4120.75,
    deadline: '2024-12-31',
  },
];

export const reminders: Reminder[] = [
    {
        id: 'rem-1',
        cardId: 'card-1',
        title: 'Payment Due for Tech Rewards',
        dueDate: '2024-08-15',
    },
    {
        id: 'rem-2',
        cardId: 'card-2',
        title: 'Payment Due for Travel Points Plus',
        dueDate: '2024-08-20',
    },
    {
        id: 'rem-3',
        cardId: 'card-3',
        title: 'Payment Due for Everyday Cash',
        dueDate: '2024-08-25',
    },
     {
        id: 'rem-4',
        cardId: 'card-4',
        title: 'Payment Due for Business Pro',
        dueDate: '2024-09-01',
    },
]
