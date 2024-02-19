import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileById, updateProfile } from "../queries/profileQueries";
import { Tables } from "../utils/database.types";
import useSupabase from "./useSupabase";

export function useGetProfileById(profileId: string, enabled?: boolean) {
    const client = useSupabase();
    const queryKey = ['profiles', profileId];

    const queryFn = async () => {
        return await getProfileById(client, profileId).then(
            (result) => result.data
        );
    };
    const isValidProfile = (profileId !== "" && enabled === true) ? true : false;
    return useQuery({ queryKey, queryFn, enabled: isValidProfile });
}

export function useUpdateProfile() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (params: { id: string; data: Partial<Tables<'profiles'>>; }) => {
        return await updateProfile(client, params).then(
            (result) => result.data
        );
    };

    return useMutation({
        mutationFn,
        onSuccess: (_, variables) => {
            queryClient.setQueryData(['profiles', variables.id], { id: variables.id, ...variables.data });
        }
    });
}
