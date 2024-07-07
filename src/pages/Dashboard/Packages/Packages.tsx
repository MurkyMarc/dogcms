import { Package, Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

interface CreditPackageProps {
    title: string;
    credits: number;
    price: number;
    isSubscription: boolean;
    interval?: string;
}

const CreditPackage = ({ title, credits, price, isSubscription, interval }: CreditPackageProps) => (
    <Card className="flex flex-col justify-between w-full">
        <CardHeader>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            <CardDescription>{isSubscription ? `${credits} credits/${interval}` : `${credits} credits`}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-bold text-center">${price}</div>
            <div className="text-center text-gray-500">{isSubscription ? `per ${interval}` : 'one-time purchase'}</div>
        </CardContent>
        <CardFooter>
            <Button className="w-full">
                {isSubscription ? 'Subscribe' : 'Purchase'}
            </Button>
        </CardFooter>
    </Card>
);

export default function Packages() {
    const packages = [
        { title: "Starter Pack", credits: 10, price: 50, isSubscription: false },
        { title: "Starter Plus", credits: 25, price: 100, isSubscription: false },
        { title: "Walker's Delight", credits: 50, price: 150, isSubscription: false },
        { title: "Monthly Walks", credits: 20, price: 80, isSubscription: true, interval: "month" },
        { title: "Frequent Walker", credits: 50, price: 180, isSubscription: true, interval: "month" },
        { title: "Walker Plus", credits: 100, price: 300, isSubscription: true, interval: "month" }
    ] as const;

    return (
        <div className="container mx-auto px-8 py-8">
            <h1 className="pt-8 text-4xl font-bold text-center mb-8">Purchase Dog Walking Credits</h1>
            <p className="text-center mb-8 text-lg">Choose a package that suits your needs or subscribe for regular walks!</p>

            <div className="flex flex-wrap justify-center gap-6">
                {packages.map((pkg, index) => (
                    <div key={index} className="flex-grow flex-shrink-0 basis-[calc(50%-1.5rem)] lg:basis-[calc(25%-1.5rem)] min-w-[250px]">
                        <CreditPackage key={index} {...pkg} />
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center">
                <h2 className="text-2xl font-semibold mb-4">Why Choose Our Credits System?</h2>
                <div className="flex flex-wrap justify-center items-start gap-8">
                    <div className="flex flex-col items-center max-w-[200px]">
                        <Package size={48} className="text-blue-500 mb-2" />
                        <h3 className="text-lg font-semibold">Flexible Packages</h3>
                        <p className="text-sm text-gray-600">Choose the perfect amount for your needs</p>
                    </div>
                    <div className="flex flex-col items-center max-w-[200px]">
                        <Calendar size={48} className="text-green-500 mb-2" />
                        <h3 className="text-lg font-semibold">Convenient Subscriptions</h3>
                        <p className="text-sm text-gray-600">Never run out of walks with monthly credits</p>
                    </div>
                    <div className="flex flex-col items-center max-w-[200px]">
                        <CreditCard size={48} className="text-purple-500 mb-2" />
                        <h3 className="text-lg font-semibold">Secure Payments</h3>
                        <p className="text-sm text-gray-600">Your transactions are always protected</p>
                    </div>
                </div>
            </div>
        </div>
    );
}