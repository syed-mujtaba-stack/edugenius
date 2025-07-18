'use client';
import {
  BookText,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquarePlus,
  FileText,
  Shield,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userRole, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const studentMenuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/summarize',
      label: 'Chapter Summarizer',
      icon: BookText,
    },
    {
      href: '/q-and-a',
      label: 'Q&A Generator',
      icon: MessageSquarePlus,
    },
    {
      href: '/test-generator',
      label: 'Test Generator',
      icon: FileText,
    },
  ];

  const teacherMenuItems = [
    {
      href: '/teacher-dashboard',
      label: 'Teacher Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/manage-students',
      label: 'Manage Students',
      icon: Users,
    },
  ];

   const adminMenuItems = [
    {
      href: '/admin-dashboard',
      label: 'Admin Dashboard',
      icon: Shield,
    },
  ];

  const menuItems = userRole === 'teacher' ? teacherMenuItems : userRole === 'admin' ? adminMenuItems : studentMenuItems;

   if (loading || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="text-2xl">Loading...</div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8 text-primary" />
            <span className="font-headline text-2xl text-primary">EduGenius</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
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
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
