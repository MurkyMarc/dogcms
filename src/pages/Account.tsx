import { useState, FormEvent, useEffect, ChangeEvent } from 'react'
import Avatar from '../components/Avatar'
import { useGetProfileById, useUpdateProfile } from '../hooks/useProfile'
import { useDeleteAvatar, useUploadAvatar } from '../hooks/useAvatar'
import { useSession, useSignOut } from '../hooks/useAuth'
import { useParams, useNavigate } from 'react-router-dom'
import { generateFilePath } from '../utils/helpers'

export const Account = () => {
    // #region Hooks
    const { id } = useParams();
    const signOut = useSignOut();
    const navigate = useNavigate();
    const { session } = useSession();
    const updateProfileQuery = useUpdateProfile();
    const uploadAvatarQuery = useUploadAvatar();
    const deleteAvatarQuery = useDeleteAvatar();
    const [username, setUsername] = useState("");
    const [website, setWebsite] = useState("");
    const [avatar_url, setAvatarUrl] = useState("");

    const isUpdating = updateProfileQuery.isPending || uploadAvatarQuery.isPending || deleteAvatarQuery.isPending;
    const { data: profile, error: profileError, isLoading: profileLoading } = useGetProfileById(id || '', !!id);
    // #endregion

    useEffect(() => {
        if ((!id || !session) && !profileLoading) navigate("/login");
    }, [id, session, navigate, profileLoading]);

    useEffect(() => {
        if (!profile) return;
        setUsername(profile.username || "");
        setWebsite(profile.website || "");
        setAvatarUrl(profile.avatar_url || "");
    }, [profile]);

    async function updateProfile(event: FormEvent<Element>, updatePicture?: boolean) {
        event.preventDefault();
        if (!id) throw new Error("No user ID available for profile update."); // TODO - need to throw errors and capture in toast messages
        if (updatePicture) {
            const oldFilePath = avatar_url;
            const { file, filePath } = generateFilePath(event as ChangeEvent<HTMLInputElement>);
            const updates = { username, website, avatar_url: filePath, updated_at: new Date().toISOString() };

            try {
                const { error } = await uploadAvatarQuery.mutateAsync({ id, filePath, file });
                if (error || !profile) throw new Error("There was an error when uploading your picture. Please try again later.");
                await deleteAvatarQuery.mutateAsync({ profile, filePath: oldFilePath });
                await updateProfileQuery.mutateAsync({ id, data: updates });
                setAvatarUrl(filePath);
            } catch (error) {
                alert(error);
            }
        } else {
            const updates = { username, website, avatar_url, updated_at: new Date().toISOString() };

            try {
                updateProfileQuery.mutate({ id, data: updates });
            } catch (error) {
                alert(error);
            }
        }
    }

    // TODO: this is just for debugging - remove later
    if (profileError) {
        return (
            <div>
                <div>Error loading profile</div>
                <div>{profileError.name}</div>
                <div>{profileError.message}</div>
                <div>{profileError.stack}</div>
            </div>
        )
    }

    if (profileLoading || !profile) return <div>Loading...</div> // TODO - add loading fallback
    if (!id || !session) return <div>Loading...</div>; // TODO - add loading fallback

    return (
        <form onSubmit={(e) => updateProfile(e)} className="form-widget">
            <Avatar
                url={avatar_url}
                size={150}
                onUpload={updateProfile}
                isUpdating={isUpdating}
            />
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={session.user.email} disabled />
            </div>
            <div>
                <label htmlFor="username">Name</label>
                <input
                    required
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
                <input
                    required
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>
            <div>
                <button className="button block primary" type="submit" disabled={isUpdating}>
                    {isUpdating ? 'Loading ...' : 'Update'}
                </button>
            </div>
            <div>
                <button className="button block" type="button" onClick={signOut}>
                    Sign Out
                </button>
            </div>
        </form>
    )
}