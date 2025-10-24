import Header from '@/components/layout/header';
import SidebarNav from '@/components/layout/sidebar-nav';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { FirebaseClientProvider } from '@/firebase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authProvider = process.env.AUTH;

  if (authProvider === 'firebase') {
    return (
      <FirebaseClientProvider>
        <SidebarProvider>
          <div className="md:flex">
            <Sidebar variant="inset" collapsible="icon">
              <SidebarNav />
            </Sidebar>
            <div className="flex flex-1 flex-col">
              <Header />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </div>
          </div>
        </SidebarProvider>
      </FirebaseClientProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="md:flex">
        <Sidebar variant="inset" collapsible="icon">
          <SidebarNav />
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
