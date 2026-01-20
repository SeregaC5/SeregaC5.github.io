import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Question = {
  id: string;
  question_text: string;
  question_type: 'text' | 'multiple_choice';
  correct_answer: string;
  options: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
