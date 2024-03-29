import { useEffect } from 'react'
import { useGetProfileById, useUpdateProfile } from '../../hooks/useProfile'
import { useDeleteAvatar, useUploadAvatar } from '../../hooks/useAvatar'
import { Outlet, useNavigate } from 'react-router-dom'
import { LoadingSpinner } from "../../components/ui/LoadingSpinner"
import { Separator } from "../../components/ui/separator"
import { SidebarNav } from '../../components/ProfileSidebarNav'
import { Session } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'

const sidebarNavItems = [
    {
        title: "Account",
        href: "/account",
    },
    {
        title: "Profile",
        href: "/account/profile",
    },
    {
        title: "Notifications",
        href: "/account/notifications",
    }
]

export const Account = () => {
    const navigate = useNavigate();
    const uploadAvatarQuery = useUploadAvatar();
    const deleteAvatarQuery = useDeleteAvatar();
    const updateProfileQuery = useUpdateProfile();
    const { data: session } = useQuery<Session>({ queryKey: ['session'] });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isUpdating = updateProfileQuery.isPending || uploadAvatarQuery.isPending || deleteAvatarQuery.isPending;
    const { data: profile, error: profileError, isLoading: profileLoading } = useGetProfileById(session?.user.id || '', !!session?.user.id);

    useEffect(() => {
        if ((!session) && !profileLoading) navigate("/login");
        if (profileError) navigate("/login");
    }, [session, navigate, profileLoading, profileError]);

    if (profileLoading || !profile) return <LoadingSpinner />
    if (!session) return <LoadingSpinner />

    return (
        <>
            <div className="space-y-6 p-10 pb-16 md:block">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and set e-mail preferences.
                    </p>
                </div>
                <Separator className="my-6" />
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        <SidebarNav items={sidebarNavItems} />
                    </aside>
                    <Outlet />
                </div>
            </div>
        </>
    )
}
