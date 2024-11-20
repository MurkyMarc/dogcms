import { TablesInsert, TablesUpdate } from "../../utils/database.types";
import { TypedSupabaseClient } from "../supabase";

export async function getWalkPrices(client: TypedSupabaseClient) {
    return await client
        .from('service_prices')
        .select('*')
        .eq('is_active', true)
        .eq('service_type', 'walk')
        .order('service_type', { ascending: true });
}

export async function updatePrice(
    client: TypedSupabaseClient,
    price: TablesUpdate<'service_prices'>
) {
    const { id, ...data } = price;
    return await client
        .from('service_prices')
        .update(data)
        .eq('id', id!)
        .select()
        .single();
}

export async function deletePrice(client: TypedSupabaseClient, id: string) {
    return await client
        .from('service_prices')
        .delete()
        .eq('id', id)
        .select()
        .single();
}

export async function addPrice(client: TypedSupabaseClient, price: TablesInsert<'service_prices'>) {
    return await client
        .from('service_prices')
        .insert(price)
        .select()
        .single();
}