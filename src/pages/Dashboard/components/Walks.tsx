import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "../../../components/ui/button";
import { MenuIcon } from "../../../components/ui/icons/MenuIcon";
import { MenuDrawer } from "../../../components/ui/menu-drawer";
import { ScrollArea, ScrollBar } from "../../../components/ui/scroll-area";
import { Separator } from "../../../components/ui/separator";
import { DogCard } from "./DogCard";
import { useQuery } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { useDogsByOwner } from "../../../hooks/useDog";

export default function Schedules() {
    const { data: session, isLoading } = useQuery<Session>({ queryKey: ['session'] });
    const { data: dogs } = useDogsByOwner(session?.user.id || "");
    if (isLoading) { return "loading..." }

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
                        My Walks
                        <p className="hidden xs:block text-sm text-muted-foreground">
                            Your scheduled walks
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
            <div className="relative">
                <ScrollArea>
                    <div className="flex space-x-4 pb-4">
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
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
            <div className="mt-6 space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                    Test
                </h2>
                <p className="text-sm text-muted-foreground">
                    Test description
                </p>
            </div>
            <Separator className="my-4" />
            <div className="relative">
                <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                        {dogs?.map((dog) => (
                            <DogCard
                                id={`${dog.id}`}
                                key={dog.name}
                                dog={dog}
                                className="md:w-[150px]"
                                aspectRatio="square"
                                width={150}
                                height={150} />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </>
    );
}

