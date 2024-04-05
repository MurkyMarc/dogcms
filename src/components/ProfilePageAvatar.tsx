import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import useSupabase from '../hooks/useSupabase';
import { getAvatarURL } from '../queries/avatarQueries';
import { fileTypeSupported, generateFilePath } from '../utils/helpers';
import { NoProfilePicComponent } from './ui/icons/NoProfilePicComponent';
import { useUploadAvatar, useDeleteAvatar } from '../hooks/useAvatar';
import { useUpdateProfile } from '../hooks/useProfile';
import { Tables } from '../utils/database.types';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface props {
    isUpdating: boolean;
    profile: Tables<'profiles'>;
}

export const ProfilePageAvatar = ({ isUpdating, profile }: props) => {
    const supabase = useSupabase();
    const downloadImageRef = useRef(downloadImage);
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const isLoading = isUpdating || loading;
    const updateProfileQuery = useUpdateProfile();
    const uploadAvatarQuery = useUploadAvatar();
    const deleteAvatarQuery = useDeleteAvatar();
    const prevAvatarUrlRef = useRef<string>("");

    useEffect(() => {
        if (profile.avatar_url && profile.avatar_url !== prevAvatarUrlRef.current) {
            downloadImageRef.current(profile.avatar_url);
            prevAvatarUrlRef.current = profile.avatar_url;
        }
    }, [profile]);

    async function downloadImage(path: string) {
        try {
            setLoading(true);
            const { url: avatarURL, error } = await getAvatarURL(supabase, path);
            if (error) throw error;
            setAvatarUrl(avatarURL);
        } catch (error) {
            alert((error as Error).message); // TODO - toast
        }
        setLoading(false);
    }

    async function updateProfile(event: FormEvent<Element>) {
        event.preventDefault();
        const oldFilePath = avatarUrl;
        const { file, filePath } = generateFilePath(event as ChangeEvent<HTMLInputElement>);
        const updates = { avatar_url: filePath, updated_at: new Date().toISOString() };

        try {
            const { error } = await uploadAvatarQuery.mutateAsync({ id: profile.id, filePath, file });
            if (error || !profile) throw new Error("There was an error when uploading your picture. Please try again later.");
            await deleteAvatarQuery.mutateAsync({ profile, filePath: oldFilePath });
            await updateProfileQuery.mutateAsync({ id: profile.id, data: updates });
            setAvatarUrl(filePath);
        } catch (error) {
            alert(error);
        }
    }

    function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (fileTypeSupported(event)) {
                updateProfile(event);
            } else {
                throw new Error("Only PNG, JPEG, HEIF, HEIC, and WebP files are allowed");
            }
        } catch (error) {
            alert((error as Error).message);
        }
    }

    return (
        <label className="relative cursor-pointer" htmlFor="avatar-upload" title="Click to upload a new picture" >
            <Avatar className="h-20 w-20 relative group" >
                <AvatarImage alt="profile picture" src={avatarUrl} width={200} height={200}/>
                <AvatarFallback>
                    {isLoading ? <LoadingSpinner /> : <NoProfilePicComponent height={200} width={200}/>}
                </AvatarFallback>
                < span className="absolute inset-0 flex items-center justify-center bg-gray-300 opacity-0 group-hover:opacity-80 transition-opacity duration-300" >
                    Upload a new picture
                </span>
            </Avatar>
            <input className="hidden"
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={isUpdating}
            />
        </label>
    )
}
