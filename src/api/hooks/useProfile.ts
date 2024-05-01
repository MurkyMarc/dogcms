import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAvatar, getProfileById, updateProfile, uploadProfileAvatar } from "../queries/profileQueries";
import { Tables } from "../../utils/database.types";
import useSupabase from "./useSupabase";
import { errorToast, loadingToast, successToast } from "../../utils/helpers";

export function useGetMyProfileById(profileId: string, enabled = true) {
    const client = useSupabase();

    const queryFn = async () => {
        return await getProfileById(client, profileId).then(
            (result) => result.data
        );
    };
    const isValidProfile = (profileId !== "" && enabled === true) ? true : false;
    return useQuery({ queryKey: ['myprofile'], queryFn, enabled: isValidProfile });
}

export function useGetProfileById(profileId: string) {
    const client = useSupabase();

    const queryFn = async () => {
        return await getProfileById(client, profileId).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey: ['profiles', profileId], queryFn });
}

export function useUpdateProfile() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (profile: Partial<Tables<'profiles'>>) => {
        return await updateProfile(client, profile);
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: ({ data: profile }) => {
            queryClient.setQueryData(['myprofile'], profile);
            successToast("Updated successfully.")
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useUploadAvatar() {
    const client = useSupabase();

    const mutationFn = async ({ filePath, file }: { filePath: string, file: File | Blob }) => {
        return await uploadProfileAvatar(client, filePath, file);
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