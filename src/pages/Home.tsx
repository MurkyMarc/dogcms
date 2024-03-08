import { Link } from "react-router-dom"
import { ClockIcon } from "../components/ui/icons/ClockIcon"
import { DogIcon } from "../components/ui/icons/DogIcon"
import { MapPinIcon } from "../components/ui/icons/MapPinIcon"

export const Home = () => {
    return (
        <div>
            <section className="py-12 lg:py-24 xl:py-32 bg-blue-100">
                <div className="container px-4 md:px-6">
                    <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                Book Your Dog's Next Adventure
                            </h2>
                            <p className="text-gray-500 md:text-xl dark:text-gray-400">
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
            <section className="py-12 lg:py-24 xl:py-32">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Services</h2>
                            <div className="grid gap-4">
                                <ul className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:gap-0 lg:grid-cols-1">
                                    <li className="flex items-start space-x-4">
                                        <DogIcon className="w-6 h-6 flex-shrink-0 text-2xl" />
                                        <div className="space-y-1.5">
                                            <h3 className="text-lg font-semibold">Professional Dogwalkers</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Our experienced dogwalkers are passionate about pets and ensure a safe and enjoyable walking
                                                experience.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-4">
                                        <ClockIcon className="w-6 h-6 flex-shrink-0 text-2xl" />
                                        <div className="space-y-1.5">
                                            <h3 className="text-lg font-semibold">Flexible Scheduling</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Conveniently book walking appointments based on your schedule. Morning, afternoon, or evening -
                                                we've got you covered.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-4">
                                        <MapPinIcon className="w-6 h-6 flex-shrink-0 text-2xl" />
                                        <div className="space-y-1.5">
                                            <h3 className="text-lg font-semibold">GPS Tracking</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Follow your dog's route with our GPS tracking feature. You can see where your furry friend has been
                                                during the walk.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-4">
                                        <MapPinIcon className="w-6 h-6 flex-shrink-0 text-2xl" />
                                        <div className="space-y-1.5">
                                            <h3 className="text-lg font-semibold">Photo Updates</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Receive real-time photo updates of your dog during the walk to stay connected and reassured.
                                            </p>
                                        </div>
                                    </li>
                                    <li className="flex items-start space-x-4">
                                        <MapPinIcon className="w-6 h-6 flex-shrink-0 text-2xl" />
                                        <div className="space-y-1.5">
                                            <h3 className="text-lg font-semibold">Chat with Your Dog Walker</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Stay in touch with your dog walker through our chat feature, ensuring you can communicate anytime.
                                            </p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full py-12 bg-green-100 md:py-24 lg:py-32 dark:bg-gray-800">
                <div className="container flex flex-col items-center justify-center space-y-8 px-4 text-center md:space-y-10 md:px-6">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Happy Paws, Happy Customers</h2>
                        <p className="mx-auto max-w-3xl text-lg text-gray-500 md:text-xl dark:text-gray-400">
                            Dog owners love our service. Here's what they have to say.
                        </p>
                    </div>
                    <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="rounded-full overflow-hidden w-24 h-24">
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
                                <h3 className="text-lg font-bold">Linda Smith</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Dog Lover</p>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                "My dog is always excited when the dog walker arrives. I can tell that they really care about the dogs."
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="rounded-full overflow-hidden w-24 h-24">
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
                                <h3 className="text-lg font-bold">Brian Johnson</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Dog Owner</p>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                “The dog walking service is fantastic. My dog is always happy and tired after the walk. Highly
                                recommended!“
                            </p>
                        </div>
                        <div className="flex flex-col items-center space-y-4">
                            <div className="rounded-full overflow-hidden w-24 h-24">
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
                                <h3 className="text-lg font-bold">Emily White</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Dog Owner</p>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                “The dog walker is always on time and takes great care of my dog. I feel at ease knowing my dog is in good
                                hands.“
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            
        </div>
    )
}
