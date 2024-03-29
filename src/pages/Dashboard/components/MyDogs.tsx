import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "../../../components/ui/button";
import { MenuIcon } from "../../../components/ui/icons/MenuIcon";
import { MenuDrawer } from "../../../components/ui/menu-drawer";
import { Separator } from "../../../components/ui/separator";
import { DogCard } from "./DogCard";
import { useDogsByOwner } from "../../../hooks/useDog";
import { useQuery } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";

export default function MyDogs() {
    const { data: session, isLoading } = useQuery<Session>({ queryKey: ['session'] });
    const { data: dogs } = useDogsByOwner(session?.user.id || "");
    if (isLoading) {return "loading..."}

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex space-y-1">
                    <MenuDrawer>
                        <Button className="lg:hidden p-1 h-auto mr-6 border-purple-500" variant={"link"}>
                            <MenuIcon className="h-7 w-8" />
                        </Button>
                    </MenuDrawer>
                    <h2 className="text-2xl font-semibold tracking-tight">
                        My Dogs
                        <p className="hidden xs:block text-sm text-muted-foreground">
                            The dogs uploaded to your profile
                        </p>
                    </h2>
                </div>
                <div className="space-between flex items-center">
                    <div className="ml-auto">
                        <Button>
                            <PlusCircledIcon className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </div>
                </div>
            </div>
            <Separator className="my-4" />
            <div className="">
                <div className="flex flex-wrap gap-4">
                    {dogs?.map((dog) => (
                        <DogCard
                            id={`${dog.id}`}
                            key={dog.name}
                            dog={dog}
                            className="min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md pb-2"
                            aspectRatio="portrait"
                            width={250}
                            height={330} />
                    ))}
                </div>
            </div>
        </>
    );
}

