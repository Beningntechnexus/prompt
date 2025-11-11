import { PromptExplorer } from '@/components/prompt-explorer';

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">Explore Categories</h1>
          <p className="mt-4 text-lg text-muted-foreground">
              Find the perfect starting point from over 20 expert-curated categories.
          </p>
      </div>
      <PromptExplorer />
    </div>
  );
}
