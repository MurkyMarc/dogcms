import { Link } from "react-router-dom";
import { MountainIcon } from "./ui/icons/MountainIcon";
import { useGetProfileById } from "../hooks/useProfile";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Session } from "@supabase/supabase-js";
import { useSignOut } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

export default function Header() {
    const signOut = useSignOut();
    const queryClient = useQueryClient();
    const session = queryClient.getQueryData<Session>(['session']);
    const { data: profile } = useGetProfileById(session?.user.id || "", !!session, 'myprofile');

    return (
        <header className="flex items-center justify-between w-full h-14 px-4 border-b gap-4 lg:px-6">
            <Link className="flex items-center" to="/">
                <MountainIcon className="h-6 w-6" />
                <span className="hidden xs:block ml-2 text-xl font-bold">Uptown Dogs</span>
            </Link>
            {session ? (
                <div className="flex items-center space-x-2 ml-auto">
                    <span className="hidden xs:block px-3">Hello, {profile?.username}</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="w-8 h-8 rounded-[50%] border-2 border-gray-200 relative" size="icon" variant="ghost">
                                <span className="sr-only">Toggle user menu</span>
                                <img
                                    alt="profile picture"
                                    className="rounded-[50%] object-cover w-full h-full"
                                    width="32"
                                    height="32"
                                    src={"/placeholder.svg"}
                                    style={{
                                        aspectRatio: "32/32",
                                        objectFit: "cover",
                                    }}
                                />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mt-2 w-48 bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-md py-1 focus:outline-none">
                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Link to="/dashboard" className="block w-full">Dashboard</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Link to="/account" className="block w-full">My Account</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Link to="#" className="block w-full">My Dogs</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Link to="/dashboard/schedule" className="block w-full">Schedule</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Link to="/dashboard/messages" className="block w-full">Messages</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <Link to="/dashboard/purchase" className="block w-full">Purchase</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 border-t border-gray-200" />
                            <DropdownMenuItem className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                <button onClick={signOut} className="block w-full text-left">Log Out</button>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : <Link to="/login">Log In</Link>}
        </header>
    );
}
