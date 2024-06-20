import { Tables, TablesUpdate } from './../../utils/database.types';
import { TablesInsert } from "../../utils/database.types";
import { TypedSupabaseClient } from "../../utils/supabase";

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
        .throwOnError()
        .single();
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

export async function updateConversationLastViewedAt(client: TypedSupabaseClient, conversation: Tables<'conversations'>, id: string) {
    const isEmployee = id === conversation.employee?.id;
    const updateFields = isEmployee
        ? { employee_last_viewed_at: new Date().toLocaleTimeString(), employee_unread_count: 0 }
        : { customer_last_viewed_at: new Date().toLocaleTimeString(), customer_unread_count: 0 };

    return client
        .from('conversations')
        .update(updateFields)
        .eq('id', conversation.id!)
        .select()
        .single()
        .throwOnError();
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