import { Card, CardHeader, CardTitle, CardContent } from "../../../../components/ui/card";
import { Tables } from "../../../../utils/database.types";
import { formatMonthDayFromDateString } from "../../../../utils/helpers";
import { ProfileCircleIcon } from "../../components/ProfileCircleIcon";

interface ConversationCardProps {
    conversation: Tables<'conversations'>;
}

export function ConversationCard({ conversation }: ConversationCardProps) {
    return (
        <Card key={conversation.id} className="my-4 flex items-center p-4 hover:bg-gray-50 transition-colors hover:cursor-pointer">
            <div className="relative mr-4">
                <ProfileCircleIcon className="flex justify-end" image={conversation.customer.image} name={conversation.customer.f_name} />
                {conversation.employee_unread_count > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {conversation.employee_unread_count}
                    </div>
                )}
            </div>
            <div className="flex-grow">
                <CardHeader className="p-0">
                    <CardTitle className="text-lg">{conversation.customer.f_name}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-1 flex flex-shrink">
                    <p className="text-sm text-gray-500">{conversation.last_message}</p>
                </CardContent>
            </div>
            <div className="text-xs text-gray-400 ml-2 max-w-fit whitespace-nowrap">{formatMonthDayFromDateString(conversation.last_message_at || "")}</div>
        </Card>
    )
}

