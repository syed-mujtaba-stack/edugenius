
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
  TrendingUp,
  Music4,
  Briefcase,
  Mic,
  FileSignature,
  Cog,
  Clapperboard,
  Code,
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
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { findBestMatch } from 'string-similarity';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

// Extend the Window interface for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | null;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const [user, loading, error] = useAuthState(auth);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchUserRole = async () => {
       setIsRoleLoading(true);
       try {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const role = userDoc.data()?.role;
           // Special override for admin email
          if (user.email === 'abbasmujtaba125@gmail.com' && role === 'admin') {
             setUserRole('admin');
          } else {
             setUserRole(role);
          }
        } else {
          // User exists in Auth but not in Firestore. This is an inconsistent state.
          // For now, we'll log them out and ask them to sign up again.
          toast({ title: "Error", description: "User data not found. Please sign up again.", variant: "destructive" });
          await auth.signOut();
          router.push('/signup');
        }
      } catch (e) {
        console.error("Failed to fetch user role", e);
        toast({ title: "Error", description: "Could not verify user role. Logging out.", variant: "destructive" });
        await auth.signOut();
      } finally {
        setIsRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user, loading, router, toast]);


  const allMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, keywords: ['dashboard', 'home', 'main'], roles: ['student', 'teacher', 'parent', 'admin'] },
    { href: '/learning-path', label: 'Learning Path', icon: TrendingUp, keywords: ['learning path', 'study plan', 'path'], roles: ['student', 'teacher', 'admin'] },
    { href: '/courses', label: 'Video Courses', icon: Video, keywords: ['video courses', 'courses', 'lectures'], roles: ['student', 'teacher', 'parent', 'admin'] },
    { href: '/summarize', label: 'Chapter Summarizer', icon: BookText, keywords: ['summarizer', 'summary', 'chapter'], roles: ['student', 'teacher', 'admin'] },
    { href: '/q-and-a', label: 'Q&A Generator', icon: MessageSquarePlus, keywords: ['q&a', 'questions', 'answers'], roles: ['student', 'teacher', 'admin'] },
    { href: '/test-generator', label: 'Test Generator', icon: FileText, keywords: ['test generator', 'test', 'exam'], roles: ['student', 'teacher', 'admin'] },
    { href: '/essay-evaluator', label: 'Essay Evaluator', icon: FileSignature, keywords: ['essay evaluator', 'essay', 'writing'], roles: ['student', 'teacher', 'admin'] },
    { href: '/ask-ai', label: 'AI Tutor', icon: Bot, keywords: ['ai tutor', 'tutor', 'ask'], roles: ['student', 'teacher', 'parent', 'admin'] },
    { href: '/audio-generator', label: 'Audio Generator', icon: Music4, keywords: ['audio generator', 'audio', 'voice', 'sound'], roles: ['student', 'teacher', 'admin'] },
    { href: '/video-generator', label: 'Video Generator', icon: Clapperboard, keywords: ['video generator', 'video', 'clip'], roles: ['student', 'teacher', 'admin'] },
    { href: '/career-counseling', label: 'Career Counseling', icon: Briefcase, keywords: ['career', 'counseling', 'advice'], roles: ['student', 'teacher', 'admin'] },
    { href: '/community', label: 'Community', icon: Users, keywords: ['community', 'hub', 'discussion'], roles: ['student', 'teacher', 'parent', 'admin'] },
    { href: '/teacher-dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard, keywords: ['teacher dashboard', 'teacher'], roles: ['teacher', 'admin'] },
    { href: '/classroom', label: 'My Classroom', icon: School, keywords: ['classroom', 'class'], roles: ['teacher', 'admin'] },
    { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark, keywords: ['bookmarks', 'saved'], roles: ['student', 'teacher', 'admin'] },
    { href: '/admin-dashboard', label: 'Admin Dashboard', icon: Shield, keywords: ['admin dashboard', 'admin'], roles: ['admin'] },
  ];
  
  const menuItems = allMenuItems.filter(item => {
      if (!userRole) return false;
      return item.roles.includes(userRole);
  });


  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognition.onerror = (event: any) => {
        // Use console.warn for non-critical errors like network issues to avoid error overlay
        console.warn('Speech recognition error:', event.error);
        toast({ title: "MJ Error", description: `Could not understand. Error: ${event.error}`, variant: "destructive" });
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [toast]);
  
  const speak = (text: string, callback?: () => void) => {
      if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.onend = () => {
              if (callback) callback();
          };
          window.speechSynthesis.speak(utterance);
      } else {
          // Fallback if synthesis is not supported
          if (callback) callback();
      }
  }

  const handleVoiceCommand = (command: string) => {
    const allLabelsAndKeywords = menuItems.flatMap(item => [item.label.toLowerCase(), ...item.keywords]);
    const match = findBestMatch(command, allLabelsAndKeywords);
    
    if (match.bestMatch.rating > 0.4) { // Confidence threshold
      const matchedItem = menuItems.find(item => item.label.toLowerCase() === match.bestMatch.target || item.keywords.includes(match.bestMatch.target));
      if (matchedItem) {
          speak(`Ji, I'm opening ${matchedItem.label}.`, () => {
              router.push(matchedItem.href);
          });
          return;
      }
    }

    if (command.includes('logout') || command.includes('sign out')) {
        speak("Logging you out. Goodbye!", handleLogout);
        return;
    }

    speak("I'm sorry, I didn't understand that. Please try again.");
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
        toast({ title: "Voice Assistant Not Supported", description: "Your browser does not support speech recognition.", variant: "destructive" });
        return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        // This can happen if recognition is already active.
        console.warn("Could not start speech recognition", e);
      }
    }
  };


  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  if (loading || isRoleLoading) {
    return (
       <div className="flex h-screen w-full">
        <div className="hidden md:flex h-full w-[16rem] flex-col gap-2 border-r p-2">
            <div className="flex items-center justify-between p-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-7 w-7" />
            </div>
            <div className="flex-grow space-y-2 p-2">
                {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
            <div className="space-y-2 p-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
        <div className="flex-1 p-4">
             <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Logo className="w-8 h-8 text-primary" />
                <span className="font-headline text-2xl text-primary group-data-[collapsible=icon]:hidden">EduGenius</span>
             </div>
             <div className='flex items-center gap-2'>
                <button className="p-1 rounded-full hover:bg-accent md:hidden">
                    <Bell className="h-5 w-5" />
                </button>
                <SidebarTrigger className='md:hidden' />
             </div>
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
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/api-settings'}
                  tooltip="API Settings"
                >
                  <Link href="/api-settings">
                    <Cog />
                    <span>API Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/developer-info'}
                  tooltip="Developer Info"
                >
                  <Link href="/developer-info">
                    <Code />
                    <span>Developer Info</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={toggleListening} tooltip="Voice Assistant" isActive={isListening}>
                  <Mic />
                  <span>{isListening ? 'Listening...' : 'Voice Assistant'}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <div className="flex items-center gap-2">
                <Logo className="w-6 h-6 text-primary" />
                <span className="font-headline text-xl text-primary">EduGenius</span>
            </div>
             <div className='flex items-center gap-2'>
                <button className="p-1 rounded-full hover:bg-accent">
                    <Bell className="h-5 w-5" />
                </button>
                <SidebarTrigger />
             </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

    