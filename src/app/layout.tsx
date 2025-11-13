import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Favicon from './icon';
import { ServiceWorkerRegistrar } from '@/components/service-worker-registrar';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'BBprompts',
  description: 'The Ultimate Prompt Library for AI Creators.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <head>
        <Favicon />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased h-full">
        <div className="flex flex-col min-h-screen bg-background text-foreground" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))' }}>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster />
        <ServiceWorkerRegistrar />
        <Script type='text/javascript' src='//pl28043868.effectivegatecpm.com/90/c6/15/90c61544256079a26f9582f56802784b.js' />
      </body>
    </html>
  );
}
