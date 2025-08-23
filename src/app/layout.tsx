import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import HydrationWrapper from "@/components/HydrationWrapper";
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/seo/GoogleTagManager";
import { ThemeProvider } from "@/components/theme-provider";

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
      { url: '/icons/icon1-256.png' },
      { url: '/icons/icon1-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/icons/icon1-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icons/icon1-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/icons/icon1-64.png', type: 'image/png', sizes: '64x64' },
      { url: '/icons/icon1-96.png', type: 'image/png', sizes: '96x96' },
      { url: '/icons/icon1-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icons/icon1-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/icons/icon1-180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/icon1-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleTagManager />
        <GoogleTagManagerNoScript />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="EduGenius" />
        <link rel="apple-touch-icon" href="/icons/icon1-180.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon1-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon1-16.png" />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HydrationWrapper>
            {children}
            <Toaster />
          </HydrationWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
