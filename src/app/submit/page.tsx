'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Category } from '@/lib/types';

export default function SubmitPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [promptText, setPromptText] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (data) {
        setCategories(data);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !promptText || !categoryId) {
        toast({
            variant: "destructive",
            title: "Missing fields",
            description: "Please fill out all fields before submitting.",
        });
        return;
    }
    setIsSubmitting(true);
    try {
        const { error } = await supabase.from('prompts').insert({
            title,
            description,
            prompt_text: promptText,
            category_id: parseInt(categoryId, 10),
        });

        if (error) throw error;

        toast({
            title: "Prompt submitted!",
            description: "Thank you for your contribution. Your prompt is now part of the library.",
        });
        // Reset form
        setTitle('');
        setDescription('');
        setPromptText('');
        setCategoryId('');

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Submission failed",
            description: error.message,
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-card/50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold tracking-tight">Submit a New Prompt</CardTitle>
              <CardDescription>
                Contribute to the community by sharing your own powerful prompts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-2">
                  <label htmlFor="title">Title</label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Creative Story Starter" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description">Description</label>
                  <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="A short summary of what this prompt does." />
                </div>
                {categories.length > 0 && (
                  <div className="grid gap-2">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="grid gap-2">
                  <label htmlFor="prompt_text">Prompt</label>
                  <Textarea
                    id="prompt_text"
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    required
                    className="min-h-[200px]"
                    placeholder="Enter the full prompt text here..."
                  />
                </div>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting} size="lg">
                      {isSubmitting ? 'Submitting...' : 'Submit Prompt'}
                    </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
