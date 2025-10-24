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
import { useAuth } from '@/firebase';
import { seedDatabase } from '@/lib/seed';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FirebaseLoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);

  const handleAuthSuccess = async (userCredential: UserCredential) => {
    // Seed database for the new or existing user
    await seedDatabase(userCredential.user.uid);
    router.push('/dashboard');
  };

  const handleSignUp = async () => {
    setError(null);
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
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await handleAuthSuccess(userCredential);
    } catch (error: any) {
      // If user doesn't exist or credential is wrong, just sign them up.
      // This is a convenience for the demo app.
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        await handleSignUp();
      } else {
        setError(error.message);
      }
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
            Sign in with your Firebase account to continue.
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
          <p className="text-xs text-muted-foreground">
            Use test@example.com / password, or any other email.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
