import { useEffect, useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../../components/ui/resizable";
import { Sidebar } from "./components/sidebar";
import { cn } from "../../../utils/cn";
import { Chat } from "./components/chat";
import { User, userData } from "./data";
import Cookies from "js-cookie";

export function EmployeeChat() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>(userData[0]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenWidth = () => setIsMobile(window.innerWidth <= 768);
        checkScreenWidth();
        window.addEventListener("resize", checkScreenWidth);

        return () => window.removeEventListener("resize", checkScreenWidth);
    }, []);

    return (
        <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
                Cookies.set("react-resizable-panels:layout", JSON.stringify(sizes));
            }}
            className="overflow-x-visible min-h-[50rem]"
        >
            <ResizablePanel
                defaultSize={isMobile? 8 : 30}
                collapsedSize={8}
                collapsible={true}
                minSize={8}
                maxSize={isMobile ? 8 : 30}
                onCollapse={() => {
                    setIsCollapsed(true);
                    Cookies.set("react-resizable-panels:collapsed", "true");
                }}
                onExpand={() => {
                    setIsCollapsed(false);
                    Cookies.set("react-resizable-panels:collapsed", "false");
                }}
                className={cn(
                    isCollapsed && "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out",
                )}
            >
                <Sidebar
                    isCollapsed={isCollapsed || isMobile}
                    users={userData}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                />
            </ResizablePanel>
            <ResizableHandle withHandle disabled={isMobile} />
            <ResizablePanel>
                <Chat
                    selectedUser={selectedUser}
                    isMobile={isMobile}
                />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
