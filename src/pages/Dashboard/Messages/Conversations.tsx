import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useGetConversations } from "../../../api/hooks/useMessages";
import { useProfile, useSession } from "../../../api/hooks/useAuth";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { ConversationCard } from "./components/conversation-card";
import { MenuButton } from "../components/MenuButton";

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
        <div className="flex flex-col w-full p-8 max-h-[calc(100vh-3rem)] h-full">
            <div className="flex items-center mb-4">
                <MenuButton className="mr-4" />
                <h1 className="text-xl md:text-2xl font-bold">Your Conversations</h1>
            </div>

            <form className="mb-4 flex flex-shrink">
                <Input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mr-2"
                />
                <Button type="submit">
                    <Search className="mr-2 h-4 w-4" /> Search
                </Button>
            </form>

            {filteredConversations.length > 0 ?
                <ScrollArea className="rounded-md px-4 flex flex-1 border h-full" type="always">
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