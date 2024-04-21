import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDogImage, getDogById, getDogsByOwnerId, updateDog, uploadDogImage } from "../queries/dogQueries";
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

    const mutationFn = async (dog: Partial<Tables<'dogs'>>) => {
        return await updateDog(client, dog);
    };

    return useMutation({
        mutationFn,
        onSuccess: (_, dog) => {
            queryClient.setQueryData(['dogs', `${dog.id}`], dog);
        },
        onSettled: (_response, _error, dog) => {
            queryClient.invalidateQueries({ queryKey: ['dogs', `${dog.id}`] })
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

export function useGetDogsByOwner(ownerId: string) {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const queryFn = async () => {
        return await getDogsByOwnerId(client, ownerId).then(result => {
            const dogs = result.data || [];
            dogs.map(dog => queryClient.setQueryData(['dogs', `${dog.id}`], dog));
            return dogs;
        })
    };

    return useQuery({
        queryKey: ['mydogs'],
        queryFn,
        enabled: !!ownerId,
    });
}

export function useUploadDogImage() {
    const client = useSupabase();

    const mutationFn = async ({ filePath, file }: { filePath: string, file: File | Blob }) => {
        return await uploadDogImage(client, filePath, file);
    }

    return useMutation({ mutationFn });
}

export function useDeleteDogImage() {
    const client = useSupabase();

    const mutationFn = async ({ filePath }: { filePath: string }) => {
        return await deleteDogImage(client, filePath);
    }

    return useMutation({ mutationFn });
}