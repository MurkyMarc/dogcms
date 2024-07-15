import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom"
import { useSession } from "../../api/hooks/useAuth";
import { Sidebar } from "./components/Sidebar"

export default function Dashboard() {
    const navigate = useNavigate();
    const { data: session, isFetched } = useSession();

    useEffect(() => {
        if (isFetched && !session) {
            navigate("/login");
        }
    }, [session, isFetched, navigate]);

    return (
        <div className="block bg-background">
            <div className="grid min-h-screen w-full lg:grid-cols-[16rem_1fr]">
                <Sidebar />
                <div className="h-full flex flex-col">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}