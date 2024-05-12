import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { errorToast } from "../../utils/helpers";
import { createDogWalksByDogIds, deleteDogWalkById, deleteDogWalksByDogIds, getDogWalkById, getDogWalksByWalkId } from "../queries/dogWalksQueries";

// todo - add restrictions to these

export async function useGetDogWalkById(id: string) {
    const client = useSupabase();
    return await getDogWalkById(client, id);
}

export async function useGetDogWalksByWalkId(walkId: number) {
    const client = useSupabase();
    return await getDogWalksByWalkId(client, walkId);
}

export function useCreateDogWalks() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async ({ walkId, dogIds }: { dogIds: number[], walkId: number }) => {
        return await createDogWalksByDogIds(client, walkId, dogIds);
    };

    return useMutation({
        mutationFn,
        onError: () => {
            errorToast("Unable to assign your dogs to this walk. Please edit the walk and add your dogs.");
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['walks'] });
        },
    });
}

export function useDeleteDogWalkById() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (id: string) => await deleteDogWalkById(client, id);
    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['walks'] });
        },
    });
}

export function useDeleteDogWalksByWalkDogIds() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async ({ walkId, dogIds }: { walkId: number, dogIds: number[] }) => {
        return await deleteDogWalksByDogIds(client, walkId, dogIds);
    };

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['walks'] });
        },
    });
}