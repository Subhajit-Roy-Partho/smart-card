'use client';
import { Logo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, getDoc, writeBatch } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useState, type SVGProps } from 'react';

// --- Start of Client-Side Seeding Logic ---

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
    imageUrl: 'https://picsum.photos/seed/1/600/400',
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
    imageUrl: 'https://picsum.photos/seed/2/600/400',
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
    imageUrl: 'https://picsum.photos/seed/3/600/400',
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
    imageUrl: 'https://picsum.photos/seed/4/600/400',
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
];

const adminEmails = ['test@example.com', 'me.subhajitroy1999@gmail.com'];

async function seedDatabase(firestore: any, user: User) {
  if (!firestore || !user) return;

  const userDocRef = doc(firestore, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    console.log(`User ${user.uid} already exists. Skipping seed.`);
    return;
  }

  console.log(`Seeding data for new user: ${user.uid}`);
  const batch = writeBatch(firestore);

  try {
    const userLevel =
      user.email && adminEmails.includes(user.email) ? 'admin' : 'standard';

    // 1. Create user profile
    batch.set(userDocRef, {
      id: user.uid,
      email: user.email,
      name: user.displayName || `User ${user.uid.substring(0, 5)}`,
      level: userLevel,
      personalCards: ['card-1', 'card-2'], // Pre-assign some cards
    });

    // 2. Add sample transactions for the user's cards
    const userOwnedCards = ['card-1', 'card-2'];
    userOwnedCards.forEach((cardId) => {
      const cardTransactions = transactions.filter((t) => t.cardId === cardId);
      cardTransactions.forEach((transaction) => {
        const transactionDocRef = doc(
          firestore,
          'users',
          user.uid,
          'credit_cards',
          cardId,
          'transactions',
          transaction.id
        );
        batch.set(transactionDocRef, { ...transaction, userId: user.uid });
      });
    });
    
    // In a real app, you might want to seed global collections like 'credit_cards'
    // and 'categories' here as well, guarded by a marker document to run only once.
    // For this demo, we assume they are seeded or will be managed elsewhere.

    await batch.commit();
    console.log('Database seeded successfully for user!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// --- End of Client-Side Seeding Logic ---


function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width="24px"
      height="24px"
      {...props}
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.901,36.639,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

export default function FirebaseLoginPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);

  const handleAuthSuccess = async (userCredential: UserCredential) => {
    await seedDatabase(firestore, userCredential.user);
    // Use window.location.href for a full page reload to ensure middleware catches the session
    window.location.href = '/dashboard';
  };

  const handleSignUp = async () => {
    setError(null);
    if (!auth) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await handleAuthSuccess(userCredential);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignIn = async () => {
    setError(null);
    if (!auth) return;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Even on sign-in, we call `handleAuthSuccess` which runs `seedDatabase`.
      // The `seedDatabase` function is idempotent and will skip seeding if the user already exists,
      // but will create the DB entry if it's missing for an existing auth user.
      await handleAuthSuccess(userCredential);
    } catch (error: any) {
      // If sign-in fails because the user does not exist, try signing them up.
      // This is a convenience for the demo app.
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        await handleSignUp();
      } else {
        setError(error.message);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    if (!auth) return;
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await handleAuthSuccess(userCredential);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <Logo className="h-10 w-10 text-primary" />
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome to Smart Spend
          </CardTitle>
          <CardDescription>
            Sign in or create an account to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSignIn}>
            Sign In / Sign Up
          </Button>
          <div className="relative w-full">
            <Separator className="absolute left-0 top-1/2 -translate-y-1/2" />
            <span className="relative z-10 mx-auto flex w-fit bg-card px-2 text-xs uppercase text-muted-foreground">
              Or continue with
            </span>
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
          >
            <GoogleIcon className="mr-2 h-5 w-5" />
            Google
          </Button>
          <p className="px-8 text-center text-xs text-muted-foreground">
            Use test@example.com / password, or sign in with Google.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
