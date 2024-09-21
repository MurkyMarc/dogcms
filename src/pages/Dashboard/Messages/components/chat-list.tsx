import { useEffect, useRef, useCallback, useState } from "react";
import { Tables, TablesInsert } from "../../../../utils/database.types";
import { useSession } from "../../../../api/hooks/useAuth";
import { calculateName, identifyConversationUsers } from "../../../../utils/helpers";
import { Message } from "./message";
import { ScrollArea } from "../../../../components/ui/scroll-area";

interface ChatListProps {
    error: boolean;
    loading: boolean;
    messages: Tables<'messages'>[];
    conversation: Tables<'conversations'>;
    sendMessage: (newMessage: TablesInsert<'messages'>) => void;
}

export function ChatList({ messages, conversation, error, loading }: ChatListProps) {
    const { data: session } = useSession();
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const prevMessagesLengthRef = useRef(messages.length);
    const conversationUsers = identifyConversationUsers(conversation, session?.user.id || "");
    const otherUserName = calculateName(conversationUsers?.other?.user?.f_name, conversationUsers?.other?.user?.l_name);
    const yourName = calculateName(conversationUsers?.me?.user?.f_name, conversationUsers?.me?.user?.l_name);

    const scrollToBottom = useCallback((smooth = true) => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: smooth ? 'smooth' : 'auto'
                });
            }
        }
    }, []);

    const checkImagesAndScroll = useCallback(() => {
        const images = scrollAreaRef.current?.querySelectorAll('img') || [];
        let loadedImages = 0;
        const totalImages = images.length;

        if (totalImages === 0) {
            scrollToBottom(false);
            return;
        }

        const imageLoaded = () => {
            loadedImages++;
            if (loadedImages === totalImages) {
                scrollToBottom(false);
            }
        };

        images.forEach((img) => {
            if (img.complete) {
                imageLoaded();
            } else {
                img.addEventListener('load', imageLoaded);
                img.addEventListener('error', imageLoaded);
            }
        });
    }, [scrollToBottom]);

    useEffect(() => {
        if (isFirstLoad) {
            checkImagesAndScroll();
            scrollToBottom(true);
            setIsFirstLoad(false);
        } else if (messages.length > prevMessagesLengthRef.current) {
            scrollToBottom();
        }
        prevMessagesLengthRef.current = messages.length;
    }, [messages, isFirstLoad, checkImagesAndScroll, scrollToBottom]);

    return (
        <ScrollArea type="always" ref={scrollAreaRef} className="flex-1 w-full px-4 border rounded-md">
            {error ? <StatusMessage status="Conversation not found" /> :
                loading ? <StatusMessage status="Loading..." /> :
                    messages.length > 0 ? messages.map((message) => (
                        <Message
                            key={message.id}
                            message={message}
                            isYourMessage={message.sender_id === session?.user.id}
                            otherUserName={otherUserName}
                            otherUserProfile={conversationUsers?.other?.user}
                            yourProfile={conversationUsers?.me?.user}
                            yourName={yourName}
                        />
                    )) : (
                        <div className="text-center mt-60">
                            <h1 className="text-lg font-bold">No messages yet</h1>
                            <p className="text-sm text-muted-foreground">
                                Send a message to start chatting.
                            </p>
                        </div>
                    )}
        </ScrollArea>
    );
}

const StatusMessage = ({ status }: { status: string }) => {
    return (
        <div className="text-center mt-60">
            <h1 className="text-lg font-bold">{status}</h1>
        </div>
    )
}