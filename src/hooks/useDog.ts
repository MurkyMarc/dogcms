import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDogById, updateDog } from "../queries/dogQueries";
import { Tables } from "../utils/database.types";
import useSupabase from "./useSupabase";

export function useGetDogById(id: number, enabled?: boolean) {
    const client = useSupabase();
    const queryKey = ['dogs', id];

    const queryFn = async () => {
        return await getDogById(client, id).then(
            (result) => result.data
        );
    };
    const isValidDog = (id && enabled === true) ? true : false;
    return useQuery({ queryKey, queryFn, enabled: isValidDog });
}

export function useUpdateDog() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (params: { id: number; data: Partial<Tables<'dogs'>>; }) => {
        return await updateDog(client, params).then(
            (result) => result.data
        );
    };

    return useMutation({
        mutationFn,
        onSuccess: (_, variables) => {
            queryClient.setQueryData(['dogs', variables.id], { id: variables.id, ...variables.data });
        }
    });
}
