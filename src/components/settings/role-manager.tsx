
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/definitions';
import { doc, updateDoc } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

export function RoleManager() {
  const { firestore, user } = useFirebase();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isLoadingUserProfile } =
    useDoc<UserProfile>(userProfileRef);

  const handleRoleChange = async (newRole: string) => {
    if (!userProfileRef) return;
    try {
      await updateDoc(userProfileRef, {
        level: newRole,
      });
      toast({
        title: 'Role Updated',
        description: `Your role has been changed to ${newRole}.`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update your role.',
      });
    }
  };

  const roles: UserProfile['level'][] = ['standard', 'admin', 'outsider'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Management</CardTitle>
        <CardDescription>
          Change your user role. This will affect your permissions across the
          app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingUserProfile ? (
          <div className="space-y-2">
            <Label htmlFor="role-select">User Role</Label>
            <Skeleton className="h-10 w-[240px]" />
          </div>
        ) : (
          userProfile && (
            <div className="space-y-2">
              <Label htmlFor="role-select">User Role</Label>
              <Select
                value={userProfile.level}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger id="role-select" className="w-[240px]">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}
