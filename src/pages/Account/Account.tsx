import { Outlet, useNavigate } from 'react-router-dom'
import { Separator } from "../../components/ui/separator"
import { SidebarNav } from './components/SidebarNav'
import { useEffect } from 'react'
import { useSession } from '../../api/hooks/useAuth'
import { MenuButton } from '../Dashboard/components/MenuButton'

export const Account = () => {
    const navigate = useNavigate();
    const { data: session, isFetched } = useSession();

    useEffect(() => {
        if (isFetched && !session) navigate("/login");
    }, [session, isFetched, navigate]);

    return (
        <div className="space-y-6 p-10 pb-16 md:block">
            <div className="flex items-center">
                <MenuButton className="mr-4" />
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">My Account</h2>
                    <p className="text-muted-foreground hidden lg:block">
                        Manage your account settings and set preferences.
                    </p>
                </div>
            </div>

            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="lg:w-1/5">
                    <SidebarNav />
                </aside>
                <Outlet />
            </div>
        </div>
    )
}
