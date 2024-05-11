import { Tables, TablesInsert } from "../../utils/database.types";
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
        .from('walks_with_dogs')
        .select(`*`)
        .eq('id', id)
        .throwOnError()
        .single();
}

// todo - test this query
export async function getWalksByWalkerIdAndDateRange(client: TypedSupabaseClient, id: string, startDate: string, endDate: string) {
    return await client
        .from('walks_with_dogs')
        .select(`*`)
        .eq('walker', id)
        .order('date', { ascending: true })
        .gte("date", startDate)
        .lte("date", endDate)
        .throwOnError() || [];
}

export async function getWalksByCustomerIdAndDateRange(client: TypedSupabaseClient, id: string, startDate: string, endDate: string) {
    return await client
        .from('walks_with_dogs')
        .select(`*`)
        .eq('customer', id)
        .order('date', { ascending: true })
        .gte("date", startDate)
        .lte("date", endDate)
        .throwOnError() || [];
}

export async function createWalk(client: TypedSupabaseClient, walk: Partial<TablesInsert<'walks'>>) {
    return await client
        .from('walks')
        .insert(walk as TablesInsert<'walks'>)
        .select()
        .single()
        .throwOnError();
}