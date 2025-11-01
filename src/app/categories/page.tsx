import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { PromptExplorer } from '@/components/prompt-explorer';

export default function CategoriesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">Explore Categories</h1>
            <p className="mt-4 text-lg text-muted-foreground">
                Find the perfect starting point from over 20 expert-curated categories.
            </p>
        </div>
        <PromptExplorer />
      </main>
      <Footer />
    </div>
  );
}
