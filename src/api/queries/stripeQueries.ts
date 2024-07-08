const supabaseFunctionUrl = import.meta.env.VITE_SUPABASE_URL;

export type StripeProduct = {
    priceId: string;
    productId: string;
    price: number;
    currency: string;
    type: string;
    interval: string;
    credits: number;
    active: boolean;
    name: string;
}

export type StripeProductsResponse = {
    onetime: StripeProduct[];
    subscription: StripeProduct[];
}

export async function getProducts() {
    return await fetch(`${supabaseFunctionUrl}/functions/v1/fetchCreditPackages`).then(res => res.json() as Promise<StripeProductsResponse>);
}