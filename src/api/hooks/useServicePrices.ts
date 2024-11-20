import { useQuery } from "@tanstack/react-query";
import useSupabase from "./useSupabase";
import { getWalkPrices } from "../queries/pricingQueries";

export function useGetServicePrices() {
    const client = useSupabase();
    const queryKey = ['service_prices'];

    const queryFn = async () => {
        return await getWalkPrices(client).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}
