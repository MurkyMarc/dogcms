import { TypedSupabaseClient } from "../utils/supabase";

export async function signInWithOTP(client: TypedSupabaseClient, email: string) {
    return await client.auth.signInWithOtp({ email });
}

export async function signOut(client: TypedSupabaseClient) {
    return await client.auth.signOut();
}

export async function getSession(client: TypedSupabaseClient) {
    return await client.auth.getSession();
}
