import { useCallback, useMemo } from "react";
import { ChatList } from "./components/chat-list";
import { useGetConversationByWalkId, useGetConversationMessages, useSendMessage, useUpdateConversationUnreadCountAndLastViewedAt } from "../../../api/hooks/useMessages";
import { TablesInsert } from "../../../utils/database.types";
import { useSession } from "../../../api/hooks/useAuth";
import useInterval from "../../../api/hooks/useInterval";
import ChatBottombar from "./components/chat-bottom-bar";

type ConversationProps = {
    walkId: string;
}

export function Conversation({ walkId }: ConversationProps) {
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

    const sortedMessages = useMemo(() => {
        return [...messages || []].sort((a, b) => a.created_at.localeCompare(b.created_at));
    }, [messages]);

    const messagesList = useMemo(() => {
        return (
            <div className="w-full flex flex-col h-[80vh]">
                <ChatList
                    sendMessage={sendMessage}
                    messages={sortedMessages}
                    conversation={conversation!}
                />
                {conversation ? <ChatBottombar sendMessage={sendMessage} conversationId={conversation?.id} /> : null}
            </div>
        );
    }, [conversation, sortedMessages, sendMessage]);

    if (conversationLoading || messagesLoading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col w-full h-full">
            {messagesList}
        </div>
    );
}