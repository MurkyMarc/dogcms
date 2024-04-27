import { Tables } from "../../utils/database.types";
import { TypedSupabaseClient } from "../../utils/supabase";

export async function upsertProfile(client: TypedSupabaseClient, updates: Tables<'profiles'>) {
    return await client.from('profiles').upsert(updates);
}

export async function updateProfile(
    client: TypedSupabaseClient,
    profile: Partial<Tables<'profiles'>>
) {
    const {id, ...data} = profile;
    return await client
        .from('profiles')
        .update({ ...data })
        .eq('id', id!)
        .select()
        .throwOnError()
}

export async function getProfileById(client: TypedSupabaseClient, profileId: string) {
    return await client
        .from('profiles')
        // .select(`username, website, image`)
        .select()
        .eq('id', profileId)
        .throwOnError()
        .single();
}