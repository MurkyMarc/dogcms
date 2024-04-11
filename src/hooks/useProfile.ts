import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileById, updateProfile } from "../queries/profileQueries";
import { Tables } from "../utils/database.types";
import useSupabase from "./useSupabase";

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

export function useGetProfileById(profileId: string, enabled = true) {
    const client = useSupabase();

    const queryFn = async () => {
        return await getProfileById(client, profileId).then(
            (result) => result.data
        );
    };
    const isValidProfile = (profileId !== "" && enabled === true) ? true : false;
    return useQuery({ queryKey: ['profiles', profileId], queryFn, enabled: isValidProfile });
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
