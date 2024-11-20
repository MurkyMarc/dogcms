import { useMemo } from 'react';
import { getSupabaseBrowserClient } from '../supabase';

function useSupabase() {
    return useMemo(getSupabaseBrowserClient, []);
}

export default useSupabase;