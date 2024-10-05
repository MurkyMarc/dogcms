import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createConversation, deleteConversationById, deleteMessageById, getConversationByWalkId, getConversationMessages, getConversations, sendMessage, updateConversation, updateMessage, updateUnreadCountAndLastViewedAt, uploadMessageImage } from "../queries/messageQueries";
import useSupabase from "./useSupabase";
import { Tables, TablesInsert } from "../../utils/database.types";
import { errorToast, loadingToast, successToast } from "../../utils/helpers";
import { useLocation, useNavigate } from "react-router-dom";
import { Role } from "../types";

export function useGetConversationByWalkId(id: string) {
    const client = useSupabase();
    const queryKey = ['conversations', id];

    const queryFn = async () => {
        if (!id) return null;
        return await getConversationByWalkId(client, id).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useGetConversations(id: string, role: Role | null) {
    const client = useSupabase();
    const queryKey = ['conversations', id];

    const queryFn = async () => {
        if (!id || !role) return null;
        return await getConversations(client, id, role).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useGetConversationMessages(id: string) {
    const client = useSupabase();
    const queryKey = ['messages', 'conversation_id', id];

    const queryFn = async () => {
        if (!id) return null;
        return await getConversationMessages(client, id).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn, refetchInterval: 5000 });
}

export function useCreateConversation() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (conversation: TablesInsert<'conversations'>) => {
        return await createConversation(client, conversation).then(
            (result) => result.data
        );
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: (conversation) => {
            queryClient.setQueryData(['conversations', `${conversation?.walk_id}`], conversation);
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

// todo - restrict this to the owner or an admin
export function useDeleteConversationById() {
    const client = useSupabase();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const mutationFn = async (id: string) => await deleteConversationById(client, id);

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: (_, id) => {
            queryClient.removeQueries({ queryKey: ['conversations', `${id}`] });
            if (location.pathname.startsWith('/dashboard/conversations/')) {
                navigate('/dashboard');
            }
            successToast("Deleted successfully.");
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useUpdateConversationUnreadCountAndLastViewedAt() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async ({ conversation, userId }: { conversation: Tables<'conversations'>, userId: string }) => {
        return await updateUnreadCountAndLastViewedAt(client, conversation, userId);
    };

    return useMutation({
        mutationFn,
        onSuccess: ({ data: conversation }) => {
            if (!conversation || !conversation.walk_id) return;
            queryClient.setQueryData(['conversations', `${conversation.walk_id}`], conversation);
        }
    });
}

export function useUpdateConversation() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (conversation: TablesInsert<'conversations'>) => {
        return await updateConversation(client, conversation);
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: ({ data: conversation }) => {
            queryClient.setQueryData(['conversations', `${conversation?.walk_id}`], conversation);
            successToast("Updated successfully.")
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useSendMessage() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (message: TablesInsert<'messages'>) => {
        return await sendMessage(client, message).then(
            (result) => result.data
        );
    };

    return useMutation({
        mutationFn,
        onSuccess: (_, message) => {
            queryClient.invalidateQueries({ queryKey: ['messages', 'conversation_id', `${message.conversation_id}`] });
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useUpdateMessage() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (message: TablesInsert<'messages'>) => {
        return await updateMessage(client, message);
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: (_, message) => {
            queryClient.invalidateQueries({ queryKey: ['messages', `${message?.conversation_id}`] });
            successToast("Updated successfully.")
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useDeleteMessageById() {
    const client = useSupabase();
    const mutationFn = async (id: string) => await deleteMessageById(client, id);

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useUploadMessageImage() {
    const client = useSupabase();

    const mutationFn = async ({ filePath, file }: { filePath: string, file: File | Blob }) => {
        return await uploadMessageImage(client, filePath, file);
    }

    return useMutation({ mutationFn });
}