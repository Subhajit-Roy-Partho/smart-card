'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import {
  BarChart2,
  Bell,
  CreditCard,
  HeartHandshake,
  Lightbulb,
  Settings,
  Target,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

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

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-lg font-semibold">Smart Spend</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
