import useSupabase from "./useSupabase";
import { getAvatar, uploadAvatar } from "../queries/avatarQueries";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAvatar(url: string) {
    const client = useSupabase();
    const queryKey = ['avatars', url];

    const queryFn = async () => {
        return getAvatar(client, url).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useUploadAvatar(filePath: string, file: any) {
    const client = useSupabase();
    const queryClient = useQueryClient();
    const queryKey = ['avatars', filePath];

    const mutationFn = async () => {
        return uploadAvatar(client, filePath, file).then(
            (result) => result.data
        );
    };

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.setQueryData(queryKey, file);
        }
    });
}
