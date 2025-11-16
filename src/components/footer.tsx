import { Mail, Send } from 'lucide-react';
import Link from 'next/link';

// A component for the WhatsApp icon, as it's not in lucide-react
const WhatsAppIcon = (props: React.ComponentProps<'svg'>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>
);


export function Footer() {
  return (
    <footer className="border-t border-border/50">
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <Link href="/" className="text-xl font-bold tracking-tight">BBprompts</Link>
                    <p className="text-sm text-muted-foreground mt-1">&copy; {new Date().getFullYear()} All Rights Reserved.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="https://t.me/promptengineerin" target="_blank" aria-label="Telegram" className="text-muted-foreground hover:text-primary transition-colors">
                        <Send className="h-6 w-6" />
                    </Link>
                    <Link href="https://wa.me/234016287938" target="_blank" aria-label="WhatsApp" className="text-muted-foreground hover:text-primary transition-colors">
                        <WhatsAppIcon className="h-6 w-6" />
                    </Link>
                    <Link href="mailto:zikebenign@gmail.com" aria-label="Email" className="text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="h-6 w-6" />
                    </Link>
                </div>
            </div>
        </div>
    </footer>
  );
}
