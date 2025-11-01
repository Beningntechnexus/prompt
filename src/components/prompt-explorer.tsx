'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Prompt } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Textarea } from '@/components/ui/textarea';
import { Search, ArrowLeft, Layers3, BotMessageSquare, ServerCrash, Copy, Share2, Download, Code, Pencil, ShoppingCart, Video, Book, Gamepad2, Heart, Mic, BrainCircuit, Users, PenTool, Youtube, Palette, Building, Briefcase, Lightbulb, Music, PlusCircle, Trash2, ChevronRight, Brain, WandSparkles, PenLine, BookOpen, SearchCode, Dumbbell, Rocket } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


const categoryIcons: { [key: string]: React.ReactNode } = {
  'Business & Marketing': <Briefcase className="w-8 h-8 text-primary" />,
  'AI & Machine Learning': <Brain className="w-8 h-8 text-primary" />,
  'Content Creation': <WandSparkles className="w-8 h-8 text-primary" />,
  'Copywriting': <PenLine className="w-8 h-8 text-primary" />,
  'Education & Learning': <BookOpen className="w-8 h-8 text-primary" />,
  'Productivity': <Rocket className="w-8 h-8 text-primary" />,
  'Health & Fitness': <Dumbbell className="w-8 h-8 text-primary" />,
  'Technology': <SearchCode className="w-8 h-8 text-primary" />,
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
  'Prompt Engineering': <Pencil className="w-8 h-8 text-primary" />,
  'Relationships': <Users className="w-8 h-8 text-primary" />,
  'Research': <Book className="w-8 h-8 text-primary" />,
  'Storytelling': <PenTool className="w-8 h-8 text-primary" />,
  'UI/UX': <Palette className="w-8 h-8 text-primary" />,
  'YouTube': <Youtube className="w-8 h-8 text-primary" />,
  'default': <Layers3 className="w-8 h-8 text-primary" />
};

// --- Data Fetching and Mutations ---

const fetchCategories = async () => supabase.from('categories').select('*').order('name');
const fetchPrompts = async () => supabase.from('prompts').select('id, title, prompt_text, category_id, description');

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

  const handleFormSubmit = async (formData: { title: string, prompt_text: string, description: string }) => {
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
        <Card key={i} className="bg-card/50 flex flex-col items-center justify-center p-6 text-center">
          <Skeleton className="h-10 w-10 mb-4 rounded-lg" />
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2" />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {categories.map(category => (
        <button
          key={category.id} 
          onClick={() => handleCategorySelect(category.id)} 
          className="group text-center w-full bg-card/50 rounded-lg border border-transparent p-6 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex justify-center mb-4">
              {categoryIcons[category.name] || categoryIcons.default}
          </div>
          <h3 className="font-semibold text-md text-card-foreground mb-1">{category.name}</h3>
          <p className="text-xs text-muted-foreground">{prompts.filter(p => p.category_id === category.id).length} Prompts</p>
        </button>
      ))}
    </div>
  );

  const renderPromptList = () => (
    <div className="text-left">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-8">
        <div>
          <Button variant="ghost" onClick={handleBackToCategories} className="-ml-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Button>
          <div className="flex items-center gap-3 mt-2">
            <div className="bg-primary/10 p-3 rounded-lg">
              {categoryIcons[selectedCategory?.name || 'default'] || <Layers3 className="w-6 h-6 text-primary" />}
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {selectedCategory?.name}
              </h2>
              <p className="text-md text-muted-foreground">
                {`${filteredPrompts.length} prompts available`}
              </p>
            </div>
          </div>
        </div>
        <Button onClick={handleOpenCreateForm}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          type="text" 
          placeholder="Search prompts in this category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 py-3 text-base h-12 rounded-full bg-card/50 border-2 border-border focus:border-primary"
        />
      </div>

      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredPrompts.map(prompt => (
            <Card key={prompt.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card/50">
              <CardHeader className="flex flex-row justify-between items-start pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">{prompt.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{prompt.description}</CardDescription>
                </div>
                <div className="flex items-center -mr-2 -mt-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEditForm(prompt)}><Pencil className="h-4 w-4 text-muted-foreground" /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10">
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
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap font-code text-sm bg-background/50 p-4 rounded-lg border">
                  {prompt.prompt_text}
                </div>
                <div className="flex items-center justify-end gap-1 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => handleCopy(prompt.prompt_text)}><Copy className="mr-2 h-4 w-4" />Copy</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShare(prompt.title, prompt.prompt_text)}><Share2 className="mr-2 h-4 w-4" />Share</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownload(prompt.title, prompt.prompt_text)}><Download className="mr-2 h-4 w-4" />Download</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 border-2 border-dashed rounded-xl bg-card/50">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No Prompts Found</h3>
          <p className="mt-2 text-sm text-muted-foreground">Your search for "{searchQuery}" did not return any results.</p>
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
  onSubmit: (formData: { title: string, prompt_text: string, description: string }) => Promise<void>;
  prompt: Prompt | null;
}

function PromptFormDialog({ isOpen, onOpenChange, onSubmit, prompt }: PromptFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [promptText, setPromptText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(prompt?.title || '');
      setDescription(prompt?.description || '');
      setPromptText(prompt?.prompt_text || '');
    }
  }, [isOpen, prompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit({ title, description, prompt_text: promptText });
    setIsSubmitting(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] bg-background">
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
              <label htmlFor="description">Description</label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
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
