import "https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@11.1.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async () => {
  try {
    const prices = await stripe.prices.list({
      active: true,
      expand: ['data.product']
    });

    type FormattedPrice = {
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

    const formatPrice = (price: Stripe.Price): FormattedPrice => ({
      priceId: price.id,
      productId: price.product.id as string,
      price: price.unit_amount / 100,
      currency: price.currency,
      type: price.type,
      interval: price.type === 'recurring' ? price.recurring?.interval : 'one_time',
      credits: parseInt(price.product.metadata.credits),
      active: price.active,
      name: price.product.name
    });

    const creditPackages = {
      onetime: [] as FormattedPrice[],
      subscription: [] as FormattedPrice[]
    };

    prices.data.forEach((price: { type: string; active: boolean; }) => {
      const formattedPrice = formatPrice(price);
      if (price.type === 'one_time' && price.active) {
        creditPackages.onetime.push(formattedPrice);
      } else if (price.type === 'recurring' && price.active) {
        creditPackages.subscription.push(formattedPrice);
      }
    });

    creditPackages.onetime.sort((a, b) => a.price - b.price);
    creditPackages.subscription.sort((a, b) => a.price - b.price);

    return new Response(
      JSON.stringify(creditPackages),
      {
        headers:
          {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS"
          },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
})