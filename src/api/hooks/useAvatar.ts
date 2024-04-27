import useSupabase from "./useSupabase";
import { deleteAvatar, uploadAvatar } from "../queries/avatarQueries";
import { useMutation } from "@tanstack/react-query";

export function useUploadAvatar() {
    const client = useSupabase();

    const mutationFn = async ({ filePath, file }: { filePath: string, file: File | Blob }) => {
        return await uploadAvatar(client, filePath, file);
    }

    return useMutation({ mutationFn });
}

export function useDeleteAvatar() {
    const client = useSupabase();

    const mutationFn = async ({ filePath }: { filePath: string }) => {
        return await deleteAvatar(client, filePath);
    }

    return useMutation({ mutationFn });
}