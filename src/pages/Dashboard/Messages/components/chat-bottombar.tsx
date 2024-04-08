import {
    FileImage,
    SendHorizontal,
    ThumbsUp,
} from "lucide-react";
import { Message, loggedInUserData } from "../data";
import { EmojiPicker } from "./emoji-picker";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../../utils/cn";
import { buttonVariants } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";


interface ChatBottombarProps {
    sendMessage: (newMessage: Message) => void;
    isMobile: boolean;
}

const BottombarIcons = [{ icon: FileImage }];

export default function ChatBottombar({
    sendMessage, isMobile,
}: ChatBottombarProps) {
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const handleThumbsUp = () => {
        const newMessage: Message = {
            id: message.length + 1,
            name: loggedInUserData.name,
            avatar: loggedInUserData.avatar,
            message: "👍",
        };
        sendMessage(newMessage);
        setMessage("");
    };

    const handleSend = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: message.length + 1,
                name: loggedInUserData.name,
                avatar: loggedInUserData.avatar,
                message: message.trim(),
            };
            sendMessage(newMessage);
            setMessage("");

            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }

        if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault();
            setMessage((prev) => prev + "\n");
        }
    };

    return (
        <div className="p-2 flex justify-between w-full items-center gap-2">
            <div className="flex">
                {!message.trim() && !isMobile && (
                    <div className="flex">
                        {BottombarIcons.map((icon, index) => (
                            <Link
                                key={index}
                                to="#"
                                className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "h-9 w-9",
                                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                                )}
                            >
                                <icon.icon size={20} className="text-muted-foreground" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div
                key="input"
                className="w-full relative"
            >
                <Textarea
                    autoComplete="off"
                    value={message}
                    ref={inputRef}
                    onKeyDown={handleKeyPress}
                    onChange={handleInputChange}
                    name="message"
                    placeholder="Aa"
                    className="min-h-9 w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background"
                ></Textarea>

                <div className="absolute right-2 bottom-0.5  ">
                    <EmojiPicker onChange={(value) => {
                        setMessage(message + value)
                        if (inputRef.current) {
                            inputRef.current.focus();
                        }
                    }} />
                </div>
            </div>

            {message.trim() ? (
                <Link
                    to="#"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-9",
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
                    )}
                    onClick={handleSend}
                >
                    <SendHorizontal size={20} className="text-muted-foreground" />
                </Link>
            ) : (
                <Link
                    to="#"
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-9",
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
                    )}
                    onClick={handleThumbsUp}
                >
                    <ThumbsUp size={20} className="text-muted-foreground" />
                </Link>
            )}
        </div>
    );
}
