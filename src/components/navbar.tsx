
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu } from 'lucide-react';
import React from 'react';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#features', label: 'Features' },
    { href: '/about', label: 'About' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/docs', label: 'Docs' },
  ];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              EduGenius
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  (pathname === link.href || (pathname ==='/' && link.href.includes('#'))) ? "text-foreground" : "text-foreground/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
         <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                 <Button variant="ghost" className='md:hidden'>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left">
                <div className="p-4">
                     <Link href="/" className="flex items-center space-x-2 mb-8" onClick={() => setOpen(false)}>
                        <Logo className="h-6 w-6" />
                        <span className="font-bold">EduGenius</span>
                    </Link>
                    <nav className="flex flex-col space-y-4">
                         {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "transition-colors hover:text-foreground/80",
                              pathname === link.href ? "text-foreground font-semibold" : "text-foreground/60"
                            )}
                          >
                            {link.label}
                          </Link>
                        ))}
                    </nav>
                </div>
            </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
             <Link href="/" className="flex items-center space-x-2 md:hidden">
                <Logo className="h-6 w-6" />
                <span className="font-bold">EduGenius</span>
             </Link>
          </div>
          <nav className="flex items-center">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
                <Link href="/signup">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
