import { TypedSupabaseClient } from "../utils/supabase";

export async function getAvatar(client: TypedSupabaseClient, path: string) {
    return await client.storage.from('avatars').download(path);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function uploadAvatar(client: TypedSupabaseClient, url: string, file: any) {
    return await client.storage.from('avatars').upload(url, file);
}