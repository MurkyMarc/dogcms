import { cn } from "../../../../utils/cn";
import { Tables } from "../../../../utils/database.types";
import { ProfileCircleIcon } from "../../components/ProfileCircleIcon";
import { MessagePicCard } from "./message-pic-card";

type MessageProps = {
    message: Tables<'messages'>;
    isYourMessage: boolean;
    otherUserName: string;
    otherUserProfile?: Tables<'profiles'> | null;
    yourProfile?: Tables<'profiles'> | null;
};

export function Message({ message, isYourMessage, otherUserName, otherUserProfile, yourProfile }: MessageProps) {
    return (
        <div className={cn("flex flex-col gap-2 p-2", isYourMessage ? "items-end" : "items-start")}>
            <div className="flex gap-3 items-end">
                {!isYourMessage && otherUserProfile && <ProfileCircleIcon profile={otherUserProfile} />}
                <div>
                    {message.pic && (
                        <div className="flex justify-end">
                            <MessagePicCard className="rounded-md max-w-60 pb-1" image={message.pic} />
                        </div>
                    )}
                    <div className={cn("flex", isYourMessage ? "flex-row-reverse" : "")}>
                        <div className={cn(
                            "w-fit justify-center border border-gray-200 bg-accent py-2 px-3 rounded-lg max-w-xs sm:max-w-lg",
                            isYourMessage ? "rounded-br-none" : "rounded-bl-none"
                        )}>
                            {!isYourMessage && <div className="font-bold text-xs capitalize">{otherUserName}</div>}
                            {message.content}
                        </div>
                    </div>
                </div>
                {isYourMessage && yourProfile && <ProfileCircleIcon className="flex justify-end" profile={yourProfile} />}
            </div>
        </div>
    );
}