import { FormEvent, useEffect, useRef, useState } from 'react'
import useSupabase from './hooks/useSupabase';

interface AvatarProps {
    url: string
    size: number
    onUpload: (event: FormEvent, url: string) => void
}

export default function Avatar({ url, size, onUpload }: AvatarProps) {
    const [avatarUrl, setAvatarUrl] = useState<null | string>(null);
    const [uploading, setUploading] = useState(false);
    const downloadImageRef = useRef(downloadImage);
    const supabase = useSupabase();

    useEffect(() => {
        if (url) downloadImageRef.current(url)
    }, [url])

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path);
            if (error) throw error;

            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                console.log(error);
            }
            console.log('Error downloading image: ', error)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function uploadAvatar(event: any) {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.')
            }

            const file = event.target.files[0]
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `${fileName}`

            const { error } = await supabase.storage.from('avatars').upload(filePath, file)

            if (error) {
                throw error
            }

            onUpload(event, filePath)
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                console.log(error);
            }
        } finally {
            setUploading(false)
        }
    }

    return (
        <div>
            {avatarUrl ? (
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
                    {uploading ? 'Uploading ...' : 'Upload'}
                </label>
                <input
                    style={{ visibility: 'hidden', position: 'absolute' }}
                    type="file"
                    id="single"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    )
}
