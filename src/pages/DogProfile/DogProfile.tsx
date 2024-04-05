import { useParams } from 'react-router-dom';
import { useDeleteDogImage, useGetDogById, useUpdateDog, useUploadDogImage } from '../../hooks/useDog';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Separator } from '../../components/ui/separator';
import { DogCard } from '../Dashboard/components/DogCard';
import { DogCardPlaceholder } from '../Dashboard/components/DogCardPlaceholder';
import { ChangeEvent, FormEvent } from 'react';
import { fileTypeSupported, generateFilePath } from '../../utils/helpers';

export const DogProfile = () => {
    // todo - handle fake ids being passed in such as abc
    const { id } = useParams();
    const { data: dog, isFetched } = useGetDogById(id || "");
    const uploadDogImageQuery = useUploadDogImage();
    const updateDogQuery = useUpdateDog();
    const deleteDogImageQuery = useDeleteDogImage();
    const isUpdating = uploadDogImageQuery.isPending || updateDogQuery.isPending;

    const handleUploadImageButton = async () => document.getElementById('dogImageUploadInput')!.click();

    function handleOnImageUploaded(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (fileTypeSupported(event)) updateDogImage(event);
        } catch (error) {
            alert((error as Error).message);
            // todo - add a toast
        }
    }

    async function updateDogImage(event: FormEvent<Element>) {
        event.preventDefault();
        try {
            if (dog) {
                const oldImage = dog?.image || "";
                const { file, filePath } = generateFilePath(event as ChangeEvent<HTMLInputElement>);
                const newDog = { ...dog, image: filePath, updated_at: new Date().toISOString() };

                const { error: uploadError } = await uploadDogImageQuery.mutateAsync({ filePath: filePath, file });
                if (uploadError) throw new Error("There was an error when uploading the picture. Please try again later.");

                const { error: updateError } = await updateDogQuery.mutateAsync(newDog);
                if (updateError) {
                    deleteDogImageQuery.mutateAsync({ filePath });
                    throw new Error("There was an error when uploading the picture. Please try again later.");
                }

                deleteDogImageQuery.mutateAsync({ filePath: oldImage });
            }
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="mx-auto max-w-3xl px-4 space-y-8 pb-4">
            <div className="items-center">
                {dog ?
                    <DogCard
                        id={`${dog.id}`}
                        key={dog?.name}
                        dog={dog}
                        className="min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-4"
                    />
                    : <DogCardPlaceholder className="mb-4" loading={true} />
                }
                <label className="relative cursor-pointer" htmlFor="dogImageUploadInput" title="Click to upload a new picture">
                    <Button className="" size="sm" variant="outline" disabled={!isFetched && !isUpdating} onClick={handleUploadImageButton}>
                        Upload a photo
                    </Button>
                    <Input className="hidden"
                        id="dogImageUploadInput"
                        type="file"
                        accept="image/*"
                        onChange={handleOnImageUploaded}
                        disabled={false}
                    />
                </label>
            </div>
            <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder={"Enter a name"} required value={dog?.name || ""} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="breed">Breed</Label>
                        <Input id="breed" placeholder="Golden Retriever" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" placeholder="5" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Buddy is a friendly dog who loves to play fetch." required />
                    </div>
                </div>
                <Separator />
                <div className="space-y-6">
                    <fieldset>
                        <legend className="text-lg font-semibold">Vaccination status</legend>
                        <div className="flex items-center space-x-4">
                            <Label className="flex items-center space-x-2 cursor-pointer" htmlFor="vaccinated-yes">
                                <Input className="cursor-pointer" id="vaccinated-yes" name="vaccinated" type="radio" value="yes" />
                                <span>Yes</span>
                            </Label>
                            <Label className="flex items-center space-x-2 cursor-pointer" htmlFor="vaccinated-no">
                                <Input className="cursor-pointer" id="vaccinated-no" name="vaccinated" type="radio" value="no" />
                                <span>No</span>
                            </Label>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend className="text-lg font-semibold pb-4">Behavior traits</legend>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <Input
                                    className="cursor-pointer w-4 h-4 text-blue-500 border-gray-300 rounded dark:border-gray-700"
                                    id="friendly"
                                    name="traits"
                                    type="checkbox"
                                    value="friendly"
                                />
                                <Label className="cursor-pointer" htmlFor="friendly">Friendly</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    className="cursor-pointer w-4 h-4 text-blue-500 border-gray-300 rounded dark:border-gray-700"
                                    id="playful"
                                    name="traits"
                                    type="checkbox"
                                    value="playful"
                                />
                                <Label className="cursor-pointer" htmlFor="playful">Playful</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    className="cursor-pointer w-4 h-4 text-blue-500 border-gray-300 rounded dark:border-gray-700"
                                    id="calm"
                                    name="traits"
                                    type="checkbox"
                                    value="calm"
                                />
                                <Label className="cursor-pointer" htmlFor="calm">Calm</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    className="cursor-pointer w-4 h-4 text-blue-500 border-gray-300 rounded dark:border-gray-700"
                                    id="energetic"
                                    name="traits"
                                    type="checkbox"
                                    value="energetic"
                                />
                                <Label className="cursor-pointer" htmlFor="energetic">Energetic</Label>
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend className="text-lg font-semibold pb-4">Special needs</legend>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <div className="flex items-center space-x-2">
                                <Input
                                    className="cursor-pointer w-4 h-4 text-blue-500 border-gray-300 rounded dark:border-gray-700"
                                    id="allergies"
                                    name="needs"
                                    type="checkbox"
                                    value="allergies"
                                />
                                <Label className="cursor-pointer" htmlFor="allergies">Allergies</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    className="cursor-pointer w-4 h-4 text-blue-500 border-gray-300 rounded dark:border-gray-700"
                                    id="anxiety"
                                    name="needs"
                                    type="checkbox"
                                    value="anxiety"
                                />
                                <Label className="cursor-pointer" htmlFor="anxiety">Separation anxiety</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    className="cursor-pointer w-4 h-4 text-blue-500 border-gray-300 rounded dark:border-gray-700"
                                    id="injury"
                                    name="needs"
                                    type="checkbox"
                                    value="injury"
                                />
                                <Label className="cursor-pointer" htmlFor="injury">Recovering from injury</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    className="cursor-pointer w-4 h-4 text-blue-500 border-gray-300 rounded dark:border-gray-700"
                                    id="medication"
                                    name="needs"
                                    type="checkbox"
                                    value="medication"
                                />
                                <Label className="cursor-pointer" htmlFor="medication">Needs medication</Label>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <div className="pt-6">
                    <Button>Submit</Button>
                </div>
            </div>
        </div>
    )
}
