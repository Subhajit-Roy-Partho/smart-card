'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import {
  BarChart2,
  Bell,
  CreditCard,
  Library,
  Lightbulb,
  Shield,
  Target,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { useFirebase } from '@/firebase';
import { useDoc, useMemoFirebase } from '@/firebase';
import type { UserProfile } from '@/lib/definitions';
import { doc } from 'firebase/firestore';

const menuItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: BarChart2,
  },
  {
    href: '/dashboard/cards',
    label: 'Card Suggestions',
    icon: CreditCard,
  },
  {
    href: '/dashboard/all-cards',
    label: 'All Cards',
    icon: Library,
  },
  {
    href: '/dashboard/balances',
    label: 'Balances',
    icon: Wallet,
  },
  {
    href: '/dashboard/suggestions',
    label: 'AI Suggestions',
    icon: Lightbulb,
  },
  {
    href: '/dashboard/goals',
    label: 'Goals',
    icon: Target,
  },
  {
    href: '/dashboard/reminders',
    label: 'Reminders',
    icon: Bell,
  },
];

const adminMenuItem = {
  href: '/dashboard/admin',
  label: 'Admin',
  icon: Shield,
};

export default function SidebarNav() {
  const pathname = usePathname();
  const { firestore, user } = useFirebase();

  const userProfileRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);
  const isAdmin = userProfile?.level === 'admin';

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-sidebar-primary" />
          <span className="text-lg font-semibold text-chart-3">
            Smart Spend
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          {isProfileLoading ? (
            <SidebarMenuSkeleton showIcon />
          ) : (
            isAdmin && (
              <SidebarMenuItem>
                <Link href={adminMenuItem.href}>
                  <SidebarMenuButton
                    isActive={pathname === adminMenuItem.href}
                    tooltip={adminMenuItem.label}
                  >
                    <adminMenuItem.icon />
                    <span>{adminMenuItem.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
