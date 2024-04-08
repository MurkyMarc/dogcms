import { Link } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { cn } from "../../../utils/cn"
import { CalendarDays, Dog, MessageSquareMore, PawPrint } from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Menu
                    </h2>
                    <div className="space-y-1">
                        <Link to="/dashboard">
                            <Button variant="ghost" className="w-full justify-start">
                                <Dog size={20} className="mr-2 stroke-black" />
                                My Dogs
                            </Button>
                        </Link>
                        <Link to="/dashboard/walks">
                            <Button variant="ghost" className="w-full justify-start">
                                <PawPrint size={20} className="mr-2 stroke-black" />
                                Walks
                            </Button>
                        </Link>
                        <Link to="/dashboard/schedules">
                            <Button variant="ghost" className="w-full justify-start">
                                <CalendarDays size={20} className="mr-2 stroke-black" />
                                Schedules
                            </Button>
                        </Link>
                        <Link to="/dashboard/messages">
                            <Button variant="ghost" className="w-full justify-start">
                                <MessageSquareMore size={20} className="mr-2 stroke-black" />
                                Messages
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
