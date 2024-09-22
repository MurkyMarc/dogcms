import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteWalkById, getWalkById, updateWalk, createWalk, getWalksByCustomerIdAndDateRange, getWalksByWalkerIdAndDateRange, updateWalkStatus } from "../queries/walkQueries";
import { Tables } from "../../utils/database.types";
import useSupabase from "./useSupabase";
import { useLocation, useNavigate } from "react-router-dom";
import { errorToast, loadingToast, successToast } from "../../utils/helpers";
import { createDogWalksByDogIds, deleteDogWalksByDogIds } from "../queries/dogWalksQueries";
import { WalkStatus } from "../types";

export function useGetWalkById(id: string) {
    const client = useSupabase();
    const queryClient = useQueryClient();
    const queryKey = ['walks', id];

    const queryFn = async () => {
        return await getWalkById(client, id).then(
            (result) => {
                const walk = result?.data;
                walk && (walk.dogs as Array<Tables<'dogs'>>).map(dog => {
                    queryClient.setQueryData(['dogs', `${dog.id}`], dog);
                });
                return walk as Tables<'walks_with_dogs'>;
            }
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useCreateWalk() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (walk: Partial<Tables<'walks'>>) => {
        return await createWalk(client, walk).then(
            (result) => result.data
        );
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: () => {
            successToast("Your walk has been scheduled!");
            queryClient.invalidateQueries({ queryKey: ['walks'] });
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

// todo - restrict this to the owner or an admin

type WalkUpdate = {
    id: number;
    start: string;
    end: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    notes: string;
    subtitle: string;
}

interface UseUpdateWalkParams {
    walk: WalkUpdate;
    addedDogIds: number[];
    removedDogIds: number[];
}

export function useUpdateWalk() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async ({ walk, addedDogIds, removedDogIds }: UseUpdateWalkParams) => {
        // update walk and create/delete dog_walks in parallel
        const promises = [];
        promises.push(updateWalk(client, walk));
        if (addedDogIds.length > 0) promises.push(createDogWalksByDogIds(client, walk.id, addedDogIds));
        if (removedDogIds.length > 0) promises.push(deleteDogWalksByDogIds(client, walk.id, removedDogIds));
        await Promise.all(promises);
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['walks'] });
            successToast("Updated successfully.")
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useGetWalksByCustomerIdAndDateRange(id: string, startDate: string, endDate: string, periodType: 'day' | 'week' | 'month') {
    const client = useSupabase();
    const queryClient = useQueryClient();
    const queryKey = ['walks', 'customer', id, periodType, startDate];

    const queryFn = async () => {
        return await getWalksByCustomerIdAndDateRange(client, id, startDate, endDate).then(
            (result) => {
                const walks = result.data || [];
                walks.map(walk => {
                    queryClient.setQueryData(['walks', `${walk.id}`], walk);
                    (walk.dogs as Array<Tables<'dogs'>>).map(dog => {
                        queryClient.setQueryData(['dogs', `${dog.id}`], dog);
                    })
                });
                return walks;
            }
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useGetWalksByWalkerIdAndDateRange(id: string, startDate: string, endDate: string, periodType: 'day' | 'week' | 'month') {
    const client = useSupabase();
    const queryClient = useQueryClient();
    const queryKey = ['walks', 'walker', id, periodType, startDate];

    const queryFn = async () => {
        return await getWalksByWalkerIdAndDateRange(client, id, startDate, endDate).then(
            (result) => {
                const walks = result.data || [];
                walks.map(walk => {
                    queryClient.setQueryData(['walks', `${walk.id}`], walk);
                    (walk.dogs as Array<Tables<'dogs'>>).map(dog => {
                        queryClient.setQueryData(['dogs', `${dog.id}`], dog);
                    })
                });
                return walks;
            }
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useUpdateWalkStatus() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async ({id, status}: {id: string, status: WalkStatus}) => {
        return await updateWalkStatus(client, id, status);
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['walks', variables.id] });
            successToast("Updated successfully.")
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useDeleteWalkById() {
    const client = useSupabase();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const mutationFn = async (id: string) => await deleteWalkById(client, id);

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: (_, id) => {
            queryClient.removeQueries({ queryKey: ['conversations', `${id}`] });
            queryClient.removeQueries({
                queryKey: ['walks'],
                exact: false
            });
            queryClient.removeQueries({
                queryKey: ['messages'],
                exact: false
            });

            // If on the page of the deleted walk, navigate to the walks page
            if (location.pathname.startsWith(`/dashboard/walk/${id}`)) {
                navigate('/dashboard/walks');
            }
            successToast("Deleted successfully.");
        },
        onError: (error) => errorToast(error)
    });
}