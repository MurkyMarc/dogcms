
import { Link } from 'react-router-dom';
import { Search, Phone } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { buttonVariants } from '../../../components/ui/button';
import { useRef, useState } from 'react';
import { Textarea } from '../../../components/ui/textarea';
import { UserData } from '../data';
import { ChatTopbarAvatar } from './chat-topbar-avatar';

interface ChatTopbarProps {
    selectedUser: UserData;
    isMobile: boolean;
}

export default function ChatTopbar({ selectedUser, isMobile }: ChatTopbarProps) {
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchString, setSearchString] = useState("");
    const searchInputRef = useRef<HTMLTextAreaElement>(null);

    const handleSearchButton = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
        setSearchOpen((prev) => !prev);
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSearchString(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmitSearch();
        }

        if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault();
            setSearchString((prev) => prev + "\n");
        }
    };

    const handleSubmitSearch = () => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }

    return (
        <div className={cn("w-full h-20 flex flex-wrap p-4 border-b", searchOpen ? "flex-end flex-col" : "justify-between")}>
            <div className="flex items-center gap-2">
                {searchOpen ? isMobile ? null :
                    <ChatTopbarAvatar selectedUser={selectedUser} /> : <ChatTopbarAvatar selectedUser={selectedUser} />
                }
            </div>
            <div className="flex flex-row">
                {isMobile && !searchOpen ?
                    <Link to="#" className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
                        <Phone size={20} className="text-muted-foreground" />
                    </Link> : null
                }
                <Textarea
                    autoComplete="off"
                    value={searchString}
                    ref={searchInputRef}
                    onKeyDown={handleKeyPress}
                    onChange={handleInputChange}
                    name="message"
                    placeholder="Enter a name"
                    className={cn("min-h-9 w-full border rounded-full flex items-center h-9 resize-none overflow-hidden bg-background", !searchOpen && "hidden")}
                ></Textarea>
                <Link to="#" onClick={handleSearchButton} className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "ml-4")}>
                    <Search size={20} className="text-muted-foreground" />
                </Link>
            </div>
        </div>
    )
}
