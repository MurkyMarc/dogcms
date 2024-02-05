import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileById, updateProfile } from "../queries/profileQueries";
import { Tables } from "../utils/database.types";
import useSupabase from "./useSupabase";

export function useGetProfileById(profileId: string) {
    const client = useSupabase();
    const queryKey = ['profiles', profileId];

    const queryFn = async () => {
        return getProfileById(client, profileId).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useUpdateProfile() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (params: { id: string; data: Partial<Tables<'profiles'>>; }) => {
        return updateProfile(client, params).then(
            (result) => result.data
        );
    };

    return useMutation({
        mutationFn,
        onSuccess: (_data, variables) => {
            queryClient.setQueryData(['profiles', variables.id], { id: variables.id, ...variables.data });
        }
    });
}
