import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDogById, getDogsByOwnerId, updateDog } from "../queries/dogQueries";
import { Tables } from "../utils/database.types";
import useSupabase from "./useSupabase";

export function useGetDogById(id: string, enabled = true) {
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

    const mutationFn = async (params: { id: string; data: Partial<Tables<'dogs'>>; }) => {
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

export function useGetOwnersDogsById(id: string) {
    const client = useSupabase();
    const queryKey = ['dogs', id];

    const queryFn = async () => {
        return await getDogsByOwnerId(client, id).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useDogsByOwner(ownerId: string) {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ['mydogs'],
        queryFn: () => getDogsByOwnerId(client, ownerId)
            .then(result => {
                const dogs = result.data || [];
                dogs.map(dog => queryClient.setQueryData(['dog', dog.id], dog));
                return dogs;
            }),
        enabled: !!ownerId,
    });
    return { data, isLoading, error };
}