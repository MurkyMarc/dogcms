import { Link } from "react-router-dom";
import { MountainIcon } from "./ui/icons/MountainIcon";
import { useSession, useSignOut } from "../hooks/useAuth";
import { useGetProfileById } from "../hooks/useProfile";

export default function Header() {
    const { session } = useSession();
    const signOut = useSignOut();
    const { data: profile } = useGetProfileById(session?.user.id || "", !!session?.user.id);

    return (
        <header className="flex items-center justify-between h-16 px-4 md:px-6">
            <Link className="flex items-center" to="/">
                <MountainIcon className="h-6 w-6" />
                <span className="ml-2 text-xl font-bold">Uptown Dogs</span>
            </Link>
            <div className="flex items-center">
                <span className="ml-2 text-xl font-bold">{profile ? <div>Welcome, {profile.username}</div> : null}</span>
                {session ?
                    <Link
                        className="mr-4 px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-200 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                        to={`/profile`}
                    >
                        My Account
                    </Link> : null
                }
                {session ? null :
                    <Link
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-200 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                        to="/login"
                    >
                        Login
                    </Link>
                }
                {session ? null :
                    <Link
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-200 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                        to="/signup"
                    >
                        Sign Up
                    </Link>
                }
                {session ?
                    <Link
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-200 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                        to="/search"
                    >
                        Search
                    </Link> : null
                }
                {session ?
                    <button
                        className="px-4 py-2 text-sm font-medium rounded-md bg-white border border-gray-200 shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                        onClick={signOut}
                    >
                        Sign Out
                    </button> : null
                }
            </div>
        </header>
    )
}
