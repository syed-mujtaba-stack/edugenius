
'use client';
import {
  BookText,
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
  Code,
  BookCopy,
  User,
  Gamepad2,
  BookPlus,
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
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { findBestMatch } from 'string-similarity';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateAudioFromText } from '@/ai/flows/generate-audio-from-text';

// Extend the Window interface for webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

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
  // We need a local state for user to force re-renders on profile updates
  const [currentUser, setCurrentUser] = useState(user);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = () => {
      const storedKey = localStorage.getItem('user-gemini-api-key');
      setApiKey(storedKey);
    };

    fetchApiKey();
    window.addEventListener('apiKeyUpdated', fetchApiKey);

    return () => {
      window.removeEventListener('apiKeyUpdated', fetchApiKey);
    };
  }, []);

  useEffect(() => {
    setCurrentUser(user);
    const handleProfileUpdate = () => {
        if (auth.currentUser) {
            setCurrentUser({...auth.currentUser});
        }
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, [user]);

  useEffect(() => {
    if (loading) return;
    if (error) {
      console.error('Firebase Auth Error:', error);
      toast({
        title: "Authentication Error",
        description: "Could not connect to authentication service. Please refresh the page.",
        variant: "destructive"
      });
    }
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, error, router, toast]);


 const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, keywords: ['dashboard', 'home', 'main'] },
    { href: '/profile', label: 'My Profile', icon: User, keywords: ['profile', 'account', 'my profile'] },
    { href: '/learning-path', label: 'Learning Path', icon: TrendingUp, keywords: ['learning path', 'study plan', 'path'] },
    { href: '/courses', label: 'Video Courses', icon: Video, keywords: ['video courses', 'courses', 'lectures'] },
    { href: '/summarize', label: 'Chapter Summarizer', icon: BookText, keywords: ['summarizer', 'summary', 'chapter'] },
    { href: '/q-and-a', label: 'Q&A Generator', icon: MessageSquarePlus, keywords: ['q&a', 'questions', 'answers'] },
    { href: '/test-generator', label: 'Test Generator', icon: FileText, keywords: ['test generator', 'test', 'exam'] },
    { href: '/essay-evaluator', label: 'Essay Evaluator', icon: FileSignature, keywords: ['essay evaluator', 'essay', 'writing'] },
    { href: '/ask-ai', label: 'AI Tutor', icon: Bot, keywords: ['ai tutor', 'tutor', 'ask'] },
    { href: '/audio-generator', label: 'Audio Generator', icon: Music4, keywords: ['audio generator', 'audio', 'voice', 'sound'] },
    { href: '/book-generator', label: 'AI Book Generator', icon: BookPlus, keywords: ['book generator', 'book', 'write book'] },
    { href: '/video-generator', label: 'Video Generator', icon: Video, keywords: ['video generator', 'video', 'create video'] },
    { href: '/career-counseling', label: 'Career Counseling', icon: Briefcase, keywords: ['career', 'counseling', 'advice'] },
    { href: '/community', label: 'Community', icon: Users, keywords: ['community', 'hub', 'discussion'] },
    { href: '/lesson-planner', label: 'Lesson Planner', icon: BookCopy, keywords: ['lesson planner', 'teacher tool', 'plan'] },
    { href: '/teacher-dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard, keywords: ['teacher dashboard', 'teacher'] },
    { href: '/classroom', label: 'My Classroom', icon: School, keywords: ['classroom', 'class'] },
    { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark, keywords: ['bookmarks', 'saved'] },
    { href: '/playground', label: 'Playground', icon: Gamepad2, keywords: ['playground', 'games', 'quiz game'] },
    { href: '/admin-dashboard', label: 'Admin Dashboard', icon: Shield, keywords: ['admin dashboard', 'admin'] },
  ];
  
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.lang = 'ur-PK';
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        toast({ title: "MJ Error", description: `Could not understand. Error: ${event.error}`, variant: "destructive" });
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [toast]);
  
  const speak = async (text: string, callback?: () => void) => {
      if ('speechSynthesis' in window) {
          try {
              const { media } = await generateAudioFromText({ text, apiKey: apiKey || undefined });
              const audio = new Audio(media);
              audio.play();
              audio.onended = () => {
                 if (callback) callback();
              };
          } catch (error) {
              console.error("Error generating speech:", error);
              // Fallback to browser's default voice if AI fails
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = "ur-PK";
              utterance.onend = () => {
                  if (callback) callback();
              };
              window.speechSynthesis.speak(utterance);
          }
      } else {
          if (callback) callback();
      }
  }

  const handleVoiceCommand = (command: string) => {
    // Basic language detection
    const isUrdu = /[ہ-ے]/.test(command);
    
    const allLabelsAndKeywords = menuItems.flatMap(item => [item.label.toLowerCase(), ...item.keywords]);
    const { bestMatch } = findBestMatch(command, allLabelsAndKeywords);
    
    if (bestMatch.rating > 0.4) { // Confidence threshold
      const matchedItem = menuItems.find(item => item.label.toLowerCase() === bestMatch.target || item.keywords.includes(bestMatch.target));
      if (matchedItem) {
          const responseText = isUrdu ? `جی، ${matchedItem.label} کھول رہا ہوں۔` : `Opening ${matchedItem.label}.`;
          speak(responseText, () => {
              router.push(matchedItem.href);
          });
          return;
      }
    }

    if (command.includes('logout') || command.includes('sign out')) {
        const responseText = isUrdu ? "لاگ آؤٹ کر رہا ہوں۔ خدا حافظ!" : "Logging you out. Goodbye!";
        speak(responseText, handleLogout);
        return;
    }

    const responseText = isUrdu ? "معافی چاہتا ہوں، میں سمجھ نہیں سکا۔ براہِ مہربانی دوبارہ کوشش کریں۔" : "I'm sorry, I didn't understand that. Please try again.";
    speak(responseText);
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
        console.warn("Could not start speech recognition", e);
      }
    }
  };


  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };
  
  if (loading || !currentUser) {
    return (
       <div className="flex h-screen w-full bg-background">
        <div className="hidden md:flex h-full w-[16rem] flex-col gap-2 border-r bg-card p-2">
            <div className="flex items-center justify-between p-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-7 w-7" />
            </div>
            <div className="flex-grow space-y-2 p-2">
                {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
            </div>
            <div className="space-y-2 p-2 mt-auto">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
        <main className="flex-1 p-4">
             <Skeleton className="h-full w-full rounded-lg" />
        </main>
      </div>
    );
  }
  
  const aiAgentItems = [
    { href: '/ask-ai', label: 'AI Tutor', icon: Bot },
    { href: '/summarize', label: 'Chapter Summarizer', icon: BookText },
    { href: '/q-and-a', label: 'Q&A Generator', icon: MessageSquarePlus },
    { href: '/test-generator', label: 'Test Generator', icon: FileText },
    { href: '/essay-evaluator', label: 'Essay Evaluator', icon: FileSignature },
    { href: '/learning-path', label: 'Learning Path', icon: TrendingUp },
    { href: '/career-counseling', label: 'Career Counseling', icon: Briefcase },
    { href: '/book-generator', label: 'AI Book Generator', icon: BookPlus },
  ];

  const learningToolsItems = [
    { href: '/courses', label: 'Video Courses', icon: Video },
    { href: '/audio-generator', label: 'Audio Generator', icon: Music4 },
    { href: '/video-generator', label: 'Video Generator', icon: Video },
    { href: '/community', label: 'Community', icon: Users },
    { href: '/playground', label: 'Playground', icon: Gamepad2 },
    { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  ];

  const teachersCornerItems = [
    { href: '/lesson-planner', label: 'Lesson Planner', icon: BookCopy },
    { href: '/teacher-dashboard', label: 'Teacher Dashboard', icon: LayoutDashboard },
    { href: '/classroom', label: 'My Classroom', icon: School },
  ];

  const adminItems = [
    { href: '/admin-dashboard', label: 'Admin Dashboard', icon: Shield },
  ];

  const renderMenuItems = (items: typeof aiAgentItems) => {
    return items.map((item) => (
         <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    ));
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
                <SidebarTrigger className='hidden group-data-[collapsible=icon]:flex' />
             </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === '/dashboard'} tooltip="Dashboard">
                        <Link href="/dashboard"><LayoutDashboard /><span>Dashboard</span></Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            
            <SidebarGroup>
                <SidebarGroupLabel>AI Agents</SidebarGroupLabel>
                <SidebarMenu>{renderMenuItems(aiAgentItems)}</SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Learning Tools</SidebarGroupLabel>
                <SidebarMenu>{renderMenuItems(learningToolsItems)}</SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Teacher's Corner</SidebarGroupLabel>
                <SidebarMenu>{renderMenuItems(teachersCornerItems)}</SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Admin</SidebarGroupLabel>
                <SidebarMenu>{renderMenuItems(adminItems)}</SidebarMenu>
            </SidebarGroup>

        </SidebarContent>
        <SidebarFooter>
         <SidebarSeparator />
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/profile'}
                  tooltip="My Profile"
                >
                  <Link href="/profile" className="justify-start">
                     <Avatar className="h-7 w-7">
                        <AvatarImage src={currentUser.photoURL || ''} alt={currentUser.displayName || ''} data-ai-hint="person avatar" />
                        <AvatarFallback>
                            {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U')}
                        </AvatarFallback>
                    </Avatar>
                    <span className="truncate">{currentUser.displayName || currentUser.email}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
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
