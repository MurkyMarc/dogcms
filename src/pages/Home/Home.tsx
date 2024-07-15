import { Link } from "react-router-dom"
import { Card, CardContent } from "../../components/ui/card";
import dogImage from '/walkingdog.jpeg';
import nySkyline from '/nyskyline.jpeg';
import { Carousel, CarouselApi, CarouselContent, CarouselItem } from "../../components/ui/carousel";
import { useEffect, useState } from "react";
import { Camera, Clock, Dog, MapPin, MessagesSquareIcon } from "lucide-react";

export const Home = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;

        const timer = setTimeout(() => {
            if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
                setCurrent(0);
                api.scrollTo(0);
            } else {
                api.scrollNext();
                setCurrent(current + 1);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [api, current]);

    return (
        <div className="w-full">
            <section className="py-24 lg:py-24 xl:py-36 bg-blue-100" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.30), rgba(0, 0, 0, 0.30)), url(${dogImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container px-4 md:px-6">
                    <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                        <div className="space-y-2">
                            <h2 className="text-white text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Book Your Dog's Next Adventure
                            </h2>
                            <p className="text-white md:text-xl dark:text-gray-400">
                                Professional dogwalkers at your service. Schedule walks whenever you need. Track your dog's journey.
                            </p>
                            <Link
                                className="inline-flex h-10 items-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                                to="#"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="w-full">
                    <div className="container mx-auto">
                        <div className="flex gap-4 py-20 lg:py-40 flex-col items-start">
                            <div className="flex gap-2 flex-col">
                                <h2 className="font-bold text-3xl md:text-5xl tracking-tighter lg:max-w-xl">
                                    Our Services
                                </h2>
                                <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
                                    Reliable, convenient, and affordable
                                </p>
                            </div>
                            <div className="flex gap-10 pt-12 flex-col w-full">
                                <div className="grid grid-cols-1 sm:grid-cols-2 items-start lg:grid-cols-3 gap-10">
                                    <div className="flex flex-row gap-6 w-full items-start">
                                        <Dog className="w-6 h-6" />
                                        <div className="flex flex-col gap-1 text-lg">
                                            <p>Professional Dogwalkers</p>
                                            <p className="text-muted-foreground text-sm">
                                                Our experienced dogwalkers are passionate about pets and ensure a safe and enjoyable walking
                                                experience.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-6 items-start">
                                        <Clock className="w-6 h-6" />
                                        <div className="flex flex-col gap-1 text-lg">
                                            <p>Flexible Scheduling</p>
                                            <p className="text-muted-foreground text-sm">
                                                Conveniently book walking appointments based on your schedule. Morning, afternoon, or evening -
                                                we've got you covered.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-6 items-start">
                                        <MapPin className="w-6 h-6" />
                                        <div className="flex flex-col gap-1 text-lg">
                                            <p>GPS Tracking</p>
                                            <p className="text-muted-foreground text-sm">
                                                Follow your dog's route with our GPS tracking feature. You can see where your furry friend has been
                                                during the walk.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-6 w-full items-start">
                                        <Camera className="w-6 h-6" />
                                        <div className="flex flex-col gap-1 text-lg">
                                            <p>Photo Updates</p>
                                            <p className="text-muted-foreground text-sm">
                                                Receive real-time photo updates of your dog during the walk to stay connected and reassured.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-6 items-start">
                                        <MessagesSquareIcon className="w-6 h-6" />
                                        <div className="flex flex-col gap-1 text-lg">
                                            <p>Chat with Your Dog Walker</p>
                                            <p className="text-muted-foreground text-sm">
                                                Stay in touch with your dog walker through our chat feature, ensuring you can communicate anytime.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-6 items-start">
                                        <Dog className="w-6 h-6" />
                                        <div className="flex flex-col gap-1 text-lg">
                                            <p>Placeholder</p>
                                            <p className="text-muted-foreground text-sm">
                                                Stay in touch with your dog walker through our chat feature, ensuring you can communicate anytime.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800">
                <div className="container flex flex-col items-center justify-center space-y-8 px-4 text-center md:space-y-10 md:px-6">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Happy Paws, Happy Customers</h2>
                        <p className="mx-auto max-w-3xl text-lg text-gray-500 md:text-xl dark:text-gray-400">
                            Dog owners love our service. Here's what they have to say.
                        </p>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
                        <div className="flex flex-col items-center space-y-4">
                            <Card className="w-full max-w-sm p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                                <CardContent>
                                    <div className="rounded-full overflow-hidden w-24 h-24 flex items-center justify-center mx-auto mt-4 mb-8">
                                        <img
                                            alt="User 1"
                                            className="rounded-full object-cover object-center"
                                            height="120"
                                            src="/placeholder.svg"
                                            style={{
                                                aspectRatio: "120/120",
                                                objectFit: "cover",
                                            }}
                                            width="120"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">Linda Smith</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Dog Lover</p>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        “My dog is always excited when the dog walker arrives. I can tell that they really care about the
                                        dogs.“
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <Card className="w-full max-w-sm p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                                <CardContent>
                                    <div className="rounded-full overflow-hidden w-24 h-24 flex items-center justify-center mx-auto mt-4 mb-8">
                                        <img
                                            alt="User 2"
                                            className="rounded-full object-cover object-center"
                                            height="120"
                                            src="/placeholder.svg"
                                            style={{
                                                aspectRatio: "120/120",
                                                objectFit: "cover",
                                            }}
                                            width="120"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">Brian Johnson</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Dog Owner</p>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        “The dog walking service is fantastic. My dog is always happy and tired after the walk. Highly
                                        recommended!“
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <Card className="w-full max-w-sm p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                                <CardContent>
                                    <div className="rounded-full overflow-hidden w-24 h-24 flex items-center justify-center mx-auto mt-4 mb-8">
                                        <img
                                            alt="User 3"
                                            className="rounded-full object-cover object-center"
                                            height="120"
                                            src="/placeholder.svg"
                                            style={{
                                                aspectRatio: "120/120",
                                                objectFit: "cover",
                                            }}
                                            width="120"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">Emily White</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Dog Owner</p>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        “The dog walker is always on time and takes great care of my dog. I feel at ease knowing my dog is in
                                        good hands.“
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="w-full py-20 lg:py-40">
                    <div className=" mx-8 md:container md:mx-auto">
                        <div className="flex flex-col  gap-10">
                            <h2 className="text-xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-left">
                                Trusted by the community
                            </h2>
                            <Carousel setApi={setApi} className="w-full">
                                <CarouselContent>
                                    {Array.from({ length: 7 }).map((_, index) => (
                                        <CarouselItem className="basis-1/1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4" key={index}>
                                            <Card className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
                                                <CardContent>
                                                    <div className="rounded-full w-24 h-24 items-center justify-center mx-auto mt-4 mb-8">
                                                        <img
                                                            alt="User 3"
                                                            className="rounded-full object-cover object-center"
                                                            height="120"
                                                            src="/placeholder.svg"
                                                            style={{
                                                                aspectRatio: "120/120",
                                                                objectFit: "cover",
                                                            }}
                                                            width="120"
                                                        />
                                                    </div>
                                                    <div className="text-center">
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">Emily White</h3>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Dog Owner</p>
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        “The dog walker is always on time and takes great care of my dog. I feel at ease knowing my dog is in
                                                        good hands.“
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full py-16 md:py-24 lg:py-32" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)), url(${nySkyline})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="container flex flex-col items-center justify-center space-y-8 px-4 text-center md:space-y-10 md:px-6">
                    <div className="space-y-4">
                        <h2 className="text-white text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Located in NYC</h2>
                        <p className="mx-auto max-w-3xl text-lg text-white md:text-xl dark:text-gray-400">
                            Book a walk today!
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
