'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Prompt } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, ArrowLeft, LoaderCircle, ServerCrash, Layers3, BotMessageSquare } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function PromptExplorer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const categoriesPromise = supabase.from('categories').select('*').order('name');
        const promptsPromise = supabase.from('prompts').select('id, title, prompt_text, category_id');
        
        const [{ data: categoriesData, error: categoriesError }, { data: promptsData, error: promptsError }] = await Promise.all([categoriesPromise, promptsPromise]);

        if (categoriesError) throw categoriesError;
        if (promptsError) throw promptsError;

        setCategories(categoriesData || []);
        setPrompts(promptsData || []);
      } catch (err: any) {
        setError('Failed to load data. Please try again later.');
        toast({
          variant: "destructive",
          title: "Error",
          description: err.message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

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
          <Card key={category.id} onClick={() => handleCategorySelect(category.id)} className="group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden border-border/80 hover:border-primary/50">
            <CardContent className="p-5 flex flex-col items-start justify-between h-full">
              <Layers3 className="w-8 h-8 text-primary mb-3" />
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">{category.name}</CardTitle>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPromptList = () => (
    <div>
      <Button variant="ghost" onClick={handleBackToCategories} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Categories
      </Button>
      <h1 className="text-3xl font-bold tracking-tight mb-2 font-headline">
        {selectedCategory?.name}
      </h1>
      <p className="text-md text-muted-foreground mb-6">
        {`Browse and search for prompts in the "${selectedCategory?.name}" category.`}
      </p>
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
  
  if (loading) return renderLoading();
  if (error) return renderError();

  return (
    <div className="w-full transition-all duration-300">
      {selectedCategoryId === null ? renderCategoryGrid() : renderPromptList()}
    </div>
  );
}
