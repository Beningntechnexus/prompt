import { PromptExplorer } from '@/components/prompt-explorer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-primary tracking-tight">Prompt Explorer</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Your ultimate destination for AI prompts
            </p>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <PromptExplorer />
      </main>
      <footer className="bg-card border-t border-border mt-auto py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Prompt Explorer. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
