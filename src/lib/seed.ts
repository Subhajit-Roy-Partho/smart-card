
'use server';

import { initializeFirebaseAdmin } from '@/firebase/server-init';
import {
  WriteBatch,
} from 'firebase-admin/firestore';

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
    cardId: 'card-1',
    amount: 799.99,
    outlet: 'Apple Store',
    categoryId: 'electronics',
    date: '2024-07-20T10:00:00Z',
  },
  {
    id: 'txn-2',
    cardId: 'card-2',
    amount: 120.5,
    outlet: 'United Airlines',
    categoryId: 'travel',
    date: '2024-07-18T14:30:00Z',
  },
  {
    id: 'txn-3',
    cardId: 'card-3',
    amount: 45.67,
    outlet: 'Whole Foods',
    categoryId: 'groceries',
    date: '2024-07-22T18:05:00Z',
  },
  {
    id: 'txn-4',
    cardId: 'card-1',
    amount: 89.0,
    outlet: 'Adobe Creative Cloud',
    categoryId: 'software',
    date: '2024-07-21T11:20:00Z',
  },
  {
    id: 'txn-5',
    cardId: 'card-4',
    amount: 150.0,
    outlet: 'Staples',
    categoryId: 'business',
    date: '2024-07-19T09:45:00Z',
  },
];

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Gadgets and devices.',
  },
  { id: 'travel', name: 'Travel', description: 'Flights, hotels, and transportation.' },
  {
    id: 'groceries',
    name: 'Groceries',
    description: 'Food and household supplies.',
  },
  {
    id: 'software',
    name: 'Software',
    description: 'Subscriptions and licenses.',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Office supplies and expenses.',
  },
];

const adminEmails = ['test@example.com', 'me.subhajitroy1999@gmail.com'];

async function seedGlobalData(batch: WriteBatch, firestore: FirebaseFirestore.Firestore) {
    // Seed Global Cards
    const cardsRef = firestore.collection('credit_cards');
    for (const card of cards) {
        const cardDoc = cardsRef.doc(card.id);
        const docSnapshot = await cardDoc.get();
        if (!docSnapshot.exists) {
            batch.set(cardDoc, card);
        }
    }

    // Seed Categories (globally)
    const categoriesRef = firestore.collection('categories');
    for (const category of categories) {
        const categoryDoc = categoriesRef.doc(category.id);
        const docSnapshot = await categoryDoc.get();
        if (!docSnapshot.exists) {
            batch.set(categoryDoc, category);
        }
    }
}


export async function seedDatabase(userId: string, email: string | null) {
  const { firestore } = await initializeFirebaseAdmin();
  const batch: WriteBatch = firestore.batch();

  try {
    // Check if the global data has been seeded
    const globalSeedMarkerRef = firestore.doc('system/seed_marker');
    const globalSeedMarkerDoc = await globalSeedMarkerRef.get();

    if (!globalSeedMarkerDoc.exists) {
        console.log('Seeding global data (cards, categories)...');
        await seedGlobalData(batch, firestore);
        batch.set(globalSeedMarkerRef, { seeded: true, timestamp: new Date() });
    }

    // Check if the user has been seeded
    const userDocRef = firestore.doc(`users/${userId}`);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
        console.log(`User ${userId} already exists. Skipping user seed.`);
    } else {
        console.log(`Seeding data for new user: ${userId}`);
        const userLevel = email && adminEmails.includes(email) ? 'admin' : 'standard';

        // Create user profile
        batch.set(userDocRef, {
            id: userId,
            email: email || `user-${userId}@example.com`,
            name: `User ${userId}`, // Placeholder
            level: userLevel,
            personalCards: [],
        });

        // Seed transactions for the user (as a subcollection of their owned cards)
        // For this demo, let's assume they own the first two cards.
        const userOwnedCards = ['card-1', 'card-2'];
        userOwnedCards.forEach(cardId => {
            const cardTransactions = transactions.filter(t => t.cardId === cardId);
            const transactionsRef = userDocRef.collection('credit_cards').doc(cardId).collection('transactions');
            cardTransactions.forEach(transaction => {
                const transactionDoc = transactionsRef.doc(transaction.id);
                batch.set(transactionDoc, {...transaction, userId: userId});
            });
        });
    }

    await batch.commit();
    console.log('Database seeded successfully!');
    return { success: true, message: 'Database seeded successfully!' };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, message: `Error seeding database: ${error instanceof Error ? error.message : String(error)}` };
  }
}
