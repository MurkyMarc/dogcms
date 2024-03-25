import { Tables } from "../utils/database.types";
import { TypedSupabaseClient } from "../utils/supabase";

export async function upsertDog(client: TypedSupabaseClient, dog: Tables<'dogs'>) {
    return await client.from('dogs').insert(dog);
}

export async function updateDog(
    client: TypedSupabaseClient,
    params: {
        id: number;
        data: Partial<Tables<'dogs'>>;
    }
) {
    return await client
        .from('dogs')
        .update({ ...params.data })
        .eq('id', params.id)
        .throwOnError()
}

export async function getDogById(client: TypedSupabaseClient, id: number) {
    return await client
        .from('dogs')
        // .select(`username, website, avatar_url`)
        .select(`*`)
        .eq('id', id)
        .throwOnError()
        .single();
}