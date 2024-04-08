import { useEffect, useRef } from "react";
import { Message, UserData } from "../data";
import { cn } from "../../../../utils/cn";
import { Avatar, AvatarImage } from "../../../../components/ui/avatar";
import ChatBottombar from "./chat-bottombar";

interface ChatListProps {
    selectedUser: UserData;
    messages: Message[];
    sendMessage: (newMessage: Message) => void;
    isMobile: boolean;
}

export function ChatList({
    selectedUser,
    messages,
    sendMessage,
    isMobile,
}: ChatListProps) {
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col max-h-[44.5rem]">
            <div
                ref={messagesContainerRef}
                className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
            >
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={cn(
                            "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                            message.name == "You" ? "items-end" : "items-start"
                        )}
                    >
                        <div className="flex gap-3 items-center">
                            {message.name == selectedUser.name && (
                                <Avatar className="flex justify-center items-center">
                                    <AvatarImage
                                        src={message.avatar}
                                        alt={message.name}
                                        width={6}
                                        height={6}
                                    />
                                </Avatar>
                            )}
                            <span className={cn("bg-accent py-2 px-3 rounded-lg max-w-xs sm:max-w-lg", message.name == "You" ? "rounded-tr-none" : "rounded-tl-none")}>
                                {message.message}
                            </span>
                            {message.name !== selectedUser.name && (
                                <Avatar className="flex justify-center items-center">
                                    <AvatarImage
                                        src={message.avatar}
                                        alt={message.name}
                                        width={6}
                                        height={6}
                                    />
                                </Avatar>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <ChatBottombar sendMessage={sendMessage} isMobile={isMobile} />
        </div>
    );
}
