import { useCallback } from "react";
import { CustomerChatList } from "./components/customer-chat-list";
import { useGetConversationByWalkId, useGetConversationMessages, useSendMessage, useUpdateConversationUnreadCountAndLastViewedAt } from "../../../api/hooks/useMessages";
import { TablesInsert } from "../../../utils/database.types";
import { useSession } from "../../../api/hooks/useAuth";
import useInterval from "../../../api/hooks/useInterval";

type CustomerChatProps = {
    walkId: string;
}

export function CustomerChat({ walkId }: CustomerChatProps) {
    const { data: session } = useSession();
    const sendMessageHook = useSendMessage();
    const { data: conversation, isLoading: conversationLoading } = useGetConversationByWalkId(walkId);
    const { data: messages, isLoading: messagesLoading } = useGetConversationMessages(conversation?.id.toString() || "");
    const updateConversation = useUpdateConversationUnreadCountAndLastViewedAt();

    const sendMessage = useCallback((message: TablesInsert<'messages'>) => {
        sendMessageHook.mutate(message);
    }, [sendMessageHook]);

    useInterval(() => {
        if (conversation?.id && session?.user?.id) {
            updateConversation.mutate({ conversation, userId: session.user.id });
        }
    }, 5000);

    if (conversationLoading || messagesLoading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col w-full h-full">
            <CustomerChatList
                sendMessage={sendMessage}
                messages={messages || []}
                conversation={conversation!}
            />
        </div>
    );
}