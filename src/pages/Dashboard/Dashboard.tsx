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
        <div className="block border-t bg-background">
            <div className="md:grid md:grid-cols-6">
                <Sidebar className="hidden lg:block lg:col-span-1" />
                <div className="md:col-span-6 lg:col-span-5 border-l">
                    <div className="h-full px-4 py-4 lg:px-8">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    )
}