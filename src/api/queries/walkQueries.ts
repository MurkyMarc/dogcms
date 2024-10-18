import { Tables, TablesInsert } from "../../utils/database.types";
import { TypedSupabaseClient } from "../../utils/supabase";
import { WalkStatus } from "../types";

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
        .select(`*,
            walker (
                id,
                f_name,
                l_name,
                image
            )
        `)
        .eq('id', id)
        .throwOnError()
        .single();
}

export async function getWalksByWalkerIdAndDateRange(client: TypedSupabaseClient, id: string, startDate: string, endDate: string) {
    return await client
        .from('walks_with_dogs')
        .select(`*,
            walker (
                id,
                f_name,
                l_name,
                image
            )
        `)
        .eq('walker', id)
        .order('start', { ascending: true })
        .gte('start', startDate)
        .lte('start', endDate)
        .throwOnError() || [];
}

export async function getWalksByCustomerIdAndDateRange(client: TypedSupabaseClient, id: string, startDate: string, endDate: string) {
    return await client
        .from('walks_with_dogs')
        .select(`*,
            walker (
                id,
                f_name,
                l_name,
                image
            )
        `)
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

export async function updateWalkStatus(client: TypedSupabaseClient, id: string, status: WalkStatus) {
    return await client
        .from('walks')
        .update({ status })
        .eq('id', id)
        .select()
        .single()
        .throwOnError();
}

export async function getWalksInDateRange(client: TypedSupabaseClient, startDate: Date, endDate: Date) {
    return await client
        .from('walks')
        .select(`*,
            walker (
                id,
                f_name,
                l_name,
                image
            )
        `)
        .gte('start', startDate.toLocaleString())
        .lte('start', endDate.toLocaleString())
        .order('start', { ascending: true })
        .throwOnError() || [];
}