import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import HydrationWrapper from "@/components/HydrationWrapper";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:9002"),
  title: {
    default: "EduGenius - Your AI-Powered Learning Co-Pilot",
    template: "%s | EduGenius",
  },
  description: "EduGenius is an AI-driven educational platform offering personalized learning paths, AI tutors, test generation, essay evaluation, and career counseling to help students in Pakistan unlock their potential.",
  keywords: ["AI education", "Pakistan", "e-learning", "study help", "test generator", "career counseling", "personalized learning", "Matric", "Intermediate"],
  openGraph: {
    title: "EduGenius - Your AI-Powered Learning Co-Pilot",
    description: "Unlock your learning potential with AI-powered tools for Pakistani students.",
    url: "/",
    siteName: "EduGenius",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'}/app.png`,
        width: 1200,
        height: 630,
        alt: 'EduGenius AI Learning Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduGenius - Your AI-Powered Learning Co-Pilot',
    description: 'Unlock your learning potential with AI-powered tools for Pakistani students.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'}/app.png`],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '48x48' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  verification: {
    google: "1fO9SPiqvxF11Mi7u2hIHqTyXyghUVqj6xjCx0svCqM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark")} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon1-192.png" />
      </head>
      <body className={cn("font-body antialiased", "min-h-screen bg-background")} suppressHydrationWarning>
        <HydrationWrapper>
          {children}
          <Toaster />
        </HydrationWrapper>
      </body>
    </html>
  );
}
