import { Tables } from "../utils/database.types";
import { TypedSupabaseClient } from "../utils/supabase";

export async function getAvatarURL(client: TypedSupabaseClient, path: string) {
    const { data, error } = await client.storage.from('avatars').download(path);
    if (error || data == null) return { url: null, error }

    const objectUrl = URL.createObjectURL(data);
    return { url: objectUrl, error }
}

export async function getProfileAvatar(client: TypedSupabaseClient, profile: Tables<'profiles'>) {
    if (!profile.image) {
        return { url: null, error: `profile: ${profile.id} does not have an image` }
    }
    const { data, error } = await client.storage.from('avatars').download(profile.image);
    if (error || data == null) return { url: null, error }

    const objectUrl = URL.createObjectURL(data);
    return { url: objectUrl, error }
}

export async function uploadAvatar(client: TypedSupabaseClient, url: string, file: Blob | File) {
    return await client.storage.from('avatars').upload(url, file);
}

export async function deleteAvatar(client: TypedSupabaseClient, url: string) {
    return await client.storage.from('avatars').remove([url]);
}

export async function getAvatarURLs(client: TypedSupabaseClient, paths: string[]) {
    const fetchPromises = paths.map(async (path) => {
        try {
            const { data, error } = await client.storage.from('avatars').download(path);
            if (error) throw new Error(error.message);
            const objectUrl = URL.createObjectURL(data);
            return { path, objectUrl, error: null };
        } catch (error) {
            console.error(`Failed to fetch avatar at ${path}:`, error);
            return { path, objectUrl: null, error };
        }
    });

    const avatars = await Promise.all(fetchPromises);
    return avatars;
}
