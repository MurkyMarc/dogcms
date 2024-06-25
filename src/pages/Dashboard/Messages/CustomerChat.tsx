import { CustomerChatList } from "./components/customer-chat-list";
import { cn } from "../../../utils/cn";
import { useGetConversationByWalkId, useGetConversationMessages, useSendMessage, useUpdateConversationUnreadCountAndLastViewedAt } from "../../../api/hooks/useMessages";
import { TablesInsert } from "../../../utils/database.types";
import { useSession } from "../../../api/hooks/useAuth";
import { identifyConversationUsers } from "../../../utils/helpers";
import { ProfileCircleIcon } from "../components/ProfileCircleIcon";
import useInterval from "../../../api/hooks/useInterval";

type CustomerChatProps = {
    walkId: string;
}

export function CustomerChat({ walkId }: CustomerChatProps) {
    const { data: session } = useSession();
    const sendMessageHook = useSendMessage();
    const { data: conversation, isLoading: conversationLoading } = useGetConversationByWalkId(walkId);
    const { data: messages, isLoading: messagesLoading } = useGetConversationMessages(conversation?.id.toString() || "");
    const conversationUsers = identifyConversationUsers(conversation!, session?.user.id || "");
    const updateConversation = useUpdateConversationUnreadCountAndLastViewedAt();

    const sendMessage = (message: TablesInsert<'messages'>) => sendMessageHook.mutate(message);

    useInterval(() => {
        if (conversation?.id && session?.user?.id) {
            updateConversation.mutate({ conversation, userId: session.user.id });
        }
    }, 5000);

    if (conversationLoading || messagesLoading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col w-full h-full">
            <div className={cn("w-full flex flex-wrap border-b pb-6")}>
                <ProfileCircleIcon profile={conversationUsers?.other.user || null} />
                <div className="flex flex-col justify-center items-center pl-4">
                    <span className="font-medium">{conversationUsers?.other?.user?.f_name}</span>
                </div>
            </div>
            <CustomerChatList
                sendMessage={sendMessage}
                messages={messages || []}
                conversation={conversation!}
            />
        </div>
    );
}