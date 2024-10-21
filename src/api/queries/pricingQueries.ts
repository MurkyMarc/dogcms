import { TablesUpdate } from "../../utils/database.types";
import { TypedSupabaseClient } from "../../utils/supabase";

export async function getPrices(client: TypedSupabaseClient) {
    return await client
        .from('service_prices')
        .select('*')
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

