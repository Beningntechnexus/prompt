import { PromptExplorer } from '@/components/prompt-explorer';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight">
          The Ultimate Prompt Library <br /> for AI Creators
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          20+ Expert Categories - 100+ Curated Prompts - 100% Free
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/categories">Search Prompts</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/categories">Explore Categories</Link>
          </Button>
        </div>
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} PromptVerse AI. All Rights Reserved.
      </footer>
    </div>
  );
}
