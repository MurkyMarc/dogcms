import { Tables, TablesInsert } from "../../utils/database.types";
import { TypedSupabaseClient } from "../../utils/supabase";

export async function upsertWalk(client: TypedSupabaseClient, walk: Tables<'walks'>) {
    return await client.from('walks').upsert(walk);
}

type WalkUpdate = {
    id: number;
    start: string;
    end: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    notes: string;
    subtitle: string;
}

export async function updateWalk(
    client: TypedSupabaseClient,
    updates: WalkUpdate
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
    if (!id) return null;
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
        .order('start', { ascending: true })
        .gte('start', startDate)
        .lte('start', endDate)
        .throwOnError() || [];
}

export async function getWalksByCustomerIdAndDateRange(client: TypedSupabaseClient, id: string, startDate: string, endDate: string) {
    return await client
        .from('walks_with_dogs')
        .select(`*`)
        .eq('customer', id)
        .order('start', { ascending: true })
        .gte('start', startDate)
        .lte('start', endDate)
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