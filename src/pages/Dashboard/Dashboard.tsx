import { Outlet, useNavigate } from "react-router-dom"
import { Sidebar } from "./components/Sidebar"
import { useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const session = queryClient.getQueryData<Session>(['session']);

    useEffect(() => {
        if (!session) navigate("/login");
    }, [session, navigate]);

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