import { Tables, TablesUpdate } from '../../utils/database.types';
import { TablesInsert } from "../../utils/database.types";
import { TypedSupabaseClient } from "../supabase";
import { Role } from '../types';

export async function getConversationById(client: TypedSupabaseClient, id: string) {
    return await client
        .from('conversations')
        .select(`*,
            employee (
                id,
                f_name,
                l_name,
                image
            ),
            customer (
                id,
                f_name,
                l_name,
                image
            )`)
        .eq('id', id)
        .throwOnError()
        .single();
}

export async function getConversationByWalkId(client: TypedSupabaseClient, id: string) {
    return await client
        .from('conversations')
        .select(`*,
            employee (
                id,
                f_name,
                l_name,
                image
            ),
            customer (
                id,
                f_name,
                l_name,
                image
            )`)
        .eq('walk_id', id)
        .single()
        .throwOnError()
}

export async function getConversations(client: TypedSupabaseClient, id: string, role: Role) {
    return await client
        .from('conversations')
        .select(`*,
            employee (
                id,
                f_name,
                l_name,
                image
            ),
            customer (
                id,
                f_name,
                l_name,
                image
            )`)
        .eq(role, id)
        .order('last_message', { ascending: false })
        .throwOnError() || [];
}

export async function updateUnreadCountAndLastViewedAt(client: TypedSupabaseClient, conversation: Tables<'conversations'>, userId: string) {
    let params;
    const time = new Date().toLocaleString();

    if (userId === conversation.customer?.id) {
        params = { customer_last_viewed_at: time, customer_unread_count: 0 }
    } else if (userId === conversation.employee?.id) {
        params = { employee_last_viewed_at: time, employee_unread_count: 0 }
    } else {
        return { data: null };
    }

    return await client.from('conversations')
        .update(params)
        .eq('id', conversation.id)
        .select(`*,
            employee (
                id,
                f_name,
                l_name,
                image
            ),
            customer (
                id,
                f_name,
                l_name,
                image
            )`)
        .single()
        .throwOnError();
}

export async function getConversationMessages(client: TypedSupabaseClient, id: string) {
    return await client
        .from('messages')
        .select(`*`)
        .eq('conversation_id', id)
        .throwOnError() || [];
}

export async function createConversation(client: TypedSupabaseClient, conversation: TablesInsert<'conversations'>) {
    return await client
        .from('conversations')
        .insert(conversation as TablesInsert<'conversations'>)
        .select()
        .single()
        .throwOnError();
}

export async function updateConversation(
    client: TypedSupabaseClient,
    updates: TablesInsert<'conversations'>
) {
    const { id, ...data } = updates;
    return await client
        .from('conversations')
        .update({ ...data })
        .eq('id', id!)
        .select()
        .single()
        .throwOnError()
}

export async function deleteConversationById(client: TypedSupabaseClient, id: string) {
    return await client
        .from('conversations')
        .delete()
        .eq('id', id)
        .throwOnError();
}

export async function sendMessage(client: TypedSupabaseClient, message: TablesInsert<'messages'>) {
    return await client
        .from('messages')
        .insert(message as TablesInsert<'messages'>)
        .select()
        .single()
        .throwOnError();
}

export async function deleteMessageById(client: TypedSupabaseClient, id: string) {
    return await client
        .from('messages')
        .delete()
        .eq('id', id)
        .throwOnError();
}

export async function getMessageById(client: TypedSupabaseClient, id: string) {
    return await client
        .from('messages')
        .select(`*`)
        .eq('id', id)
        .throwOnError()
        .single();
}

export async function updateMessage(client: TypedSupabaseClient, message: TablesUpdate<'messages'>) {
    const { id, ...data } = message;
    return await client
        .from('messages')
        .update({ ...data })
        .eq('id', id!)
        .select()
        .single()
        .throwOnError();
}

export async function uploadMessageImage(client: TypedSupabaseClient, url: string, file: Blob | File) {
    return await client.storage.from('message_pics').upload(url, file);
}

export async function getMessageImageURL(client: TypedSupabaseClient, image: string) {
    if (!image) return { url: null }

    const { data, error } = await client.storage.from('message_pics').download(image);
    if (error || data == null) return { url: null, error }

    const objectUrl = URL.createObjectURL(data);
    return { url: objectUrl, error }
}