import { ChangeEvent, useState } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { errorToast, fileTypeSupported, generateFilePath } from "../../../utils/helpers";
import { useDeleteAvatar, useGetMyProfileById, useUpdateProfile, useUploadAvatar } from "../../../api/hooks/useProfile";
import { useSession } from "../../../api/hooks/useAuth";
import { AccountCard } from "./AccountCard"
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator"
import { ProfileForm } from '../../../components/forms/ProfileForms'
import { CardPlaceholder } from "../../Dashboard/components/CardPlaceholder";
import { ConfirmationDialog } from "../../../components/ConfirmationAlert";
import { deleteAvatar } from "../../../api/queries/profileQueries";
import useSupabase from "../../../api/hooks/useSupabase";

export const AccountProfile = () => {
    const supabase = useSupabase();
    const isMutating = !!useIsMutating();
    const { data: session } = useSession();
    const uploadAvatarQuery = useUploadAvatar();
    const deleteAvatarQuery = useDeleteAvatar();
    const updateProfileQuery = useUpdateProfile();
    const [showModal, setShowModal] = useState(false);
    const { data: profile, isFetched } = useGetMyProfileById(session?.user.id || "");

    function handleOnImageUploaded(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (fileTypeSupported(event)) updateProfileImage(event);
        } catch (error) {
            errorToast(error);
        }
    }

    const handleUploadImageButton = async () => document.getElementById('imageUploadInput')!.click();

    function handleDeleteImage() {
        if (profile && profile.image) setShowModal(true);
    }

    const handleModalConfirm = () => {
        if (profile && profile.image) deleteAvatarQuery.mutate(profile);
        setShowModal(false);
    };

    const handleModalCancel = () => setShowModal(false);

    async function updateProfileImage(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (profile) {
                const oldImage = profile?.image || "";
                const { file, filePath } = generateFilePath(event);
                if (!file || !filePath) return;

                const newProfile = { ...profile, image: filePath, updated_at: new Date().toISOString() };

                const { error: uploadError } = await uploadAvatarQuery.mutateAsync({ filePath: filePath, file });
                if (uploadError) throw uploadError;

                const { error: updateError } = await updateProfileQuery.mutateAsync(newProfile);
                if (updateError) {
                    deleteAvatarQuery.mutateAsync(profile);
                    throw updateError;
                }

                deleteAvatar(supabase, oldImage);
            }
        } catch (error) {
            errorToast(error);
        }
    }

    return (
        <div className="flex-1 lg:max-w-2xl">
            <ConfirmationDialog text="Are you sure you want to delete this image?" onConfirm={handleModalConfirm} onCancel={handleModalCancel} isOpen={showModal} />
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Profile</h3>
                    <p className="text-sm text-muted-foreground pb-2">
                        This is how others will see you on the site.
                    </p>

                    {profile ?
                        <AccountCard
                            key={`${profile.id}-${profile.image}`}
                            profile={profile}
                            className="aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-4"
                        />
                        : <CardPlaceholder className="aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-4" loading={true} />
                    }
                    <label className="relative cursor-pointer" htmlFor="imageUploadInput" title="Click to upload a new picture">
                        <Button className="mr-2" size="sm" variant="outline" disabled={!isMutating && !isFetched} onClick={handleUploadImageButton}>
                            Upload a photo
                        </Button>
                        <Button size="sm" variant="destructive" disabled={!isFetched && !isMutating && !deleteAvatarQuery.isPending} onClick={handleDeleteImage}>
                            {deleteAvatarQuery.isPending ? "Deleting..." : "Delete photo"}
                        </Button>
                        <Input className="hidden"
                            id="imageUploadInput"
                            type="file"
                            accept="image/*"
                            onChange={handleOnImageUploaded}
                            disabled={!isMutating && !isFetched}
                        />
                    </label>
                </div>
                <Separator />
                {profile ? <ProfileForm profile={profile} /> : null}
            </div>
        </div>
    )
}
