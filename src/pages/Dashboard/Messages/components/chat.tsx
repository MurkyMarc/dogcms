import { Message, UserData } from "../data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import { useEffect, useState } from "react";

interface ChatProps {
    selectedUser: UserData;
    isMobile: boolean;
}

export function Chat({ selectedUser, isMobile }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>(selectedUser.messages);

    const sendMessage = (newMessage: Message) => {
        setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    useEffect(() => {
        setMessages(selectedUser.messages)
    }, [selectedUser.id, selectedUser.messages]);

    return (
        <div className="flex flex-col w-full h-full pb-4">
            <ChatTopbar selectedUser={selectedUser} isMobile={isMobile} />
            <ChatList
                selectedUser={selectedUser}
                sendMessage={sendMessage}
                isMobile={isMobile}
                messages={messages}
            />
        </div>
    );
}
