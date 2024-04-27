import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfileById, updateProfile } from "../queries/profileQueries";
import { Tables } from "../../utils/database.types";
import useSupabase from "./useSupabase";
import { toast } from "sonner";

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
        onSuccess: ({data: profile}) => {
            queryClient.setQueryData(['myprofile'], profile);
            toast.success("Updated successfully.")
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['myprofile'] });
        }
    });
}
