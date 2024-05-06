import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteWalkById, getWalkById, updateWalk, createWalk, getWalksByCustomerIdAndDateRange, getWalksByWalkerIdAndDateRange } from "../queries/walkQueries";
import { Tables } from "../../utils/database.types";
import useSupabase from "./useSupabase";
import { useLocation, useNavigate } from "react-router-dom";
import { errorToast, loadingToast, successToast } from "../../utils/helpers";

export function useGetWalksById(id: string) {
    const client = useSupabase();
    const queryKey = ['walks', id];

    const queryFn = async () => {
        return await getWalkById(client, id).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useCreateWalk() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (walk: Partial<Tables<'walks'>>) => {
        return await createWalk(client, walk);
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: () => {
            successToast("Created successfully.");
            queryClient.invalidateQueries({ queryKey: ['walks'] });
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

// todo - restrict this to the owner or an admin
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
            queryClient.removeQueries({ queryKey: ['walks', `${id}`] });
            if (location.pathname.startsWith('/dashboard/walks/')) {
                navigate('/dashboard');
            }
            successToast("Deleted successfully.");
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useUpdateWalk() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (walk: Partial<Tables<'walks'>>) => {
        return await updateWalk(client, walk);
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: ({ data: walk }) => {
            queryClient.setQueryData(['walks', `${walk?.id}`], walk);
            successToast("Updated successfully.")
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useGetWalksByCustomerIdAndDateRange(id: string, startDate: string, endDate: string, periodType: 'day' | 'week' | 'month') {
    const client = useSupabase();
    const queryKey = ['walks', 'customer', id, periodType, startDate];

    const queryFn = async () => {
        return await getWalksByCustomerIdAndDateRange(client, id, startDate, endDate).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useGetWalksByWalkerIdAndDateRange(id: string, startDate: string, endDate: string, periodType: 'day' |'week' | 'month') {
    const client = useSupabase();
    const queryKey = ['walks', 'walker', id, periodType, startDate];

    const queryFn = async () => {
        return await getWalksByWalkerIdAndDateRange(client, id, startDate, endDate).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}
