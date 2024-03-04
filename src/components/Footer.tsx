import { Link } from "react-router-dom";
import { FacebookIcon } from "./ui/icons/FacebookIcon";
import { InstagramIcon } from "./ui/icons/InstagramIcon";
import { TwitterIcon } from "./ui/icons/TwitterIcon";

export default function Footer() {
    return (
        <section className="py-12 lg:py-24 xl:py-32 bg-gray-900 text-gray-50">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About Us</h2>
                        <div className="grid gap-4">
                            <Link className="text-lg font-semibold" to="#">
                                FAQ
                            </Link>
                            <Link className="text-lg font-semibold" to="#">
                                Contact Us
                            </Link>
                            <Link className="text-lg font-semibold" to="#">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center justify-end space-x-4">
                        <Link className="text-gray-50 hover:text-gray-900" to="#">
                            <FacebookIcon className="h-6 w-6" />
                        </Link>
                        <Link className="text-gray-50 hover:text-gray-900" to="#">
                            <InstagramIcon className="h-6 w-6" />
                        </Link>
                        <Link className="text-gray-50 hover:text-gray-900" to="#">
                            <TwitterIcon className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
                <div className="text-center text-sm">© 2024 Dog Adventures. All Rights Reserved.</div>
            </div>
        </section>
    )
}