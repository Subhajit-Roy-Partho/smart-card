'use client';

import { CardReview } from '@/components/admin/card-review';
import { useFirebase, useDoc, useMemoFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/definitions';
import { doc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { firestore, user, isUserLoading } = useFirebase();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isProfileLoading } =
    useDoc<UserProfile>(userProfileRef);

  const isLoading = isUserLoading || isProfileLoading;

  useEffect(() => {
    // If loading is finished and user is not an admin, redirect them.
    if (!isLoading && userProfile?.level !== 'admin') {
      router.push('/dashboard');
    }
  }, [isLoading, userProfile, router]);
  
  if (isLoading) {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
  }

  // If the user is confirmed to be an admin, show the content.
  if (userProfile?.level === 'admin') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            Review community submissions and manage application settings.
          </p>
        </div>
        <CardReview />
      </div>
    );
  }
  
  // Render nothing or a placeholder while redirecting
  return null;
}
