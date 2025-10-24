import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { getSession } from '@auth0/nextjs-auth0/edge';

const mockUser = {
  name: 'Test User',
  email: 'test@example.com',
  picture: 'https://picsum.photos/seed/test-user/100/100',
};

export async function UserNav() {
  let user;

  if (process.env.TEST === '1') {
    user = mockUser;
  } else {
    const session = await getSession();
    if (!session) return null;
    user = session.user;
  }
  
  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {user.picture && <AvatarImage src={user.picture} alt={user.name || 'User avatar'} />}
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
             <a href={process.env.TEST === '1' ? '#' : "/api/auth/logout"} className="w-full text-left">Log out</a>
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
