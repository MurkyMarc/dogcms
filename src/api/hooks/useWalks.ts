import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteWalkById, getWalkWithDogsById, updateWalk, createWalk, getWalksByCustomerIdAndDateRange, getWalksByWalkerIdAndDateRange, getWalksInDateRange, updateWalkerByWalkId, getWalkById } from "../queries/walkQueries";
import { Tables, TablesInsert, TablesUpdate } from "../../utils/database.types";
import useSupabase from "./useSupabase";
import { useLocation, useNavigate } from "react-router-dom";
import { errorToast, getYearMonthStringFromDateString, loadingToast, successToast } from "../../utils/helpers";
import { createDogWalksByDogIds, deleteDogWalksByDogIds } from "../queries/dogWalksQueries";
import { WalkStatus } from "../types";
import { getBeginningOfMonth, getEndOfMonth } from "../../utils/helpers";

export function useGetWalkById(id: string) {
    const client = useSupabase();
    const queryKey = ['walks', id];

    const queryFn = async () => {
        if (!id) return null;
        return await getWalkById(client, id).then(
            (result) => result?.data
        );
    };

    return useQuery({ queryKey, queryFn, enabled: Boolean(id) });
}

export function useGetWalkWithDogsById(id: string) {
    const client = useSupabase();
    const queryClient = useQueryClient();
    const queryKey = ['walks', id];

    const queryFn = async () => {
        if (!id) return null;
        return await getWalkWithDogsById(client, id).then(
            (result) => {
                const walk = result?.data;
                walk && (walk.dogs as Array<Tables<'dogs'>>).map(dog => {
                    queryClient.setQueryData(['dogs', `${dog.id}`], dog);
                });
                return walk as Tables<'walks_with_dogs'>;
            }
        );
    };

    return useQuery({ queryKey, queryFn, enabled: !!id });
}

export function useCreateWalk() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (walk: TablesInsert<'walks'>) => {
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

interface UseUpdateWalkAndDogWalksParams {
    walk: TablesUpdate<'walks'>;
    addedDogIds: number[];
    removedDogIds: number[];
}

export function useUpdateWalkAndDogWalks() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async ({ walk, addedDogIds, removedDogIds }: UseUpdateWalkAndDogWalksParams) => {
        // update walk and create/delete dog_walks in parallel
        const promises = [];
        promises.push(updateWalk(client, walk));
        if (addedDogIds.length > 0 && walk?.id) promises.push(createDogWalksByDogIds(client, walk.id, addedDogIds));
        if (removedDogIds.length > 0 && walk?.id) promises.push(deleteDogWalksByDogIds(client, walk.id, removedDogIds));
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

export function useGetWalksByCustomerIdAndMonth(id: string, months: string[]) {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const queries = months.map(month => ({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: ['walks', 'customer', id, 'month', month],
        queryFn: async () => {
            if (!id || months.length === 0) return null;
            const [year, monthNumber] = month.split('-');
            const startDate = getBeginningOfMonth(new Date(parseInt(year), parseInt(monthNumber) - 1, 1));
            const endDate = getEndOfMonth(new Date(parseInt(year), parseInt(monthNumber) - 1, 1));
            const result = await getWalksByCustomerIdAndDateRange(client, id, startDate, endDate);
            const walks = result.data || [];
            walks.forEach(walk => {
                queryClient.setQueryData(['walks', `${walk.id}`], walk);
                (walk.dogs as Array<Tables<'dogs'>>).forEach(dog => {
                    queryClient.setQueryData(['dogs', `${dog.id}`], dog);
                });
            });
            return walks;
        },
        enabled: !!id
    }));

    const results = useQueries({ queries });

    const isLoading = results.some(result => result.isLoading);
    const flattenedWalks = results.flatMap(result => result.data || []);

    return { data: flattenedWalks, isLoading };
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

export function useUpdateWalk() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async ({ id, status }: { id: string | number, status: WalkStatus }) => {
        if (!id) return;
        const idInt = Number(id);
        return await updateWalk(client, { id: idInt, status });
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

export function useUpdateWalkSchedulePage() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async ({ id, status }: { id: string | number, status: WalkStatus }) => {
        if (!id) return;
        const idInt = Number(id);
        return await updateWalk(client, { id: idInt, status });
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['walks', data?.data?.id || ""] });
            queryClient.invalidateQueries({ queryKey: ['walks', 'month', getYearMonthStringFromDateString(data?.data?.start || "")] });
            successToast("Updated successfully.")
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useUpdateWalkerByWalkId() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async ({ walkId, walkerId }: { walkId: string, walkerId: string | null }) => {
        return await updateWalkerByWalkId(client, `${walkId}`, walkerId);
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: ({ data }) => {
            queryClient.invalidateQueries({ queryKey: ['walks', `${data!.id}`] });
            queryClient.invalidateQueries({ queryKey: ['walks', 'month', getYearMonthStringFromDateString(data!.start)] });
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

    const mutationFn = async (id: string | number) => await deleteWalkById(client, id);

    return useMutation({
        mutationFn,
        onMutate: (id) => {
            loadingToast();
            queryClient.removeQueries({ queryKey: ['walks', `${id}`] });
            queryClient.removeQueries({ queryKey: ['conversations', `${id}`] });
            queryClient.removeQueries({ queryKey: ['messages'], exact: false });
        },
        onSuccess: (_, id) => {
            // If on the page of the deleted walk, navigate to the walks page
            if (location.pathname.startsWith(`/dashboard/walk/${id}`)) {
                navigate('/dashboard/walks');
            }
            successToast("Deleted successfully.");
        },
        onError: (error) => errorToast(error)
    });
}

export function useDeleteWalkByIdSchedulePage() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (walk: Tables<'walks'>) => await deleteWalkById(client, walk.id);

    return useMutation({
        mutationFn,
        onMutate: (walk) => {
            loadingToast();
            queryClient.removeQueries({ queryKey: ['walks', `${walk.id}`] });
            queryClient.removeQueries({ queryKey: ['conversations', `${walk.id}`] });
            queryClient.removeQueries({ queryKey: ['messages'], exact: false });
        },
        onSuccess: (_, walk) => {
            queryClient.invalidateQueries({ queryKey: ['walks', 'month', getYearMonthStringFromDateString(walk.start)] });

            successToast("Deleted successfully.");
        },
        onError: (error) => errorToast(error)
    });
}

export function useGetEmployeeWalksInMonth(months: string[]) {
    const client = useSupabase();
    const queryClient = useQueryClient();

    // Helper function to fetch walks for a specific month
    const fetchWalksForMonth = async (month: string) => {
        const [year, monthNumber] = month.split('-');
        const startDate = new Date(parseInt(year), parseInt(monthNumber) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(monthNumber), 0);
        endDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

        return await getWalksInDateRange(client, startDate, endDate).then(result => result.data);
    };

    // Create an array of query objects, one for each month
    const queries = months.map((month) => ({
        queryKey: ['walks', 'month', month],
        queryFn: () => fetchWalksForMonth(month),
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }));

    // Execute multiple queries in parallel and return combined results
    const results = useQueries({ queries });

    // Combine the data from each query
    const combinedData = results.map((result) => result.data || []).flat();

    combinedData.map(walk => queryClient.setQueryData(['walks', `${walk.id}`], walk));

    // Determine if any query is still loading
    const isLoading = results.some((result) => result.isLoading);

    return { data: combinedData, isLoading };
}