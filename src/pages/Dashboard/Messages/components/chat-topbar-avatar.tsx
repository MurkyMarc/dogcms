import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import { UserData } from "../data";

interface ChatTopbaAvatarProps {
    selectedUser: UserData;
}

export function ChatTopbarAvatar({ selectedUser }: ChatTopbaAvatarProps) {

    return (
        <>
            <Avatar className="flex justify-center items-center">
                <AvatarImage
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    width={6}
                    height={6}
                    className="w-10 h-10 "
                />
            </Avatar>
            <div className="flex flex-col">
                <span className="font-medium">{selectedUser.name}</span>
                {/* <span className="text-xs">Active 2 mins ago</span> */}
                {/* TODO - determine if we want last active session indicator */}
            </div>
        </>
    )
}