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
                <span className="px-4 ml-2 text-xl font-bold">{profile ? <div>Welcome, {profile.username}</div> : null}</span>
                {session ?
                    <Link
                        className="px-4 inline-block text-sm font-medium transition-colors hover:text-gray-500 dark:hover:text-gray-400" 
                        to={`/profile`}
                    >
                        My Account
                    </Link> : null
                }
                {session ? null :
                    <Link
                        className="px-4 inline-block text-sm font-medium transition-colors hover:text-gray-500 dark:hover:text-gray-400"
                        to="/login"
                    >
                        Login
                    </Link>
                }
                {session ? null :
                    <Link
                        className="px-4 inline-block text-sm font-medium transition-colors hover:text-gray-500 dark:hover:text-gray-400" 
                        to="/signup"
                    >
                        Sign Up
                    </Link>
                }
                {session ?
                    <Link
                        className="px-4 inline-block text-sm font-medium transition-colors hover:text-gray-500 dark:hover:text-gray-400" 
                        to="/search"
                    >
                        Search
                    </Link> : null
                }
                {session ?
                    <button
                        className="px-4 inline-block text-sm font-medium transition-colors hover:text-gray-500 dark:hover:text-gray-400" 
                        onClick={signOut}
                    >
                        Sign Out
                    </button> : null
                }
            </div>
        </header>
    )
}
