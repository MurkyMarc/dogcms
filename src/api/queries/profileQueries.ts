import { Tables, TablesUpdate } from "../../utils/database.types";
import { TypedSupabaseClient } from "../supabase";

export async function upsertProfile(client: TypedSupabaseClient, updates: Tables<'profiles'>) {
    return await client.from('profiles').upsert(updates);
}

export async function updateProfile(
    client: TypedSupabaseClient,
    profile: TablesUpdate<'profiles'>
) {
    const { id, ...data } = profile;
    return await client
        .from('profiles')
        .update({ ...data })
        .eq('id', id!)
        .select()
        .single()
        .throwOnError()
}

export async function getProfileById(client: TypedSupabaseClient, profileId: string) {
    return await client
        .from('profiles')
        .select()
        .eq('id', profileId)
        .throwOnError()
        .single();
}

export async function getProfileAvatarUrl(client: TypedSupabaseClient, image: string) {
    if (image == "" || !image) return { url: null }

    const { data, error } = await client.storage.from('avatars').download(image);
    if (error || data == null) return { url: null, error }

    const objectUrl = URL.createObjectURL(data);
    return { url: objectUrl, error }
}

export async function uploadProfileAvatar(client: TypedSupabaseClient, url: string, file: Blob | File) {
    return await client.storage.from('avatars').upload(url, file);
}

export async function deleteAvatar(client: TypedSupabaseClient, url: string) {
    if (!url) return;
    return client.storage.from('avatars').remove([url]);
}

export async function getProfileAvatarURLs(client: TypedSupabaseClient, paths: string[]) {
    const fetchPromises = paths.map(async (path) => {
        try {
            const { data, error } = await client.storage.from('avatars').download(path);
            if (error) throw error;
            const objectUrl = URL.createObjectURL(data);
            return { path, objectUrl, error: null };
        } catch (error) {
            return { path, objectUrl: null, error };
        }
    });

    const avatars = await Promise.all(fetchPromises);
    return avatars;
}

export async function getEmployees(client: TypedSupabaseClient) {
    return await client
        .from('profiles')
        .select(`id, f_name, l_name, image, role, street, city, state, zip, phone`)
        .or('role.eq.admin, role.eq.employee')
        .throwOnError() || [];
}

export async function deductCreditsFromProfile(
    client: TypedSupabaseClient,
    userId: string,
    credits: number
) {
    // First get current credits to check if sufficient
    const { data: profile } = await client
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

    if (!profile || profile.credits < credits) {
        throw new Error('Insufficient credits');
    }

    // Then update credits
    return await client
        .from('profiles')
        .update({ credits: profile.credits - credits })
        .eq('id', userId)
        .select('credits')
        .single();
}