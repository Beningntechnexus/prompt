import { AdBanner } from '@/components/ad-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Mail, Send, Users } from 'lucide-react';
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
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Button asChild size="lg">
            <Link href="/categories">Search Prompts</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/categories">Explore Categories</Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter">Connect & Collaborate</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
                Join a community of prompt engineers or get in touch for high-quality custom prompts tailored to your needs.
            </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-card/50 hover:border-primary/50 transition-colors">
            <CardHeader className="flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg"><Send className="w-6 h-6 text-primary" /></div>
              <CardTitle className="text-xl">Join Our Telegram</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Get the latest high-quality prompts and insights. Let's lead together!</p>
              <Button asChild className="w-full">
                <Link href="https://t.me/promptengineerin" target="_blank">Join Channel</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-card/50 hover:border-primary/50 transition-colors">
            <CardHeader className="flex-row items-center gap-4">
               <div className="bg-primary/10 p-3 rounded-lg"><Users className="w-6 h-6 text-primary" /></div>
              <CardTitle className="text-xl">Chat on WhatsApp</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">Need a custom prompt? Let's discuss your requirements one-on-one.</p>
              <Button asChild className="w-full">
                <Link href="https://wa.me/234016287938" target="_blank">Chat Now</Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="bg-card/50 hover:border-primary/50 transition-colors lg:col-span-1 md:col-span-2">
            <CardHeader className="flex-row items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg"><Mail className="w-6 h-6 text-primary" /></div>
              <CardTitle className="text-xl">Send an Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">For detailed inquiries and collaboration proposals, feel free to email me.</p>
              <Button asChild className="w-full">
                <Link href="mailto:zikebenign@gmail.com">zikebenign@gmail.com</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdBanner />
    </>
  );
}
