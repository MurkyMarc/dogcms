import { useEffect, useRef } from "react";
import { cn } from "../../../../utils/cn";
import ChatBottombar from "./customer-chat-bottom-bar";
import { Tables, TablesInsert } from "../../../../utils/database.types";
import { useSession } from "../../../../api/hooks/useAuth";
import { ProfileCircleIcon } from "../../components/ProfileCircleIcon";
import { identifyConversationUsers } from "../../../../utils/helpers";

interface ChatListProps {
    messages: Tables<'messages'>[];
    conversation: Tables<'conversations'>;
    sendMessage: (newMessage: TablesInsert<'messages'>) => void;
    isMobile: boolean;
}

export function CustomerChatList({
    messages,
    conversation,
    sendMessage,
    isMobile,
}: ChatListProps) {
    const { data: session } = useSession();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const conversationUsers = identifyConversationUsers(conversation!, session!);

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
                {messages.map((message, index) => {
                    const isYourMessage = message.sender_id == session?.user.id;
                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                                message.sender_id == session?.user.id ? "items-end" : "items-start"
                            )}
                        >
                            <div className="flex gap-3 items-center">
                                {!isYourMessage && conversationUsers?.other && <ProfileCircleIcon profile={conversationUsers.other} />}
                                <span className={cn("bg-accent py-2 px-3 rounded-lg max-w-xs sm:max-w-lg", isYourMessage ? "rounded-tr-none" : "rounded-tl-none")}>
                                    {message.content}
                                </span>
                                {isYourMessage && conversationUsers?.me  && <ProfileCircleIcon profile={conversationUsers.me} />}
                            </div>
                        </div>
                    )
                })}
            </div>
            <ChatBottombar sendMessage={sendMessage} isMobile={isMobile} conversation={conversation} />
        </div>
    );
}
