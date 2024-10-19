import { ChangeEvent, useState } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { DogCard } from './components/DogCard';
import { CardPlaceholder } from './components/CardPlaceholder';
import { errorToast, fileTypeSupported } from '../../utils/helpers';
import { CreateNewDogForm } from '../../components/forms/CreateNewDogForm';
import BackButton from '../../components/ui/icons/BackButton';
import { MenuButton } from './components/MenuButton';

export const CreateDogProfile = () => {
    const isMutating = !!useIsMutating();
    const [imagePath, setImagePath] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);

    const handleUploadImageButton = async () => document.getElementById('dogImageUploadInput')!.click();

    function handleOnImageSelected(e: ChangeEvent<HTMLInputElement>) {
        try {
            if (fileTypeSupported(e)) displayImage(e);
        } catch (error) {
            errorToast(error);
        }
    }

    async function displayImage(e: ChangeEvent<HTMLInputElement>) {
        try {
            const file = e.target.files && e.target.files[0];

            if (file) {
                setImage(file);
                if (imagePath) URL.revokeObjectURL(imagePath);
                setImagePath(URL.createObjectURL(file));
            }
        } catch (error) {
            errorToast(error);
        }
    }

    return (
        <>
            <div className='flex justify-between px-6 pt-6 lg:hidden'>
                <MenuButton className="mr-4" />
                <BackButton className="w-min lg:hidden" />
            </div>
            <div className="p-6 max-w-3xl space-y-8">
                <div className="items-center">
                    {imagePath ?
                        <DogCard
                            image={imagePath}
                            localImage={true}
                            className="aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-4"
                        />
                        : <CardPlaceholder className="aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-2" loading={false} />
                    }
                    <label className="relative cursor-pointer" htmlFor="dogImageUploadInput" title="Click to upload a new picture">
                        <Button size="sm" variant="outline" disabled={isMutating} onClick={handleUploadImageButton}>
                            Upload a photo
                        </Button>
                        <Input className="hidden"
                            id="dogImageUploadInput"
                            type="file"
                            accept="image/*"
                            onChange={handleOnImageSelected}
                            disabled={isMutating}
                        />
                    </label>
                </div>
                <CreateNewDogForm image={image} />
            </div>
        </>
    )
}
