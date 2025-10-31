import { createClient } from '@supabase/supabase-js';
import type { Database } from './types_db';

const supabaseUrl = 'https://pwltupaomwipecedolel.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3bHR1cGFvbXdpcGVjZWRvbGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NTMzMzMsImV4cCI6MjA3NzQyOTMzM30.vSU6I1Mq9vyPjbyVrf-sbEVVXyhCg6ne302g2PdmBpI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and/or anonymous key are not provided.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
