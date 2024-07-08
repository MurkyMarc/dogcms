import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { StripeProduct } from '../../../api/queries/stripeQueries';

export default function Package({ productId, name, credits, price, type, interval }: StripeProduct) {
    return (
        <Card id={productId} className="flex flex-col justify-between w-full">
        <CardHeader>
                <CardTitle className="text-xl font-bold">{name}</CardTitle>
                <CardDescription>{type === "recurring" ? `${credits} credits/${interval}` : `${credits} credits`}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold text-center">${price}</div>
            <div className="text-center text-gray-500">{type === "recurring" ? `per ${interval}` : 'one-time purchase'}</div>
        </CardContent>
        <CardFooter>
            <Button className="w-full">
                {type === "recurring" ? 'Subscribe' : 'Purchase'}
            </Button>
        </CardFooter>
    </Card>
    );
}