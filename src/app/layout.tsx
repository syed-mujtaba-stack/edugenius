import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Roboto, Anton } from 'next/font/google';

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
});

const anton = Anton({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-anton',
  weight: '400',
});


export const metadata: Metadata = {
  title: {
    default: "EduGenius - Your AI-Powered Learning Co-Pilot",
    template: "%s | EduGenius",
  },
  description: "EduGenius is an AI-driven educational platform offering personalized learning paths, AI tutors, test generation, essay evaluation, and career counseling to help students in Pakistan unlock their potential.",
  keywords: ["AI education", "Pakistan", "e-learning", "study help", "test generator", "career counseling", "personalized learning", "Matric", "Intermediate"],
  openGraph: {
    title: "EduGenius - Your AI-Powered Learning Co-Pilot",
    description: "Unlock your learning potential with AI-powered tools for Pakistani students.",
    url: "https://edugenius.app", // Replace with your actual domain
    siteName: "EduGenius",
    images: [
      {
        url: 'https://edugenius.app/og-image.png', // Replace with your actual OG image URL
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
     images: ['https://edugenius.app/og-image.png'], // Replace with your actual OG image URL
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
    <html lang="en" className={cn("dark", roboto.variable, anton.variable)}>
      <head />
      <body className={cn("font-body antialiased", "min-h-screen bg-background")}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
