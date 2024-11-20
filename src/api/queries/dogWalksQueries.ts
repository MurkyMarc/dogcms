import { TablesInsert } from "../../utils/database.types";
import { TypedSupabaseClient } from "../supabase";

export async function createDogWalksByDogIds(client: TypedSupabaseClient, walkId: number, dogIds: number[]) {
    const dogWalks = dogIds.map((dogId) => {
        return { 'walk': walkId, 'dog': dogId }
    });
    return await client
        .from('dog_walks')
        .upsert([...dogWalks] as TablesInsert<'dog_walks'>[], { ignoreDuplicates: true })
        .throwOnError();
}

export async function deleteDogWalksByDogIds(client: TypedSupabaseClient, walkId: number, dogIds: number[]) {
    return await client
        .from('dog_walks')
        .delete()
        .eq('walk', walkId)
        .in('dog', dogIds)
        .throwOnError();
}

export async function deleteDogWalkById(client: TypedSupabaseClient, id: string) {
    return await client
        .from('dog_walks')
        .delete()
        .eq('id', id)
        .throwOnError();
}

export async function getDogWalkById(client: TypedSupabaseClient, id: string) {
    return await client
        .from('dog_walks')
        .select(`*`)
        .eq('id', id)
        .throwOnError()
        .single();
}

export async function getDogWalksByDogIds(client: TypedSupabaseClient, ids: string[]) {
    return await client
        .from('dog_walks')
        .select(`*`)
        .in('dog', ids)
        .throwOnError() || [];
}

export async function getDogWalksByWalkId(client: TypedSupabaseClient, walkId: number) {
    return await client
        .from('dog_walks')
        .select(`*`)
        .eq('walk', walkId)
        .throwOnError() || [];
}
