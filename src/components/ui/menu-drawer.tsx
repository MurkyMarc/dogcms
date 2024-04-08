import { Link } from "react-router-dom";
import { Button } from "./button";
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "./drawer";
import { CalendarDays, Dog, MessageSquareMore, PawPrint } from "lucide-react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function MenuDrawer({ children }: Props) {
    return (
        <Drawer direction="left">
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className=" h-full w-1/2 min-w-60">
                <div className="mx-auto w-full max-w-sm pt-4">
                    <DrawerHeader>
                        <DrawerTitle>Menu</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="">
                            <DrawerClose asChild>
                                <Link className={"w-full"} to="/dashboard">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <Dog size={20} className="mr-2 stroke-black" />
                                        My Dogs
                                    </Button>
                                </Link>
                            </DrawerClose>
                            <DrawerClose asChild>
                                <Link className={"w-full"} to="/dashboard/walks">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <PawPrint size={20} className="mr-2 stroke-black" />
                                        Walks
                                    </Button>
                                </Link>
                            </DrawerClose>
                            <DrawerClose asChild>
                                <Link className={"w-full"} to="/dashboard/schedules">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <CalendarDays size={20} className="mr-2 stroke-black" />
                                        Schedules
                                    </Button>
                                </Link>
                            </DrawerClose>
                            <DrawerClose asChild>
                                <Link className={"w-full"} to="/dashboard/messages">
                                    <Button variant="ghost" className="w-full justify-start">
                                        <MessageSquareMore size={20} className="mr-2 stroke-black" />
                                        Messages
                                    </Button>
                                </Link>
                            </DrawerClose>
                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
