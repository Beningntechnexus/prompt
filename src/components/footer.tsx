'use client';
import { useState, useEffect } from 'react';

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="container mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
      &copy; {year} PromptVerse AI. All Rights Reserved.
    </footer>
  );
}
