import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addPrice, deletePrice, getWalkPrices, updatePrice } from "../queries/pricingQueries";
import { TablesInsert, TablesUpdate } from "../../utils/database.types";
import useSupabase from "./useSupabase";
import { errorToast, loadingToast, successToast } from "../../utils/helpers";

export function useGetWalkPrices() {
    const client = useSupabase();
    const queryKey = ['prices'];

    const queryFn = async () => {
        return await getWalkPrices(client).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useUpdatePrice() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (price: TablesUpdate<'service_prices'>) => updatePrice(client, price),
        onMutate: () => loadingToast(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prices'] });
            successToast("Price updated successfully.");
        },
        onError: (error) => {
            errorToast(error);
        }
    });
}

export function useDeletePrice() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (id: string) => {
        return await deletePrice(client, id);
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['prices', `${id}`] });
            successToast("Price deleted successfully.");
        },
        onError: (error) => {
            errorToast(error);
        }
    });
}

export function useAddPrice() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (price: TablesInsert<'service_prices'>) => {
        return await addPrice(client, price);
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['prices'] });
            successToast("Price added successfully.");
        },
        onError: (error) => {
            errorToast(error);
        }
    });
}