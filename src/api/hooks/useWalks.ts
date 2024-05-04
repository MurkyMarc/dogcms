import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteWalkById, getWalkById, updateWalk } from "../queries/walkQueries";
import { Tables } from "../../utils/database.types";
import useSupabase from "./useSupabase";
import { useLocation, useNavigate } from "react-router-dom";
import { errorToast, loadingToast, successToast } from "../../utils/helpers";

// to do - need to figure out how to efficiently store the walks in the cache.
// will be fetching day walks, weeks walks, and months walks.

export function useGetWalkById(id: string) {
    const client = useSupabase();
    const queryKey = ['walks', id];

    const queryFn = async () => {
        return await getWalkById(client, id).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
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
