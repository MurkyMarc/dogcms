import { DogCard } from "./components/DogCard";
import { useGetDogsByOwner } from "../../api/hooks/useDog";
import { CardPlaceholder } from "./components/CardPlaceholder";
import { Button } from "../../components/ui/button";
import { useSession } from "../../api/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { MenuButton } from "./components/MenuButton";

export default function MyDogs() {
    const { data: session } = useSession();
    const { data: dogs } = useGetDogsByOwner(session?.user.id || "");
    const navigate = useNavigate();

    return (
        <>
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center">
                    <MenuButton className="mr-4" />
                    <h1 className="font-semibold text-lg md:text-2xl">Dog Profiles</h1>
                    <Button className="ml-auto" size="sm" onClick={() => navigate("/dashboard/dogs/new")}>
                        Create new profile
                    </Button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {dogs ? dogs.map((dog) => (
                        <DogCard
                            id={`${dog.id}`}
                            image={dog.image}
                            name={dog.name}
                            itemId={dog.id}
                            key={dog.name}
                            className="space-y-3 aspect-[3/4] w-full rounded-md mb-2"
                            imageStyles="hover:scale-105"
                        >
                            <div className="text-sm">
                                <h3 className="font-medium leading-none">{dog.name}</h3>
                            </div>
                        </ DogCard>
                    )) :
                        <CardPlaceholder className="space-y-3 aspect-[3/4] w-full rounded-md mb-2" loading={false} />
                    }
                </div>
            </main>
        </>
    );
}

