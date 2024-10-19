import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDog, deleteDogById, deleteDogImage, getDogById, getDogsByOwnerId, updateDog, uploadDogImage } from "../queries/dogQueries";
import { Tables, TablesInsert, TablesUpdate } from "../../utils/database.types";
import useSupabase from "./useSupabase";
import { useLocation, useNavigate } from "react-router-dom";
import { errorToast, loadingToast, successToast } from "../../utils/helpers";

export function useGetDogById(id: string) {
    const client = useSupabase();
    const queryKey = ['dogs', id];

    const queryFn = async () => {
        if (!id) return null;
        return await getDogById(client, id).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useCreateDog() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (dog: TablesInsert<'dogs'>) => {
        return await createDog(client, dog).then(
            (result) => result.data
        );
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: (_, dog) => {
            queryClient.setQueryData(['dogs', `${dog.id}`], dog);
            successToast("Dog was created successfully.");
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

// todo - restrict this to the owner or an admin
export function useDeleteDogById() {
    const client = useSupabase();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const mutationFn = async (id: string) => await deleteDogById(client, id);

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: (_, id) => {
            queryClient.removeQueries({ queryKey: ['dogs', `${id}`] });
            if (location.pathname.startsWith('/dashboard/dogs/')) {
                navigate('/dashboard');
            }
            successToast("Deleted successfully.");
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useUpdateDog() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (dog: TablesUpdate<'dogs'>) => {
        return await updateDog(client, dog);
    };

    return useMutation({
        mutationFn,
        onMutate: () => loadingToast(),
        onSuccess: ({ data: dog }) => {
            queryClient.setQueryData(['dogs', `${dog?.id}`], dog);
            successToast("Updated successfully.")
        },
        onError: (error) => {
            errorToast(error)
        }
    });
}

export function useGetOwnersDogsById(id: string) {
    const client = useSupabase();
    const queryKey = ['dogs', id];

    const queryFn = async () => {
        return await getDogsByOwnerId(client, id).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}

export function useGetDogsByOwner(ownerId: string) {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const queryFn = async () => {
        if (!ownerId) return null;
        return await getDogsByOwnerId(client, ownerId).then(result => {
            const dogs = result.data || [];
            dogs.map(dog => queryClient.setQueryData(['dogs', `${dog.id}`], dog));
            return dogs;
        })
    };

    return useQuery({ queryKey: ['mydogs'], queryFn });
}

export function useUploadDogImage() {
    const client = useSupabase();

    const mutationFn = async ({ filePath, file }: { filePath: string, file: File | Blob }) => {
        return await uploadDogImage(client, filePath, file);
    }

    return useMutation({ mutationFn });
}

export function useDeleteDogImage() {
    const client = useSupabase();
    const queryClient = useQueryClient();

    const mutationFn = async (dog: Tables<'dogs'>) => {
        if (!dog.image) return;
        deleteDogImage(client, dog.image);
        return await updateDog(client, { id: dog.id, image: "" });
    }

    return useMutation({
        mutationFn,
        onSuccess: (_, dog) => {
            queryClient.setQueryData(['dogs', `${dog?.id}`], { ...dog, image: "" });
        }
    });
}