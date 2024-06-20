import { useEffect, useState } from "react";
import { CustomerChatList } from "./components/customer-chat-list";
import { cn } from "../../../utils/cn";
import { useGetConversationByWalkId, useGetConversationMessages } from "../../../api/hooks/useMessages";
import { TablesInsert } from "../../../utils/database.types";
import { useSession } from "../../../api/hooks/useAuth";
import { identifyConversationUsers } from "../../../utils/helpers";
import { ProfileCircleIcon } from "../components/ProfileCircleIcon";

type CustomerChatProps = {
    walkId: string;
}

export function CustomerChat({ walkId }: CustomerChatProps) {
    const [isMobile, setIsMobile] = useState(false);
    const { data: session } = useSession();
    const { data: conversation, isLoading: conversationLoading } = useGetConversationByWalkId(walkId);
    const { data: messages, isLoading: messagesLoading } = useGetConversationMessages(conversation?.id.toString() || "");
    const conversationUsers = identifyConversationUsers(conversation!, session!);

    useEffect(() => {
        const checkScreenWidth = () => setIsMobile(window.innerWidth <= 768);
        checkScreenWidth();
        window.addEventListener("resize", checkScreenWidth);

        return () => window.removeEventListener("resize", checkScreenWidth);
    }, []);

    const sendMessage = (message: TablesInsert<'messages'>) => {
        // setMessages([...messages, newMessage]);
        console.log(message);
    };

    if (conversationLoading || messagesLoading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col w-full h-full">
            <div className={cn("w-full flex flex-wrap border-b pb-6")}>
                <ProfileCircleIcon profile={conversationUsers?.other || null} />
                <div className="flex flex-col justify-center items-center pl-4">
                    <span className="font-medium">{conversation?.employee?.f_name}</span>
                </div>
            </div>
            <CustomerChatList
                sendMessage={sendMessage}
                isMobile={isMobile}
                messages={messages || []}
                conversation={conversation!}
            />
        </div>
    );
}