import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/card";
import { Tables } from "../../../../utils/database.types";
import { formatMonthDayFromDateString } from "../../../../utils/helpers";
import { ProfileCircleIcon } from "../../components/ProfileCircleIcon";
import { useSession } from "../../../../api/hooks/useAuth";

interface ConversationCardProps {
    conversation: Tables<'conversations'>;
    role: 'customer' | 'employee';
}

const showUnreadCount = (role: 'customer' | 'employee', conversation: Tables<'conversations'>) => {
    if (role === 'customer' && conversation.customer_unread_count > 0) return true;
    if (role === 'employee' && conversation.employee_unread_count > 0) return true;
    return false;
}

export function ConversationCard({ conversation, role }: ConversationCardProps) {
    const session = useSession();
    const isYourMessage = session?.data?.user.id === conversation.last_message_sender;
    const otherUserProfile = role === 'customer' ? conversation.employee : conversation.customer;

    return (
        <Link to={`/dashboard/walk/${conversation.walk_id}/chat`}>
            <Card key={conversation.id} className="my-4 flex items-center p-4 hover:bg-gray-50 transition-colors hover:cursor-pointer">
                <div className="relative mr-4">
                    <ProfileCircleIcon className="flex justify-end" image={otherUserProfile?.image} name={otherUserProfile?.f_name} />
                    {showUnreadCount(role, conversation) && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {role === 'customer' ? conversation.customer_unread_count : conversation.employee_unread_count}
                        </div>
                    )}
                </div>
                <div className="flex-grow">
                    <CardHeader className="p-0">
                        <CardTitle className="text-lg">{otherUserProfile?.f_name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 mt-1 flex flex-shrink">
                        <p className="text-sm text-gray-500">
                            {isYourMessage ? <span className="font-bold">You: </span> : null}
                            {conversation.last_message}
                        </p>
                    </CardContent>
                </div>
                <div className="text-xs text-gray-400 ml-2 max-w-fit whitespace-nowrap">{formatMonthDayFromDateString(conversation.last_message_at || "")}</div>
            </Card>
        </Link>
    )
}

