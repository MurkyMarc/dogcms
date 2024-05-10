import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { errorToast } from "../../utils/helpers";
import { createDogWalksByDogIds, deleteDogWalkById, deleteDogWalksByWalkId, getDogWalkById } from "../queries/dogWalksQueries";

// todo - add restrictions to these

export function useGetDogWalksById(id: string) {
    const client = useSupabase();
    const queryKey = ['dog_walks', id];

    const queryFn = async () => {
        return await getDogWalkById(client, id);
    };

    return useQuery({ queryKey, queryFn });
}

export function useCreateDogWalks() {
    const client = useSupabase();

    const mutationFn = async ({ dogIds, walkId }: { dogIds: number[], walkId: number }) => {
        return await createDogWalksByDogIds(client, dogIds, walkId);
    };

    return useMutation({
        mutationFn,
        onError: () => {
            errorToast("Unable to assign your dogs to this walk. Please edit the walk and add your dogs.");
        }
    });
}

export function useDeleteDogWalkById() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (id: string) => await deleteDogWalkById(client, id);
    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dog_walks'] });
        },
    });
}

export function useDeleteDogWalksByWalkId() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (walkId: number) => {
        return await deleteDogWalksByWalkId(client, walkId);
    };

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dog_walks'] });
        }, 
    });
}