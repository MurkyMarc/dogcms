import { useState, useMemo } from "react";
import { Input } from "../../../components/ui/input";
import { useGetConversations } from "../../../api/hooks/useMessages";
import { useProfile, useSession } from "../../../api/hooks/useAuth";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { ConversationCard } from "./components/conversation-card";
import TitleNav from "../../../components/TitleNav";

export function Conversations() {
    const { data: session } = useSession();
    const { data: profile } = useProfile();
    const [searchTerm, setSearchTerm] = useState('');
    const role = profile?.role === 'customer' ? 'customer' : 'employee';
    const { data: conversations } = useGetConversations(session?.user.id || "", role);

    const filteredConversations = useMemo(() => {
        if (!conversations) return [];
        return conversations.filter(
            conv => {
                const otherUser = role === 'customer' ? conv.employee : conv.customer;
                return otherUser?.f_name.toLowerCase().includes(searchTerm.toLowerCase());
            }
        ).sort((a, b) => {
            const dateA = a?.last_message_at ?? '';
            const dateB = b?.last_message_at ?? '';
            return dateB.localeCompare(dateA);
        });
    }, [conversations, searchTerm, role]);

    return (
        <div className="flex flex-col w-full max-h-[calc(100vh-5rem)] h-full">
            <TitleNav title="Your Conversations" />

            <form className="mb-2 md:mb-4 flex flex-shrink px-4 md:px-8 py-4">
                <Input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            {filteredConversations.length > 0 ?
                <ScrollArea className="rounded-md px-4 flex flex-1 border h-full mx-4 md:mx-8" type="always">
                    {filteredConversations.map((conv) => (
                        <ConversationCard key={conv.id} conversation={conv} role={role} />
                    ))}
                </ScrollArea>
                :
                <div className="rounded-md flex border h-full w-full justify-center items-center">
                    <StatusMessage status="No conversations found" />
                </div>
            }
        </div>
    );
}

const StatusMessage = ({ status }: { status: string }) => {
    return (
        <div>
            <h1 className="text-lg font-bold">{status}</h1>
        </div>
    )
}