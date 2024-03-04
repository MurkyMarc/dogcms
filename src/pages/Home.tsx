import { Link } from "react-router-dom"
import { ClockIcon } from "../components/ui/icons/ClockIcon"
import { DogIcon } from "../components/ui/icons/DogIcon"
import { MapPinIcon } from "../components/ui/icons/MapPinIcon"

export const Home = () => {
    return (
        <div className="bg-gray-50/90">
            <section className="py-12 lg:py-24 xl:py-32">
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
                        </ul>
                    </div>
                </div>
            </section>
            <section className="py-12 lg:py-24 xl:py-32">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                        <div className="flex flex-col gap-1.5">
                            <img
                                alt="User"
                                className="rounded-full object-cover border border-gray-200 dark:border-gray-800"
                                height="150"
                                src="/placeholder.svg"
                                style={{
                                    aspectRatio: "150/150",
                                    objectFit: "cover",
                                }}
                                width="150"
                            />
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-gray-900" />
                                <p className="text-sm font-semibold">Rusty's Owner</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                "My dog Rusty absolutely loves his walks with the dogwalkers from this service. They are always so
                                friendly and professional. I can tell that they really care about Rusty's well-being. The GPS tracking
                                feature is a nice touch, and I appreciate being able to see where they've been. I highly recommend this
                                service to all dog owners who want to give their furry friends some extra exercise and fun!"
                            </p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <img
                                alt="User"
                                className="rounded-full object-cover border border-gray-200 dark:border-gray-800"
                                height="150"
                                src="/placeholder.svg"
                                style={{
                                    aspectRatio: "150/150",
                                    objectFit: "cover",
                                }}
                                width="150"
                            />
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-gray-900" />
                                <p className="text-sm font-semibold">Bella's Owner</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                "The dogwalkers from this service are amazing! They are always on time and take great care of my dog
                                Bella. I love the fact that I can track their walk using the GPS feature. It gives me peace of mind to
                                see where they've been. The service is also very convenient to use, and I appreciate the flexibility in
                                scheduling the walks. I highly recommend this service to all dog owners who want to give their furry
                                friends some extra exercise and fun!"
                            </p>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <img
                                alt="User"
                                className="rounded-full object-cover border border-gray-200 dark:border-gray-800"
                                height="150"
                                src="/placeholder.svg"
                                style={{
                                    aspectRatio: "150/150",
                                    objectFit: "cover",
                                }}
                                width="150"
                            />
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-gray-900" />
                                <p className="text-sm font-semibold">Charlie's Owner</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                "I can't thank the dogwalkers enough for the care they provide to my dog Charlie. The GPS tracking
                                feature is a game-changer for me as I can see the exact route they take. The service is reliable, and I
                                feel confident leaving Charlie in their hands. Highly recommended!"
                            </p>
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
                                <div>
                                    <h3 className="text-lg font-semibold">Professional Dogwalkers</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Our experienced dogwalkers are passionate about pets and ensure a safe and enjoyable walking
                                        experience.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Flexible Scheduling</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Conveniently book walking appointments based on your schedule. Morning, afternoon, or evening -
                                        we've got you covered.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">GPS Tracking</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Follow your dog's route with our GPS tracking feature. You can see where your furry friend has been
                                        during the walk.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Photo Updates</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Receive real-time photo updates of your dog during the walk to stay connected and reassured.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Chat with Your Dog Walker</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Stay in touch with your dog walker through our chat feature, ensuring you can communicate anytime.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 lg:py-24 xl:py-32">
                <div className="container px-4 md:px-6">
                    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Reviews</h2>
                            <div className="grid gap-6">
                                <div className="flex items-center space-x-4 justify-center">
                                    <img
                                        alt="User"
                                        className="rounded-full object-cover border border-gray-200 dark:border-gray-800"
                                        height="150"
                                        src="/placeholder.svg"
                                        style={{
                                            aspectRatio: "150/150",
                                            objectFit: "cover",
                                        }}
                                        width="150"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        "My dog Rusty absolutely loves his walks with the dogwalkers from this service. They are always so
                                        friendly and professional. I can tell that they really care about Rusty's well-being. The GPS
                                        tracking feature is a nice touch, and I appreciate being able to see where they've been. I highly
                                        recommend this service to all dog owners who want to give their furry friends some extra exercise
                                        and fun!"
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4 justify-center">
                                    <img
                                        alt="User"
                                        className="rounded-full object-cover border border-gray-200 dark:border-gray-800"
                                        height="150"
                                        src="/placeholder.svg"
                                        style={{
                                            aspectRatio: "150/150",
                                            objectFit: "cover",
                                        }}
                                        width="150"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        "The dogwalkers from this service are amazing! They are always on time and take great care of my dog
                                        Bella. I love the fact that I can track their walk using the GPS feature. It gives me peace of mind
                                        to see where they've been. The service is also very convenient to use, and I appreciate the
                                        flexibility in scheduling the walks. I highly recommend this service to all dog owners who want to
                                        give their furry friends some extra exercise and fun!"
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4 justify-center">
                                    <img
                                        alt="User"
                                        className="rounded-full object-cover border border-gray-200 dark:border-gray-800"
                                        height="150"
                                        src="/placeholder.svg"
                                        style={{
                                            aspectRatio: "150/150",
                                            objectFit: "cover",
                                        }}
                                        width="150"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        "I can't thank the dogwalkers enough for the care they provide to my dog Charlie. The GPS tracking
                                        feature is a game-changer for me as I can see the exact route they take. The service is reliable,
                                        and I feel confident leaving Charlie in their hands. Highly recommended!"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
