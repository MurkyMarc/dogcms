import { Link, Outlet } from "react-router-dom";
import { useSession } from "../hooks/useAuth";
import Footer from "./Footer";
import { useGetProfileById } from "../hooks/useProfile";


export const Navbar = () => {
    const { session } = useSession();
    const { data: profile } = useGetProfileById(session?.user.id || "", !!session?.user.id);

    return (
        <>
            <nav style={{ display: "flex", gap: "1rem" }}>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
                {session ? null : <Link to="/login">Login</Link>}
                {session ? <Link to={`/account/${session.user.id}`}>Account</Link> : null}
                {session ? <Link to="/dashboard">Dashboard</Link> : null}
                {profile ? <div>Welcome, {profile.username}</div> : null}
            </nav>
            <Outlet />
            <Footer />
        </>
    )
}
