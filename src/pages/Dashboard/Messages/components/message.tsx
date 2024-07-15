import { useMemo } from "react";
import { cn } from "../../../../utils/cn";
import { Tables } from "../../../../utils/database.types";
import { ProfileCircleIcon } from "../../components/ProfileCircleIcon";
import { MessagePicCard } from "./message-pic-card";

type MessageProps = {
    message: Tables<'messages'>;
    isYourMessage: boolean;
    otherUserName: string;
    yourName: string;
    otherUserProfile?: Tables<'profiles'> | null;
    yourProfile?: Tables<'profiles'> | null;
};

export function Message({ message, isYourMessage, otherUserName, otherUserProfile, yourProfile, yourName }: MessageProps) {
    const otherUserIcon = useMemo(() => <ProfileCircleIcon image={otherUserProfile?.image} name={otherUserName} />, [otherUserProfile, otherUserName]);
    const yourIcon = useMemo(() => <ProfileCircleIcon className="flex justify-end" image={yourProfile?.image} name={yourName} />, [yourProfile, yourName]);

    return (
        <div className={cn("flex flex-col gap-2 p-2", isYourMessage ? "items-end" : "items-start")}>
            <div className="flex gap-3 items-end">
                {!isYourMessage && otherUserProfile && otherUserIcon}
                <div>
                    {message.pic && (
                        <MessagePicCard className="flex justify-end max-w-60 mb-1" image={message.pic} />
                    )}
                    <div className={cn("flex", isYourMessage ? "flex-row-reverse" : "")}>
                        <div className={cn(
                            "w-fit justify-center border border-gray-200 bg-accent py-2 px-3 rounded-lg max-w-xs sm:max-w-lg whitespace-pre-wrap",
                            isYourMessage ? "rounded-br-none" : "rounded-bl-none"
                        )}>
                            {!isYourMessage && <div className="font-bold text-xs capitalize">{otherUserName}</div>}
                            {message.content}
                        </div>
                    </div>
                </div>
                {isYourMessage && yourProfile && yourIcon}
            </div>
        </div>
    );
}