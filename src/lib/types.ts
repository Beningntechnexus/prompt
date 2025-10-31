import type { Database } from './types_db';

export type Category = Database['public']['Tables']['categories']['Row'];
export type Prompt = Database['public']['Tables']['prompts']['Row'];
