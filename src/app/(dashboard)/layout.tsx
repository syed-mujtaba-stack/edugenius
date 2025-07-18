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
  Video,
  School,
  Bot,
  Bell,
  Bookmark,
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
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();


  const handleLogout = async () => {
    router.push('/');
  };

  const menuItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/courses',
      label: 'Video Courses',
      icon: Video,
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
     {
      href: '/ask-ai',
      label: 'AI Tutor',
      icon: Bot,
    },
    {
      href: '/community',
      label: 'Community',
      icon: Users,
    },
     {
      href: '/teacher-dashboard',
      label: 'Teacher Dashboard',
      icon: LayoutDashboard,
    },
    {
        href: '/classroom',
        label: 'My Classroom',
        icon: School,
    },
    {
      href: '/bookmarks',
      label: 'Bookmarks',
      icon: Bookmark,
    },
    {
      href: '/admin-dashboard',
      label: 'Admin Dashboard',
      icon: Shield,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Logo className="w-8 h-8 text-primary" />
                <span className="font-headline text-2xl text-primary">EduGenius</span>
             </div>
             <button className="p-1 rounded-full hover:bg-accent">
                <Bell className="h-5 w-5" />
             </button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
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
