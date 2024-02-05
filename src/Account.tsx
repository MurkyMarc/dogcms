import { useState, FormEvent, useEffect } from 'react'
import { Session } from "@supabase/gotrue-js/src/lib/types"
import Avatar from './Avatar'
import useSupabase from './hooks/useSupabase'
import { useGetProfileById, useUpdateProfile } from './hooks/useProfile'

export const Account: React.FC<{ session: Session }> = ({ session }) => {
    const supabase = useSupabase();
    const updateProfileMutation = useUpdateProfile();
    const { data: profile, error: profileError, isLoading: profileLoading } = useGetProfileById(session.user.id);
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [website, setWebsite] = useState("");
    const [avatar_url, setAvatarUrl] = useState("");

    useEffect(() => {
        if (!profile) return;
        setUsername(profile.username || "");
        setWebsite(profile.website || "");
        setAvatarUrl(profile.avatar_url || "");
    }, [profile]);

    async function updateProfile(event: FormEvent, avatarUrl: string) {
        event.preventDefault();
        setLoading(true);
        const updates = {
            username,
            website,
            avatar_url,
            updated_at: new Date().toISOString(),
        };

        try {
            updateProfileMutation.mutate({
                id: session.user.id,
                data: updates
            });
            setAvatarUrl(avatarUrl)
        } catch (error) {
            alert(error)
        }
        setLoading(false)
    }

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

    if (profileLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <form onSubmit={(e) => updateProfile(e, avatar_url)} className="form-widget">
            <Avatar
                url={avatar_url}
                size={150}
                onUpload={(event: FormEvent, url: string) => { updateProfile(event, url) }
                }
            />
            <div>
                <label htmlFor="email">Email</label>
                <input id="email" type="text" value={session.user.email} disabled />
            </div>
            <div>
                <label htmlFor="username">Name</label>
                <input
                    id="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
            </div>
            <div>
                <button className="button block primary" type="submit" disabled={loading}>
                    {loading ? 'Loading ...' : 'Update'}
                </button>
            </div>
            <div>
                <button className="button block" type="button" onClick={() => supabase.auth.signOut()}>
                    Sign Out
                </button>
            </div>
        </form>
    )
}