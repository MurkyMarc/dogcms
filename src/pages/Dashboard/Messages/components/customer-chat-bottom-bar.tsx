import {
    FileImage,
    SendHorizontal,
    ThumbsUp,
    X,
} from "lucide-react";
import { EmojiPicker } from "./emoji-picker";
import { SetStateAction, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../../../utils/cn";
import { buttonVariants } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Tables, TablesInsert } from "../../../../utils/database.types";
import { useSession } from "../../../../api/hooks/useAuth";

interface ChatBottombarProps {
    conversation: Tables<'conversations'>;
    sendMessage: (newMessage: TablesInsert<'messages'>) => void;
}

export default function ChatBottombar({
    sendMessage, conversation
}: ChatBottombarProps) {
    const { data: session } = useSession();
    const [message, setMessage] = useState("");
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [selectedImage, setSelectedImage] = useState<SetStateAction<null> | File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | ArrayBuffer | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event?.target?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            setSelectedImage(file);
        }
    };

    const handleUpload = () => {
        // Implement upload logic here
        setSelectedImage(null);
        setPreviewUrl(null);
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Reset the file input value to allow re-selection of the same file
        }
    };

    const handleThumbsUp = () => {
        const newMessage: TablesInsert<'messages'> = {
            content: "👍",
            conversation_id: conversation.id,
            sender_id: session!.user.id
        };
        sendMessage(newMessage);
        setMessage("");
    };

    const handleSend = () => {
        if (message.trim()) {
            const newMessage: TablesInsert<'messages'> = {
                content: message.trim(),
                conversation_id: conversation.id,
                sender_id: session!.user.id
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
        <div>
            <div className={cn((previewUrl && typeof previewUrl === 'string') ? "mt-4 rounded-md flex justify-center bg-slate-50 border-dashed border-2 border-slate-300 p-1" : "hidden")}>
                {previewUrl && typeof previewUrl === 'string' && (
                    <div className="relative inline-block">
                        <img src={previewUrl} alt="Selected" className="max-w-32 max-h-32 rounded-md" />
                        <button
                            onClick={handleRemoveImage}
                            className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full p-1"
                        >
                            <X className="text-white" size={12} />
                        </button>
                    </div>
                )}
            </div>
            <div className="my-4 md:my-6 flex justify-between w-full items-center gap-2">
                <div className="flex">
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <div
                            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9 cursor-pointer")}
                            onClick={handleIconClick}
                        >
                            <FileImage size={20} className="text-muted-foreground" />
                        </div>
                    </div>
                    {selectedImage && (
                        <>
                            <button onClick={handleUpload}>Upload</button>
                        </>
                    )}
                </div>

                <div key="input" className="w-full relative">
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
                        to=""
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9 shrink-0")}
                        onClick={handleSend}
                    >
                        <SendHorizontal size={20} className="text-muted-foreground" />
                    </Link>
                ) : (
                    <Link
                        to=""
                        className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-9 w-9 shrink-0")}
                        onClick={handleThumbsUp}
                    >
                        <ThumbsUp size={20} className="text-muted-foreground" />
                    </Link>
                )}
            </div>
        </div>
    );
}
