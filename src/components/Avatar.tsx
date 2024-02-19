import { ChangeEvent, useEffect, useRef, useState } from 'react'
import useSupabase from '../hooks/useSupabase';
import { getAvatarURL } from '../queries/avatarQueries';
import { fileTypeSupported } from '../utils/helpers';

interface AvatarProps {
    isUpdating: boolean
    url: string
    size: number
    onUpload: (event: ChangeEvent<HTMLInputElement>, updatePicture?: boolean) => void
}

export default function Avatar({ isUpdating, url, size, onUpload }: AvatarProps) {
    const supabase = useSupabase();
    const downloadImageRef = useRef(downloadImage);
    const [avatarUrl, setAvatarUrl] = useState<null | string>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const isLoading = isUpdating || loading;

    useEffect(() => {
        if (url) downloadImageRef.current(url)
    }, [url])

    async function downloadImage(path: string) {
        try {
            setLoading(true);
            const { url: avatarURL, error } = await getAvatarURL(supabase, path);
            if (error) throw error;
            
            setAvatarUrl(avatarURL);
        } catch (error) {
            alert((error as Error).message);
        }
        setLoading(false);
    }

    function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (fileTypeSupported(event)) {
                onUpload(event, true);
            } else {
                throw new Error("Only PNG, JPEG, HEIF, HEIC, and WebP files are allowed");
            }
        } catch (error) {
            alert((error as Error).message);
        }
    }

    return (
        <div>
            {isLoading ? <h3>Loading...</h3> :
                avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="avatar image"
                        style={{ height: size, width: size }}
                    />
                ) : (
                    <div className="avatar no-image" style={{ height: size, width: size }} />
                )}
            <div style={{ width: size }}>
                <label className="button primary block" htmlFor="single">
                    {isLoading ? 'Loading...' : 'Upload'}
                </label>
                <input
                    style={{ visibility: 'hidden', position: 'absolute' }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={isUpdating}
                />
            </div>
        </div>
    )
}
