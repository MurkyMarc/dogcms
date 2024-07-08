import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../queries/stripeQueries";

export function useGetProducts() {
    const queryFn = async () => {
        return await getProducts()
    };

    return useQuery({ queryKey: ['products'], queryFn });
}