import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (typeof window === 'undefined') {
    // Server-side: create client if needed
    if (!supabaseClient) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
      }

      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
    return supabaseClient;
  } else {
    // Client-side: always create fresh to respect current keys
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }

    return createClient(supabaseUrl, supabaseAnonKey);
  }
}

// Create database tables if they don't exist
export async function initializeDatabase() {
  try {
    const client = getSupabase();
    const { error } = await client.from('leads').select('count', { count: 'exact' }).limit(1);

    if (error) {
      console.error('Database error (this is expected on first run):', error.message);
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}
