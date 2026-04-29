import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing! Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment variables.');
}

// Use placeholders to prevent the app from crashing, but log the issue
export const isSupabaseConfigured = Boolean(supabaseUrl && !supabaseUrl.includes('placeholder-url-missing'));

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url-missing.supabase.co',
  supabaseAnonKey || 'placeholder-key-missing'
);
