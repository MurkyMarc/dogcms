import { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '../utils/database.types';

export type TypedSupabaseClient = SupabaseClient<Database>;
let client: TypedSupabaseClient | undefined;

export function getSupabaseBrowserClient() {
    if (client) return client;

    client = createBrowserClient<Database>(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
    );

    return client;
}

// import.meta.env.VITE_SUPABASE_URL
// import.meta.env.VITE_SUPABASE_ANON_KEY

// process.env.VITE_PUBLIC_SUPABASE_URL!,
// process.env.VITE_PUBLIC_SUPABASE_ANON_KEY!,