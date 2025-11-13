import { AdBanner } from '@/components/ad-banner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
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
      </div>
      <AdBanner />
    </>
  );
}
