import { Package as PackageIcon, Calendar, CreditCard } from 'lucide-react';
import { useGetProducts } from '../../../api/hooks/useStripe';
import Package from './Package';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import TitleNav from '../../../components/TitleNav';

export default function Packages() {
    const { data: products, isLoading: isLoadingProducts } = useGetProducts();

    return (
        <div>
            <TitleNav title="Purchase Dog Walking Credits" />

            <div className="container">
                <p className="text-center mb-8 text-lg">Choose a package that suits your needs or subscribe for regular walks!</p>
                {isLoadingProducts ? <LoadingSpinner className="flex justify-center" /> :
                    <>
                        <h2 className="mb-4 text-2xl text-center font-bold">One Time Purchase</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            {products?.onetime.map((pkg, index) => (
                                <div key={index} className="flex-grow flex-shrink-0 basis-[calc(50%-1.5rem)] lg:basis-[calc(25%-1.5rem)] min-w-[250px]">
                                    <Package key={index} {...pkg} />
                                </div>
                            ))}
                        </div>

                        <h2 className="mb-4 mt-8 text-2xl text-center font-bold">Subscriptions</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            {products?.subscription.map((pkg, index) => (
                                <div key={index} className="flex-grow flex-shrink-0 basis-[calc(50%-1.5rem)] lg:basis-[calc(25%-1.5rem)] min-w-[250px]">
                                    <Package key={index} {...pkg} />
                                </div>
                            ))}
                        </div>
                    </>
                }

                <div className="mt-12 text-center">
                    <h2 className="text-2xl font-semibold mb-4">Why Choose Our Credits System?</h2>
                    <div className="flex flex-wrap justify-center items-start gap-8">
                        <div className="flex flex-col items-center max-w-[200px]">
                            <PackageIcon size={48} className="text-blue-500 mb-2" />
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

        </div>
    );
}