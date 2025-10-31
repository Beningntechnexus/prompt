'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Prompt } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Textarea } from '@/components/ui/textarea';
import { Search, ArrowLeft, Layers3, BotMessageSquare, ServerCrash, Copy, Share2, Download, Code, Pencil, ShoppingCart, Video, Book, Gamepad2, Heart, Mic, BrainCircuit, Users, PenTool, Youtube, Palette, Building, Briefcase, Lightbulb, Music, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const categoryIcons: { [key: string]: React.ReactNode } = {
  'AI Tools': <BrainCircuit className="w-8 h-8 text-primary" />,
  'Art': <Palette className="w-8 h-8 text-primary" />,
  'Blogging': <PenTool className="w-8 h-8 text-primary" />,
  'Business': <Building className="w-8 h-8 text-primary" />,
  'ChatGPT': <BotMessageSquare className="w-8 h-8 text-primary" />,
  'Coding': <Code className="w-8 h-8 text-primary" />,
  'Education': <Book className="w-8 h-8 text-primary" />,
  'Finance': <Briefcase className="w-8 h-8 text-primary" />,
  'Health': <Heart className="w-8 h-8 text-primary" />,
  'Marketing': <ShoppingCart className="w-8 h-8 text-primary" />,
  'Midjourney': <Gamepad2 className="w-8 h-8 text-primary" />,
  'Motivation': <Lightbulb className="w-8 h-8 text-primary" />,
  'Podcast': <Mic className="w-8 h-8 text-primary" />,
  'Productivity': <BrainCircuit className="w-8 h-8 text-primary" />,
  'Prompt Engineering': <Pencil className="w-8 h-8 text-primary" />,
  'Relationships': <Users className="w-8 h-8 text-primary" />,
  'Research': <Book className="w-8 h-8 text-primary" />,
  'Storytelling': <PenTool className="w-8 h-8 text-primary" />,
  'UI/UX': <Palette className="w-8 h-8 text-primary" />,
  'YouTube': <Youtube className="w-8 h-8 text-primary" />,
  'default': <Layers3 className="w-8 h-8 text-primary" />
};

const DecorativePattern = () => (
  <div className="absolute inset-0 h-full w-full bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
);

// --- Data Fetching and Mutations ---

const fetchCategories = async () => supabase.from('categories').select('*').order('name');
const fetchPrompts = async () => supabase.from('prompts').select('id, title, prompt_text, category_id');

const createPrompt = async (prompt: Omit<Prompt, 'id' | 'created_at'>) => {
  return supabase.from('prompts').insert(prompt).select().single();
};

const updatePrompt = async (id: number, updates: Partial<Prompt>) => {
  return supabase.from('prompts').update(updates).eq('id', id).select().single();
};

const deletePrompt = async (id: number) => {
  return supabase.from('prompts').delete().eq('id', id);
};


// --- Main Component ---

export function PromptExplorer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [categoriesResult, promptsResult] = await Promise.all([
        fetchCategories(),
        fetchPrompts(),
      ]);

      if (categoriesResult.error) throw categoriesResult.error;
      if (promptsResult.error) throw promptsResult.error;

      setCategories(categoriesResult.data || []);
      setPrompts(promptsResult.data || []);
    } catch (err: any) {
      setError('Failed to load data. Please try again later.');
      toast({
        variant: 'destructive',
        title: 'Error loading data',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const filteredPrompts = useMemo(() => {
    if (!selectedCategoryId) return [];
    
    return prompts.filter(prompt =>
      prompt.category_id === selectedCategoryId &&
      (prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (prompt.prompt_text && prompt.prompt_text.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }, [prompts, selectedCategoryId, searchQuery]);

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null;
    return categories.find(c => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const handleCategorySelect = useCallback((id: number) => {
    setSelectedCategoryId(id);
    setSearchQuery('');
  }, []);

  const handleBackToCategories = useCallback(() => {
    setSelectedCategoryId(null);
    setSearchQuery('');
  }, []);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Could not copy prompt to clipboard.",
      });
    }
  };

  const handleShare = async (title: string, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
        });
      } catch (err) {
        // Silently fail if user cancels share
      }
    } else {
      toast({
        variant: "destructive",
        title: "Not supported",
        description: "Web Share API is not supported in your browser.",
      });
    }
  };

  const handleDownload = (title: string, text: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/ /g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenEditForm = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  const handleOpenCreateForm = () => {
    setEditingPrompt(null);
    setIsFormOpen(true);
  }

  const handleFormSubmit = async (formData: { title: string, prompt_text: string }) => {
    try {
      if (editingPrompt) {
        // Update existing prompt
        const { data, error } = await updatePrompt(editingPrompt.id, formData);
        if (error) throw error;
        setPrompts(prompts.map(p => p.id === data.id ? data : p));
        toast({ title: 'Success', description: 'Prompt updated successfully.' });
      } else if(selectedCategoryId) {
        // Create new prompt
        const { data, error } = await createPrompt({ ...formData, category_id: selectedCategoryId });
        if (error) throw error;
        setPrompts([...prompts, data]);
        toast({ title: 'Success', description: 'Prompt created successfully.' });
      }
      setIsFormOpen(false);
      setEditingPrompt(null);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Save failed", description: err.message });
    }
  };

  const handleDeletePrompt = async (id: number) => {
    try {
      const { error } = await deletePrompt(id);
      if (error) throw error;
      setPrompts(prompts.filter(p => p.id !== id));
      toast({ title: 'Success', description: 'Prompt deleted successfully.' });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Delete failed", description: err.message });
    }
  };

  const renderLoading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="p-6">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </Card>
      ))}
    </div>
  );

  const renderError = () => (
    <Card className="mt-10 col-span-full flex flex-col items-center justify-center p-10 bg-destructive/10 border-destructive/30">
        <ServerCrash className="w-16 h-16 text-destructive mb-4" />
        <CardTitle className="text-destructive mb-2">Something went wrong</CardTitle>
        <p className="text-destructive/80">{error}</p>
    </Card>
  );

  const renderCategoryGrid = () => (
    <div>
      <h1 className="text-4xl font-bold tracking-tight text-center mb-2 font-headline">Prompt Explorer</h1>
      <p className="text-lg text-muted-foreground text-center mb-10">Select a category to start exploring prompts.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {categories.map(category => (
          <Card 
            key={category.id} 
            onClick={() => handleCategorySelect(category.id)} 
            className="group relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border-border/80 hover:border-primary/50 bg-card"
          >
            <DecorativePattern />
            <CardContent className="p-6 flex flex-col items-start justify-between h-full relative">
              <div className="bg-primary/10 p-2 rounded-lg mb-4">
                {categoryIcons[category.name] || categoryIcons.default}
              </div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">{category.name}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPromptList = () => (
    <div>
      <div className="flex justify-between items-start">
        <div>
          <Button variant="ghost" onClick={handleBackToCategories} className="mb-6 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
          <h1 className="text-3xl font-bold tracking-tight mb-2 font-headline">
            {selectedCategory?.name}
          </h1>
          <p className="text-md text-muted-foreground mb-6">
            {`Browse and search for prompts in the "${selectedCategory?.name}" category.`}
          </p>
        </div>
        <Button onClick={handleOpenCreateForm} className="mt-8">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder="Search prompts by keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 text-base"
        />
      </div>

      {filteredPrompts.length > 0 ? (
        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredPrompts.map(prompt => (
            <AccordionItem key={prompt.id} value={`item-${prompt.id}`} className="bg-card border rounded-lg shadow-sm">
              <AccordionTrigger className="p-4 text-left font-medium hover:no-underline">
                <div className="flex items-center gap-3">
                  <BotMessageSquare className="h-5 w-5 text-primary/80 flex-shrink-0" />
                  <span>{prompt.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-0">
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap font-code text-sm bg-muted/50 p-3 rounded-md">
                  {prompt.prompt_text}
                </div>
                <div className="flex items-center justify-end gap-1 mt-4">
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(prompt.prompt_text)}><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleShare(prompt.title, prompt.prompt_text)}><Share2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(prompt.title, prompt.prompt_text)}><Download className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEditForm(prompt)}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this prompt.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePrompt(prompt.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-10 px-4 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No prompts found for your search.</p>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="w-full transition-all duration-300">
      {loading ? renderLoading() : 
       error ? renderError() :
       selectedCategoryId === null ? renderCategoryGrid() : renderPromptList()
      }
      <PromptFormDialog 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        prompt={editingPrompt}
      />
    </div>
  );
}

// --- PromptFormDialog Component ---

interface PromptFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (formData: { title: string, prompt_text: string }) => Promise<void>;
  prompt: Prompt | null;
}

function PromptFormDialog({ isOpen, onOpenChange, onSubmit, prompt }: PromptFormDialogProps) {
  const [title, setTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(prompt?.title || '');
      setPromptText(prompt?.prompt_text || '');
    }
  }, [isOpen, prompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ title, prompt_text: promptText });
    setIsSubmitting(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{prompt ? 'Edit Prompt' : 'Create New Prompt'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title">Title</label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <label htmlFor="prompt_text">Prompt</label>
              <Textarea id="prompt_text" value={promptText} onChange={(e) => setPromptText(e.target.value)} required className="min-h-[200px]" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
