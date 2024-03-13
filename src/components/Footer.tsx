import { Link } from "react-router-dom";
import { FacebookIcon } from "./ui/icons/FacebookIcon";
import { InstagramIcon } from "./ui/icons/InstagramIcon";
import { TwitterIcon } from "./ui/icons/TwitterIcon";

export default function Footer() {
    return (
        <section className="">
            <div className="bg-gray-100">
                <div className="max-w-screen-lg py-10 px-4 sm:px-6 text-gray-800 sm:flex justify-between mx-auto">
                    <div className="p-5 sm:w-2/12 border-r">
                        <div className="text-sm uppercase text-blue-800 font-bold">Menu</div>
                        <ul>
                            <li className="my-2">
                                <Link className="hover:text-blue-800" to="#">FAQ</Link>
                            </li>
                            <li className="my-2">
                                <Link className="hover:text-blue-800" to="#">Contact Us</Link>
                            </li>
                            <li className="my-2">
                                <Link className="hover:text-blue-800" to="#">Terms of Service</Link>
                            </li>
                            <li className="my-2">
                                <Link className="hover:text-blue-800" to="#">Plans</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="p-5 sm:w-7/12 border-r text-center">
                        <h3 className="font-bold text-xl text-blue-800 mb-4">Uptown Dogs</h3>
                        <p className="text-gray-500 text-sm mb-10">
                            Thank you for visiting us and being a cherished part of our community.
                            Your trust and support inspire us every day, fueling our commitment to providing you and your beloved furry friends with the highest quality service and care. 
                        </p>
                    </div>
                    <div className="p-5 sm:w-3/12">
                        <div className="text-sm uppercase text-blue-800 font-bold">Contact Us</div>
                        <ul>
                            <li className="my-2">
                                <Link className="hover:text-blue-800" to="#">123 Main Street, Floor 4 Brooklyn, NY 10001</Link>
                            </li>
                            <li className="my-2">
                                <Link className="hover:text-blue-800" to="#">contact@company.com</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="flex py-5 m-auto text-gray-800 text-sm flex-col items-center border-t max-w-screen-xl">
                    <div className="md:flex-auto md:flex-row-reverse mt-2 flex-row flex">
                        <Link to="#" className="w-6 mx-1">
                            <FacebookIcon />
                        </Link>
                        <Link to="#" className="w-6 mx-1">
                            <InstagramIcon />
                        </Link>
                        <Link to="#" className="w-6 mx-1">
                            <TwitterIcon />
                        </Link>
                    </div>
                    <div className="my-5">© Copyright 2023. All Rights Reserved.</div>
                </div>
            </div>
        </section>
    )
}