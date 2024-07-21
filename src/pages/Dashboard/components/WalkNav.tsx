import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../utils/cn";
import { useEffect, useState } from "react";
import { useGetConversationByWalkId } from "../../../api/hooks/useMessages";
import { useSession } from "../../../api/hooks/useAuth";
import { identifyConversationUsers } from "../../../utils/helpers";
import { MenuButton } from "./MenuButton";
import BackButton from "../../../components/ui/icons/BackButton";

export default function WalkNav({ className }: React.HTMLAttributes<HTMLElement>) {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { data: session } = useSession();
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
    const { data: conversation } = useGetConversationByWalkId(id || "");
    const conversationUsers = identifyConversationUsers(conversation!, session?.user.id || "");
    const unreadCount = conversationUsers?.me.unreadCount || 0;

    useEffect(() => {
        const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const variant = isLargeScreen ? "link" : "secondary";
    const commonStyles = "p-1 sm:p-2 underline-offset-8 decoration-blue-400 decoration-2 hover:bg-white " + (isLargeScreen ? "p-0 pr-4" : " flex-1");
    const isChatPath = location.pathname.endsWith("/chat");
    const summaryLinkStyles = isChatPath ? "text-muted-foreground lg:text-black bg-slate-100 lg:bg-inherit" : "lg:underline bg-white";
    const chatLinkStyles = isChatPath ? "lg:underline bg-white" : "text-muted-foreground lg:text-black bg-slate-100 lg:bg-inherit";

    return (
        <div className="flex justify-center items-center gap-4 mb-6">
            <MenuButton className="flex-shrink" />
            <div className={cn(className, "flex flex-auto gap-4 p-1.5 bg-slate-100 rounded-lg lg:p-0 lg:bg-white")}>
                <Button
                    variant={variant}
                    onClick={() => navigate(`/dashboard/walk/${id}`)}
                    className={cn(commonStyles, summaryLinkStyles)}
                >
                    Walk Summary
                </Button>
                <Button
                    variant={variant}
                    onClick={() => navigate(`/dashboard/walk/${id}/chat`)}
                    className={cn(commonStyles, chatLinkStyles)}
                >
                    Chat {unreadCount && unreadCount > 0 ? `(${unreadCount})` : null}
                </Button>
            </div>
            <BackButton className="flex-shrink" />
        </div>
    );
}