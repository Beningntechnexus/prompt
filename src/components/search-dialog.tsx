
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Prompt, Category } from '@/lib/types';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FileText, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SearchDialog({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (isOpen: boolean) => void }) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const fetchPromptsAndCategories = async () => {
        setLoading(true);
        const [{ data: promptsData }, { data: categoriesData }] = await Promise.all([
          supabase.from('prompts').select('*'),
          supabase.from('categories').select('*'),
        ]);
        setPrompts(promptsData || []);
        setCategories(categoriesData || []);
        setLoading(false);
      };
      fetchPromptsAndCategories();
    }
  }, [isOpen]);

  const handleSelect = (promptId: number) => {
    const prompt = prompts.find(p => p.id === promptId);
    if (prompt) {
      // For now, we can log it or close the dialog. A future improvement could navigate to the category page.
      console.log('Selected prompt:', prompt);
      onOpenChange(false);
      // router.push(`/categories#prompt-${prompt.id}`); // This would require more logic in PromptExplorer
    }
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type to search all prompts..." />
      <CommandList>
        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Loading prompts...</div>
        ) : (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {!loading && prompts.length > 0 && (
          <CommandGroup heading="Prompts">
            {prompts.map((prompt) => (
              <CommandItem
                key={prompt.id}
                value={`${prompt.title} ${prompt.prompt_text}`}
                onSelect={() => handleSelect(prompt.id)}
                className="cursor-pointer"
              >
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{prompt.title}</span>
                    <span className="text-xs text-muted-foreground">in {getCategoryName(prompt.category_id)}</span>
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
