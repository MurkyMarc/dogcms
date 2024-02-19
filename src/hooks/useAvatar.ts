import useSupabase from "./useSupabase";
import { deleteAvatar, uploadAvatar } from "../queries/avatarQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tables } from "../utils/database.types";

export function useUploadAvatar() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async ({ filePath, file }: { id: string, filePath: string, file: File | Blob }) => {
        const { data, error } = await uploadAvatar(client, filePath, file);
        return { data, error }
    }

    return useMutation({
        mutationFn,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["profiles", variables.id] });
        },
    });
}

export function useDeleteAvatar() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async ({ filePath }: { profile: Partial<Tables<'profiles'>>, filePath: string }) => {
        await deleteAvatar(client, filePath);
    }

    return useMutation({
        mutationFn,
        onSuccess: (_, variables) => {
            const { profile } = variables;
            queryClient.setQueryData(["profiles", profile.id], { ...profile, avatar_url: null });
        },
    });
}