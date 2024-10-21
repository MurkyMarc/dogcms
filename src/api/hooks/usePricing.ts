import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPrices, updatePrice } from "../queries/pricingQueries";
import { TablesUpdate } from "../../utils/database.types";
import useSupabase from "./useSupabase";
import { errorToast, loadingToast, successToast } from "../../utils/helpers";

export function useGetPrices() {
    const client = useSupabase();

    return useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: ['prices'],
        queryFn: () => getPrices(client).then(result => result.data)
    });
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

