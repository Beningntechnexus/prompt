'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Prompt } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Search, ArrowLeft, Layers3, BotMessageSquare, ServerCrash, Copy, Share2, Download, Code, ShoppingCart, Video, Book, Gamepad2, Heart, Mic, BrainCircuit, Users, PenTool, Youtube, Palette, Building, Briefcase, Lightbulb, Music, PlusCircle, Trash2, ChevronRight, Brain, WandSparkles, PenLine, BookOpen, SearchCode, Dumbbell, Rocket, Pencil } from 'lucide-react';
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


// --- Main Component ---

export function PromptExplorer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

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
      setError('Failed to load prompts. Please try again later.');
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
        <CardTitle className="text-destructive mb-2">Failed to load prompts</CardTitle>
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
            <Card key={prompt.id} className="group overflow-hidden shadow-sm hover:shadow-primary/20 transition-shadow bg-card/50">
              <CardHeader className="flex flex-row justify-between items-start pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold">{prompt.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{prompt.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-card-foreground/90 py-4 leading-relaxed whitespace-pre-wrap font-sans">
                  {prompt.prompt_text}
                </div>
                <div className="flex items-center justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(prompt.prompt_text)}><Copy className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShare(prompt.title, prompt.prompt_text)}><Share2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(prompt.title, prompt.prompt_text)}><Download className="h-4 w-4" /></Button>
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
    </div>
  );
}
