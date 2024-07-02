import { useEffect, useRef, useCallback, useState } from "react";
import { Tables, TablesInsert } from "../../../../utils/database.types";
import { useSession } from "../../../../api/hooks/useAuth";
import { identifyConversationUsers } from "../../../../utils/helpers";
import { Message } from "./message";
import ChatBottombar from "./customer-chat-bottom-bar";
import { cn } from "../../../../utils/cn";

interface ChatListProps {
    messages: Tables<'messages'>[];
    conversation: Tables<'conversations'>;
    sendMessage: (newMessage: TablesInsert<'messages'>) => void;
}

export function CustomerChatList({ messages, conversation, sendMessage }: ChatListProps) {
    const { data: session } = useSession();
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const conversationUsers = identifyConversationUsers(conversation, session?.user.id || "");
    const otherUserName = `${conversationUsers?.other?.user?.f_name} ${conversationUsers?.other?.user?.l_name?.charAt(0) || ''}`;

    const scrollToBottom = useCallback((smooth = true, delay = 0) => {
        if (messagesContainerRef.current) {
            setTimeout(() => {
                messagesContainerRef?.current?.scrollTo({
                    top: messagesContainerRef.current.scrollHeight,
                    behavior: smooth ? 'smooth' : 'smooth'
                });
            }, delay);
        }
    }, []);

    const checkImagesAndScroll = useCallback(() => {
        const images = messagesContainerRef.current?.querySelectorAll('img') || [];
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

        // Fallback: scroll after a timeout even if not all images have loaded
        setTimeout(() => scrollToBottom(false), 2000);
    }, [scrollToBottom]);

    useEffect(() => {
        if (isFirstLoad) {
            checkImagesAndScroll();
            scrollToBottom(true, 500); // Add delay only on first load
            setIsFirstLoad(false);
        } else {
            scrollToBottom();
        }
    }, [messages, isFirstLoad, checkImagesAndScroll, scrollToBottom]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    checkImagesAndScroll();
                }
            });
        });

        observer.observe(container, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [checkImagesAndScroll]);

    return (
        <div className="w-full flex flex-col h-[80vh]">
            <div
                ref={messagesContainerRef}
                className={cn("w-full overflow-y-auto overflow-x-hidden flex flex-col border-b border-gray-200 h-[80vh] ", messages.length == 0 && "justify-center")}
            >
                {messages.length > 0 ? messages.map((message) => (
                    <Message
                        key={message.id}
                        message={message}
                        isYourMessage={message.sender_id === session?.user.id}
                        otherUserName={otherUserName}
                        otherUserProfile={conversationUsers?.other?.user}
                        yourProfile={conversationUsers?.me?.user}
                    />
                )) :
                    <div className="text-center">
                        <h1 className="text-xl font-bold">No messages yet</h1>
                        <p className="text-sm text-muted-foreground">
                            Send a message to start chatting.
                        </p>
                    </div>}
            </div>
            <ChatBottombar sendMessage={sendMessage} conversation={conversation} />
        </div>
    );
}
