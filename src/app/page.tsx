import { PromptExplorer } from '@/components/prompt-explorer';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <h1 className="text-xl font-bold tracking-tight">PromptVerse AI</h1>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Home</a>
            <a href="#" className="hover:text-foreground transition-colors">Categories</a>
            <a href="#" className="hover:text-foreground transition-colors">Submit Prompt</a>
            <a href="#" className="hover:text-foreground transition-colors">About</a>
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
          <Button size="lg">Search Prompts</Button>
          <Button size="lg" variant="outline">Explore Categories</Button>
        </div>
        <div className="mt-20">
          <PromptExplorer />
        </div>
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} PromptVerse AI. All Rights Reserved.
      </footer>
    </div>
  );
}
