import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ResumeForge AI - Build a resume that gets noticed',
  description: 'Create an ATS-friendly resume, tailor it to every job, and improve your application with AI-powered recommendations.',
  keywords: ['resume builder', 'ATS friendly', 'AI resume', 'resume maker', 'job application'],
  openGraph: {
    title: 'ResumeForge AI - Build a resume that gets noticed',
    description: 'Create an ATS-friendly resume, tailor it to every job, and improve your application with AI-powered recommendations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
