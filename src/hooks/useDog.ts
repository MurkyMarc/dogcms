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

    const mutationFn = (dog: Tables<'dogs'>) => {
        return updateDog(client, dog);
    };

    return useMutation({
        mutationFn,
        onSuccess: (_, dog) => {
            queryClient.setQueryData(['dogs', `${dog.id}`], dog);
        }
    });
}

export function useGetOwnersDogsById(id: string) {
    const client = useSupabase();
    const queryKey = ['dogs', id];

    const queryFn = () => {
        return getDogsByOwnerId(client, id);
    };

    return useQuery({ queryKey, queryFn });
}

export function useGetDogsByOwner(ownerId: string) {
    const client = useSupabase();
    const queryClient = useQueryClient();

    return useQuery({
        queryKey: ['mydogs'],
        queryFn: () => getDogsByOwnerId(client, ownerId)
            .then(result => {
                const dogs = result.data || [];
                dogs.map(dog => queryClient.setQueryData(['dog', `${dog.id}`], dog));
                return dogs;
            }),
        enabled: !!ownerId,
    });
}

export function useUploadDogImage() {
    const client = useSupabase();

    const mutationFn = ({ filePath, file }: { filePath: string, file: File | Blob }) => {
        return uploadDogImage(client, filePath, file);
    }

    return useMutation({ mutationFn });
}

export function useDeleteDogImage() {
    const client = useSupabase();

    const mutationFn = ({ filePath }: { filePath: string }) => {
        return deleteDogImage(client, filePath);
    }

    return useMutation({ mutationFn });
}