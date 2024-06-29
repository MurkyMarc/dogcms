import { Tables, TablesInsert } from "../../utils/database.types";
import { TypedSupabaseClient } from "../../utils/supabase";

export async function upsertDog(client: TypedSupabaseClient, dog: Tables<'dogs'>) {
    return await client.from('dogs').upsert(dog);
}

export async function createDog(client: TypedSupabaseClient, dog: TablesInsert<'dogs'>) {
    return await client
        .from('dogs')
        .insert(dog)
        .select()
        .single()
        .throwOnError();
}

export async function updateDog(
    client: TypedSupabaseClient,
    updates: Partial<Tables<'dogs'>>
) {
    const { id, ...data } = updates;
    return await client
        .from('dogs')
        .update({ ...data })
        .eq('id', id!)
        .select()
        .single()
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

export async function deleteDogById(client: TypedSupabaseClient, id: string) {
    return await client
        .from('dogs')
        .delete()
        .eq('id', id)
        .throwOnError();
}

export async function getDogsByOwnerId(client: TypedSupabaseClient, id: string) {
    return await client
        .from('dogs')
        .select(`*`)
        .eq('owner', id)
        .throwOnError() || [];
}

export async function getDogImageURL(client: TypedSupabaseClient, path: string) {
    if (!path) return { url: null, error: null };

    const { data, error } = await client.storage.from('dogs').download(path);
    if (error || data == null) return { url: null, error }

    const objectUrl = URL.createObjectURL(data);
    return { url: objectUrl, error }
}

export async function getDogImage(client: TypedSupabaseClient, dog: Tables<'dogs'>) {
    if (!dog.image) {
        return { url: null, error: `dog: ${dog.id} does not have an image` }
    }
    const { data, error } = await client.storage.from('dogs').download(dog.image);
    if (error || data == null) return { url: null, error }

    const objectUrl = URL.createObjectURL(data);
    return { url: objectUrl, error }
}

export async function uploadDogImage(client: TypedSupabaseClient, url: string, file: Blob | File) {
    return await client.storage.from('dogs').upload(url, file);
}

export async function deleteDogImage(client: TypedSupabaseClient, url: string) {
    return client.storage.from('dogs').remove([url]);
}

export async function getDogImageURLs(client: TypedSupabaseClient, paths: string[]) {
    const fetchPromises = paths.map(async (path) => {
        try {
            if (!path) return { path, objectUrl: "", error: null };

            const { data, error } = await client.storage.from('dogs').download(path);
            if (error) throw new Error(error.message);

            const objectUrl = URL.createObjectURL(data);
            return { path, objectUrl, error: null };
        } catch (error) {
            console.error(`Failed to fetch image at ${path}:`, error);
            return { path, objectUrl: null, error };
        }
    });

    return await Promise.all(fetchPromises);
}
