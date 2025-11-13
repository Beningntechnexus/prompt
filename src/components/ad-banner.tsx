import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function AdBanner() {
  // IMPORTANT: Replace this placeholder with your actual Adsterra direct link.
  const adsterraDirectLink = "https://example.com/your-adsterra-direct-link";

  return (
    <div className="container mx-auto px-4 mt-12">
      <Link href={adsterraDirectLink} target="_blank" rel="noopener noreferrer" className="block w-full max-w-2xl mx-auto">
        <div className="relative overflow-hidden rounded-lg bg-primary/10 p-6 text-center shadow-sm transition-transform duration-300 hover:scale-[1.02] hover:shadow-primary/20">
            <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-primary/20 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-2 h-24 w-24 rounded-full bg-primary/10"></div>
          <div className="relative">
            <h3 className="text-xl font-bold tracking-tight text-primary-foreground">
              ✨ Discover Something New!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Check out exclusive content and special offers from our partners. Your next favorite thing is just a click away!
            </p>
            <div className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
              Click to Explore <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
