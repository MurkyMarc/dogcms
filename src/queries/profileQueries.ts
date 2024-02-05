import { Tables } from "../utils/database.types";
import { TypedSupabaseClient } from "../utils/supabase";

export async function upsertProfile(client: TypedSupabaseClient, updates: Tables<'profiles'>) {
    return await client.from('profiles').upsert(updates);
}

export async function updateProfile(
    client: TypedSupabaseClient,
    params: {
        id: string;
        data: Partial<Tables<'profiles'>>;
    }
) {
    return await client
        .from('profiles')
        .update({ ...params.data })
        .eq('id', params.id)
        .throwOnError()
}

export async function getProfileById(client: TypedSupabaseClient, profileId: string) {
    return await client
        .from('profiles')
        // .select(`username, website, avatar_url`)
        .select(`*`)
        .eq('id', profileId)
        .throwOnError()
        .single();
}