// A script to seed the database with initial data.
// This is for demo purposes and would be replaced with real data in a production environment.
'use server';
import { initializeFirebase } from '@/firebase';
import {
  collection,
  doc,
  writeBatch,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';

const cards = [
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
    balance: 87.9,
    creditLimit: 3000,
    apr: 22.5,
    paymentDueDate: '2024-08-25',
    color: 'hsl(var(--chart-3))',
  },
  {
    id: 'card-4',
    name: 'Business Pro',
    issuer: 'Enterprise Bank',
    last4: '3456',
    balance: 4899.2,
    creditLimit: 15000,
    apr: 12.99,
    paymentDueDate: '2024-09-01',
    color: 'hsl(var(--chart-4))',
  },
];

const transactions = [
  {
    id: 'txn-1',
    creditCardId: 'card-1',
    amount: 799.99,
    outlet: 'Apple Store',
    categoryId: 'electronics',
    date: '2024-07-20T10:00:00Z',
  },
  {
    id: 'txn-2',
    creditCardId: 'card-2',
    amount: 120.5,
    outlet: 'United Airlines',
    categoryId: 'travel',
    date: '2024-07-18T14:30:00Z',
  },
  {
    id: 'txn-3',
    creditCardId: 'card-3',
    amount: 45.67,
    outlet: 'Whole Foods',
    categoryId: 'groceries',
    date: '2024-07-22T18:05:00Z',
  },
  {
    id: 'txn-4',
    creditCardId: 'card-1',
    amount: 89.0,
    outlet: 'Adobe Creative Cloud',
    categoryId: 'software',
    date: '2024-07-21T11:20:00Z',
  },
  {
    id: 'txn-5',
    creditCardId: 'card-4',
    amount: 150.0,
    outlet: 'Staples',
    categoryId: 'business',
    date: '2024-07-19T09:45:00Z',
  },
];

const categories = [
    { id: 'electronics', name: 'Electronics', description: 'Gadgets and devices.' },
    { id: 'travel', name: 'Travel', description: 'Flights, hotels, and transportation.' },
    { id: 'groceries', name: 'Groceries', description: 'Food and household supplies.' },
    { id: 'software', name: 'Software', description: 'Subscriptions and licenses.' },
    { id: 'business', name: 'Business', description: 'Office supplies and expenses.' },
];

export async function seedDatabase(userId: string) {
  const { firestore } = initializeFirebase();
  const batch = writeBatch(firestore);

  try {
    // Check if user already has data
    const userCardsRef = collection(firestore, 'users', userId, 'credit_cards');
    const existingCards: QuerySnapshot<DocumentData> = await getDocs(userCardsRef);
    if (!existingCards.empty) {
      console.log('User already has data. Skipping seed.');
      return { success: true, message: 'User already has data.' };
    }

    console.log(`Seeding data for user: ${userId}`);

    // Seed Categories (globally)
    const categoriesRef = collection(firestore, 'categories');
    categories.forEach((category) => {
        const categoryDoc = doc(categoriesRef, category.id);
        batch.set(categoryDoc, category);
    });
    console.log('Seeding categories...');


    // Seed Credit Cards for the user
    cards.forEach((card) => {
      const cardDoc = doc(userCardsRef, card.id);
      batch.set(cardDoc, card);

      // Seed Transactions for each card
      const cardTransactions = transactions.filter(
        (t) => t.creditCardId === card.id
      );
      const transactionsRef = collection(cardDoc, 'transactions');
      cardTransactions.forEach((transaction) => {
        const transactionDoc = doc(transactionsRef, transaction.id);
        batch.set(transactionDoc, transaction);
      });
    });
    console.log('Seeding cards and transactions...');

    await batch.commit();
    console.log('Database seeded successfully!');
    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: `Error seeding database: ${error}` };
  }
}
