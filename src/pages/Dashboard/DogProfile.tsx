import { useParams } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { useIsMutating } from '@tanstack/react-query';
import { Header } from './components/Header';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { DogCard } from './components/DogCard';
import { CardPlaceholder } from './components/CardPlaceholder';
import { DogProfileForm } from '../../components/forms/DogProfileForm';
import { errorToast, fileTypeSupported, generateFilePath } from '../../utils/helpers';
import { useDeleteDogImage, useGetDogById, useUpdateDog, useUploadDogImage } from '../../api/hooks/useDog';
import { deleteDogImage } from '../../api/queries/dogQueries';
import useSupabase from '../../api/hooks/useSupabase';
import { ConfirmationDialog } from '../../components/ConfirmationAlert';

export const DogProfile = () => {
    // todo - handle fake ids being passed in such as abc or just for ids that dont exist
    const { id } = useParams();
    const supabase = useSupabase();
    const isMutating = !!useIsMutating();
    const { data: dog, isFetched } = useGetDogById(id || "");
    const uploadDogImageQuery = useUploadDogImage();
    const updateDogQuery = useUpdateDog();
    const deleteDogImageQuery = useDeleteDogImage();
    const [showModal, setShowModal] = useState(false);

    const handleUploadImageButton = () => document.getElementById('dogImageUploadInput')!.click();

    function handleOnImageUploaded(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (fileTypeSupported(event)) updateDogImage(event);
        } catch (error) {
            errorToast(error);
        }
    }

    function handleDeleteDogImage() {
        if (dog && dog.image) setShowModal(true);
    }

    const handleModalConfirm = () => {
        if (dog && dog.image) deleteDogImageQuery.mutate(dog);
        setShowModal(false);
    };

    const handleModalCancel = () => setShowModal(false);

    async function updateDogImage(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (dog) {
                const oldImage = dog?.image || "";
                const { file, filePath } = generateFilePath(event);
                if (!file || !filePath) return;

                const newDog = { ...dog, image: filePath, updated_at: new Date().toISOString() };

                const { error: uploadError } = await uploadDogImageQuery.mutateAsync({ filePath: filePath, file });
                if (uploadError) throw uploadError;

                const { error: updateError } = await updateDogQuery.mutateAsync(newDog);
                if (updateError) {
                    deleteDogImage(supabase, filePath);
                    throw updateError;
                }

                deleteDogImage(supabase, oldImage);
            }
        } catch (error) {
            errorToast(error);
        }
    }

    return (
        <>
            <Header title={dog?.name ? dog.name : ""} />
            <ConfirmationDialog text="Are you sure you want to delete this image?" onConfirm={handleModalConfirm} onCancel={handleModalCancel} isOpen={showModal} />
            <div className="p-6 max-w-3xl space-y-8">
                <div className="items-center">
                    {dog ?
                        <DogCard
                            key={`${dog.id}-${dog.image}`}
                            image={dog.image}
                            name={dog.name}
                            itemId={dog.id}
                            className="aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-4"
                        />
                        : <CardPlaceholder className="aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-4" loading={true} />
                    }
                    <label className="relative cursor-pointer" htmlFor="dogImageUploadInput" title="Click to upload a new picture">
                        <Button className="mr-2" size="sm" variant="outline" disabled={!isFetched && !isMutating} onClick={handleUploadImageButton}>
                            Upload a photo
                        </Button>
                        <Button size="sm" variant="destructive" disabled={!isFetched && !isMutating && !deleteDogImageQuery.isPending} onClick={handleDeleteDogImage}>
                            {deleteDogImageQuery.isPending ? "Deleting..." : "Delete photo"}
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
