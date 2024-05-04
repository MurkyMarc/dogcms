import { Tables } from "../../utils/database.types";
import { TypedSupabaseClient } from "../../utils/supabase";

export async function upsertWalk(client: TypedSupabaseClient, walk: Tables<'walks'>) {
    return await client.from('walks').upsert(walk);
}

export async function updateWalk(
    client: TypedSupabaseClient,
    updates: Partial<Tables<'walks'>>
) {
    const { id, ...data } = updates;
    return await client
        .from('walks')
        .update({ ...data })
        .eq('id', id!)
        .select()
        .single()
        .throwOnError()
}

export async function deleteWalkById(client: TypedSupabaseClient, id: string) {
    return await client
        .from('walks')
        .delete()
        .eq('id', id)
        .throwOnError();
}

export async function getWalkById(client: TypedSupabaseClient, id: string) {
    return await client
        .from('walks')
        .select(`*`)
        .eq('id', id)
        .throwOnError()
        .single();
}

// todo - create queries for walks for 1 day, 1 week, 1 month

export async function getWalksByWalkerId(client: TypedSupabaseClient, id: string) {
    return await client
        .from('walks')
        .select(`*`)
        .eq('walker', id)
        .throwOnError() || [];
}
