import { useParams } from 'react-router-dom';
import { ChangeEvent } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import { Header } from './components/Header';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { DogCard } from './components/DogCard';
import { CardPlaceholder } from './components/CardPlaceholder';
import { DogProfileForm } from '../../components/forms/DogProfileForm';
import { errorToast, fileTypeSupported, generateFilePath, successToast } from '../../utils/helpers';
import { useDeleteDogImage, useGetDogById, useUpdateDog, useUploadDogImage } from '../../api/hooks/useDog';

export const DogProfile = () => {
    // todo - handle fake ids being passed in such as abc or just for ids that dont exist
    const { id } = useParams();
    const isMutating = !!useIsMutating();
    const { data: dog, isFetched } = useGetDogById(id || "");
    const uploadDogImageQuery = useUploadDogImage();
    const updateDogQuery = useUpdateDog();
    const deleteDogImageQuery = useDeleteDogImage();

    const handleUploadImageButton = async () => document.getElementById('dogImageUploadInput')!.click();

    function handleOnImageUploaded(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (fileTypeSupported(event)) updateDogImage(event);
        } catch (error) {
            errorToast(error);
        }
    }

    async function updateDogImage(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (dog) {
                const oldImage = dog?.image || "";
                const { file, filePath } = generateFilePath(event);
                const newDog = { ...dog, image: filePath, updated_at: new Date().toISOString() };

                const { error: uploadError } = await uploadDogImageQuery.mutateAsync({ filePath: filePath, file });
                if (uploadError) throw uploadError;

                const { error: updateError } = await updateDogQuery.mutateAsync(newDog);
                if (updateError) {
                    deleteDogImageQuery.mutateAsync({ filePath });
                    throw updateError;
                }

                deleteDogImageQuery.mutateAsync({ filePath: oldImage });
                successToast("Image was updated successfully");
            }
        } catch (error) {
            errorToast(error);
        }
    }

    return (
        <>
            <Header title={dog?.name ? dog.name : ""} />
            <div className="p-6 max-w-3xl space-y-8">
                <div className="items-center">
                    {dog ?
                        <DogCard
                            id={`${dog.id}`}
                            key={dog?.name}
                            image={dog.image}
                            name={dog.name}
                            itemId={dog.id}
                            className="aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-4"
                        />
                        : <CardPlaceholder className="aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-4" loading={true} />
                    }
                    <label className="relative cursor-pointer" htmlFor="dogImageUploadInput" title="Click to upload a new picture">
                        <Button className="" size="sm" variant="outline" disabled={!isFetched && !isMutating} onClick={handleUploadImageButton}>
                            Upload a photo
                        </Button>
                        <Input className="hidden"
                            id="dogImageUploadInput"
                            type="file"
                            accept="image/*"
                            onChange={handleOnImageUploaded}
                            disabled={!isMutating && !isFetched}
                        />
                    </label>
                </div>
                {dog ? <DogProfileForm dog={dog} /> : null}
            </div>
        </>
    )
}
