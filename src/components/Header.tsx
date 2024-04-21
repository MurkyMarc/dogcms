import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useSession, useSignOut } from "../hooks/useAuth";
import { Mountain } from "lucide-react";
import { AccountCard } from "../pages/Account/components/AccountCard";
import { useGetMyProfileById } from "../hooks/useProfile";

export default function Header() {
    const signOut = useSignOut();
    const { data: session } = useSession();
    const { data: profile, isFetched } = useGetMyProfileById(session?.user.id || "", !!session);

    return (
        <header className="flex items-center justify-between w-full h-14 px-4 border-b gap-4 lg:px-6 bg-sky-100">
            <Link className="flex items-center" to="/">
                <Mountain className="h-6 w-6" />
                <span className="hidden xs:block ml-2 text-xl font-bold">Uptown Dogs</span>
            </Link>

            {profile ? (
                <div className="flex items-center space-x-2 ml-auto">
                    {profile.username ? <span className="hidden xs:block px-3">Hello, {profile.username}</span> : <span>Welcome</span>}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="w-8 h-8 rounded-[50%] border-2 border-gray-200 relative" size="icon" variant="ghost">
                                <span className="sr-only">Toggle user menu</span>
                                <AccountCard profile={profile} className="rounded-full object-cover w-full h-full" />
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
            ) : isFetched ? <Link to="/login">Log In</Link> : null}
        </header>
    );
}
