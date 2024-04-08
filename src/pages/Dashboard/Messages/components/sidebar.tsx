import { SquarePen } from "lucide-react";
import { User, userData } from "../data";
import { buttonVariants } from "../../../../components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "../../../../utils/cn";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../components/ui/tooltip";

interface SidebarProps {
    isCollapsed: boolean;
    users: User[];
    onClick?: () => void;
    selectedUser: User;
    setSelectedUser: React.Dispatch<React.SetStateAction<User>>
}

export function Sidebar({ users, isCollapsed, selectedUser, setSelectedUser }: SidebarProps) {
    return (
        <div
            data-collapsed={isCollapsed}
            className="relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2"
        >
            {!isCollapsed ? (
                <div className="flex justify-between p-2 items-center">
                    <div className="flex gap-2 items-center text-2xl">
                        <p className="font-medium">Chats</p>
                        <span className="text-zinc-300">({users.length})</span>
                    </div>
                    <Link
                        to="#"
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "h-9 w-9 ml-4"
                        )}
                    >
                        <SquarePen size={20} />
                    </Link>
                </div>
            ) : null}
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                {users.map((user, index) =>
                    isCollapsed ? (
                        <TooltipProvider key={index}>
                            <Tooltip key={index} delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <Link
                                        onClick={() => setSelectedUser(userData[index])}
                                        to="#"
                                        className={cn(
                                            selectedUser.name == user.name ?
                                                buttonVariants({ variant: "outline", size: "icon" }) :
                                                buttonVariants({ variant: "ghost", size: "icon" }),
                                            "h-11 w-11 md:h-16 md:w-16"
                                        )}
                                    >
                                        <Avatar
                                            className="flex justify-center items-center"
                                        >
                                            <AvatarImage
                                                src={user.avatar}
                                                alt={user.avatar}
                                                width={6}
                                                height={6}
                                                className="w-10 h-10 "
                                            />
                                        </Avatar>{" "}
                                        <span className="sr-only">{user.name}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className="flex items-center gap-4"
                                >
                                    {user.name}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <Link
                            key={index}
                            to="#"
                                onClick={() => setSelectedUser(userData[index])}
                            className={cn(
                                selectedUser.name == user.name ?
                                    buttonVariants({ variant: "outline", size: "lg" }) :
                                    buttonVariants({ variant: "ghost", size: "lg" }),
                                "justify-start gap-4"
                            )}
                        >
                            <Avatar
                                className="flex justify-center items-center"
                                    onClick={() => setSelectedUser(userData[index])}
                            >
                                <AvatarImage
                                    src={user.avatar}
                                    alt={user.avatar}
                                    width={6}
                                    height={6}
                                    className="w-10 h-10"
                                />
                            </Avatar>
                            <div className="flex flex-col max-w-28">
                                <span>{user.name}</span>
                                {user.messages.length > 0 && (
                                    <span className="text-zinc-300 text-xs truncate">
                                        {user.messages[user.messages.length - 1].name.split(" ")[0]}
                                        : {user.messages[user.messages.length - 1].message}
                                    </span>
                                )}
                            </div>
                        </Link>
                    )
                )}
            </nav>
        </div>
    );
}
