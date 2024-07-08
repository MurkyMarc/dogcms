import "https://esm.sh/v135/@supabase/functions-js@2.4.1/src/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'

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
      id: string;
      productId: string;
      unitAmount: number;
      currency: string;
      type: string;
      interval: string | null;
      credits: number;
    }

    const formatPrice = (price: Stripe.Price): FormattedPrice => ({
      id: price.id,
      productId: price.product as string,
      unitAmount: price.unit_amount,
      currency: price.currency,
      type: price.type,
      interval: price.type === 'recurring' ? price.recurring?.interval : null,
      credits: parseInt(price.product.metadata.credits || '0'),
    });

    const creditPackages = {
      onetime: [] as FormattedPrice[],
      subscription: [] as FormattedPrice[]
    };

    prices.data.forEach((price: { type: string; }) => {
      const formattedPrice = formatPrice(price);
      if (price.type === 'one_time') {
        creditPackages.onetime.push(formattedPrice);
      } else if (price.type === 'recurring') {
        creditPackages.subscription.push(formattedPrice);
      }
    });

    // Sort packages by price
    creditPackages.onetime.sort((a, b) => a.unitAmount! - b.unitAmount!);
    creditPackages.subscription.sort((a, b) => a.unitAmount! - b.unitAmount!);

    return new Response(
      JSON.stringify(creditPackages),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
})