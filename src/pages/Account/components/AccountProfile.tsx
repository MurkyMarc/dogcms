import { ChangeEvent } from "react";
import { useIsMutating } from "@tanstack/react-query";
import { errorToast, fileTypeSupported, generateFilePath, successToast } from "../../../utils/helpers";
import { useDeleteAvatar, useUploadAvatar } from "../../../api/hooks/useAvatar";
import { useGetMyProfileById, useUpdateProfile } from "../../../api/hooks/useProfile";
import { useSession } from "../../../api/hooks/useAuth";
import { AccountCard } from "./AccountCard"
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator"
import { ProfileForm } from '../../../components/forms/ProfileForms'
import { CardPlaceholder } from "../../Dashboard/components/CardPlaceholder";

export const AccountProfile = () => {
    const isMutating = !!useIsMutating();
    const { data: session } = useSession();
    const uploadAvatarQuery = useUploadAvatar();
    const deleteAvatarQuery = useDeleteAvatar();
    const updateProfileQuery = useUpdateProfile();
    const { data: profile, isFetched } = useGetMyProfileById(session?.user.id || "", !!session);

    function handleOnImageUploaded(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (fileTypeSupported(event)) updateProfileImage(event);
        } catch (error) {
            errorToast(error);
        }
    }

    const handleUploadImageButton = async () => document.getElementById('imageUploadInput')!.click();

    async function updateProfileImage(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (profile) {
                const oldImage = profile?.image || "";
                const { file, filePath } = generateFilePath(event);
                const newProfile = { ...profile, image: filePath, updated_at: new Date().toISOString() };

                const { error: uploadError } = await uploadAvatarQuery.mutateAsync({ filePath: filePath, file });
                if (uploadError) throw uploadError;

                const { error: updateError } = await updateProfileQuery.mutateAsync(newProfile);
                if (updateError) {
                    deleteAvatarQuery.mutateAsync({ filePath });
                    throw updateError;
                }

                deleteAvatarQuery.mutateAsync({ filePath: oldImage });
                successToast("Image updated successfully");
            }
        } catch (error) {
            errorToast(error);
        }
    }

    return (
        <div className="flex-1 lg:max-w-2xl">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium">Profile</h3>
                    <p className="text-sm text-muted-foreground pb-2">
                        This is how others will see you on the site.
                    </p>

                    {profile ?
                        <AccountCard
                            profile={profile}
                            className="aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-4"
                        />
                        : <CardPlaceholder className="aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-4" loading={true} />
                    }
                    <label className="relative cursor-pointer" htmlFor="imageUploadInput" title="Click to upload a new picture">
                        <Button className="" size="sm" variant="outline" disabled={!isMutating && !isFetched} onClick={handleUploadImageButton}>
                            Upload a photo
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
