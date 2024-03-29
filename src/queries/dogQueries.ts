import { Tables } from "../utils/database.types";
import { TypedSupabaseClient } from "../utils/supabase";

export async function upsertDog(client: TypedSupabaseClient, dog: Tables<'dogs'>) {
    return await client.from('dogs').insert(dog);
}

export async function updateDog(
    client: TypedSupabaseClient,
    params: {
        id: string;
        data: Partial<Tables<'dogs'>>;
    }
) {
    return await client
        .from('dogs')
        .update({ ...params.data })
        .eq('id', params.id)
        .throwOnError()
}

export async function getDogById(client: TypedSupabaseClient, id: string) {
    return await client
        .from('dogs')
        .select(`*`)
        .eq('id', id)
        .throwOnError()
        .single();
}

export async function getDogsByOwnerId(client: TypedSupabaseClient, id: string) {
    return await client
        .from('dogs')
        .select(`*`)
        .eq('owner', id)
        .throwOnError() || [];
}