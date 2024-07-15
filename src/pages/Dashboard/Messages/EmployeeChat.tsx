import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useGetConversationsByWalkerId } from "../../../api/hooks/useMessages";
import { useSession } from "../../../api/hooks/useAuth";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { ConversationCard } from "./components/conversation-card";

export function EmployeeChat() {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState('');
    const { data: conversations } = useGetConversationsByWalkerId(session?.user.id || "");

    const filteredConversations = useMemo(() => {
        if (!conversations) return [];
        return conversations.filter(
            conv => conv.customer.f_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [conversations, searchTerm]);

    return (
        <div className="flex flex-col h-full w-full p-8 md:max-h-[calc(100vh-3rem)]">
            <h1 className="text-2xl font-bold mb-4">Your Conversations</h1>

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

            <ScrollArea className="rounded-md px-4 flex flex-1 border" type="always">
                {filteredConversations.map((conv) => (
                    <ConversationCard key={conv.id} conversation={conv} />
                ))}
            </ScrollArea>
        </div>
    );
}