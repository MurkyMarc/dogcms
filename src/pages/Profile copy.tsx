import { TabsTrigger, TabsList, TabsContent, Tabs } from "../components/ui/tabs"
import { useEffect } from 'react'
import { useGetProfileById, useUpdateProfile } from '../hooks/useProfile'
import { useDeleteAvatar, useUploadAvatar } from '../hooks/useAvatar'
import { useNavigate } from 'react-router-dom'
import { ProfileUserInfo } from "../components/ProfileUserInfo"
import { ProfileAddress } from "../components/ProfileAddress"
import { ProfileEmergencyContacts } from "../components/ProfileEmergencyContacts"
import { ProfilePaymentInfo } from "../components/ProfilePaymentInfo"
import { ProfilePageAvatar } from "../components/ProfilePageAvatar"
import { LoadingSpinner } from "../components/ui/LoadingSpinner"
import { Session } from "@supabase/supabase-js"
import { useQuery } from "@tanstack/react-query"

export const Profile = () => {
    const navigate = useNavigate();
    const uploadAvatarQuery = useUploadAvatar();
    const deleteAvatarQuery = useDeleteAvatar();
    const updateProfileQuery = useUpdateProfile();
    const { data: session } = useQuery<Session>({ queryKey: ['session'] });
    const isUpdating = updateProfileQuery.isPending || uploadAvatarQuery.isPending || deleteAvatarQuery.isPending;
    const { data: profile, error: profileError, isLoading: profileLoading } = useGetProfileById(session?.user.id || '', !!session?.user.id);

    useEffect(() => {
        if ((!session) && !profileLoading) navigate("/login");
        if (profileError) navigate("/login");
    }, [session, navigate, profileLoading, profileError]);

    if (profileLoading || !profile) return <LoadingSpinner />
    if (!session) return <LoadingSpinner />

    return (
        <div className="flex flex-col items-center space-y-4 mt-24">
            <div className="flex flex-col items-center">
                <ProfilePageAvatar isUpdating={false} profile={profile} />
                <div className="text-center pt-4">
                    <div className="font-semibold">{profile.full_name}</div>
                    <div className="text-gray-500 dark:text-gray-400">{session.user.email}</div>
                </div>
            </div>
            <Tabs className="w-full max-w-3xl" defaultValue="user">
                <TabsList className="grid grid-cols-4 gap-2 my-10">
                    <TabsTrigger value="user">User Info</TabsTrigger>
                    <TabsTrigger value="address">Address</TabsTrigger>
                    <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
                    <TabsTrigger value="payment">Payment Info</TabsTrigger>
                </TabsList>
                <TabsContent value="user">
                    <ProfileUserInfo isUpdating={isUpdating} isLoading={profileLoading} profile={profile} />
                </TabsContent>
                <TabsContent value="address">
                    <ProfileAddress isUpdating={isUpdating} isLoading={profileLoading} profile={profile} />
                </TabsContent>
                <TabsContent value="emergency">
                    <ProfileEmergencyContacts isUpdating={isUpdating} isLoading={profileLoading} profile={profile} />
                </TabsContent>
                <TabsContent value="payment">
                    <ProfilePaymentInfo isUpdating={isUpdating} isLoading={profileLoading} profile={profile} />
                </TabsContent>
            </Tabs>
        </div>
    )
}

