'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function Header() {
  return (
    <header className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <Link href="/" className="text-xl font-bold tracking-tight">PromptVerse AI</Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
          <Link href="/submit" className="hover:text-foreground transition-colors">Submit Prompt</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
        </nav>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
