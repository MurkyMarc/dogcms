import { DogCard } from "./components/DogCard";
import { useGetDogsByOwner } from "../../hooks/useDog";
import { useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { CardPlaceholder } from "./components/CardPlaceholder";
import { Header } from "./components/Header";

export default function MyDogs() {
    const queryClient = useQueryClient();
    const session = queryClient.getQueryData<Session>(['session']);
    const { data: dogs } = useGetDogsByOwner(session?.user.id || "");

    return (
        <>
            <Header title="My Dogs" />
            <div className="lg:mx-auto p-6">
                <div className="flex flex-wrap gap-4">
                    {dogs ? dogs.map((dog) => (
                        <DogCard
                            id={`${dog.id}`}
                            key={dog.name}
                            dog={dog}
                            className="space-y-3 aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-2"
                        >
                            <div className="text-sm">
                                <h3 className="font-medium leading-none">{dog.name}</h3>
                            </div>
                        </ DogCard>
                    )) :
                        <CardPlaceholder className="space-y-3 min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md mb-2" loading={false} />
                    }
                </div>
            </div>
        </>
    );
}

