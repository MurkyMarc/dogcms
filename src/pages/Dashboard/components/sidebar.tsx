import { Link } from "react-router-dom"
import { Button } from "../../../components/ui/button"
import { NotebookText, BellIcon, Dog, LineChart, MessageSquareMore, Package, PawPrint, Users, CircleDollarSign } from 'lucide-react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { cn } from "../../../utils/cn";
import { useProfile } from "../../../api/hooks/useAuth";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const { data: profile } = useProfile();

    return (
        <div className={cn(className, "hidden border-r bg-gray-50 lg:block")}>
            <div className="flex flex-col gap-2">
                <div className="flex h-16 items-center border-b px-6">
                    <span className="">Menu</span>
                    <Button className="ml-auto h-9 w-9" size="icon" variant="outline">
                        <BellIcon className="h-4 w-4" />
                    </Button>
                </div>
                <div className="flex-1 py-2">
                    <nav className="px-4">
                        <Link to="/dashboard">
                            <Button variant="ghost" className="w-full justify-start px-3">
                                <Dog size={20} className="mr-3 stroke-black" />
                                My Dogs
                            </Button>
                        </Link>
                        <Link to="/dashboard/walks">
                            <Button variant="ghost" className="w-full justify-start px-3">
                                <PawPrint size={20} className="mr-3 stroke-black" />
                                Walks
                            </Button>
                        </Link>
                        <Link to="/dashboard/conversations">
                            <Button variant="ghost" className="w-full justify-start px-3">
                                <MessageSquareMore size={20} className="mr-3 stroke-black" />
                                Conversations
                            </Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button variant="ghost" className="w-full justify-start px-3">
                                <Users className="h-5 w-5 mr-3 stroke-black" />
                                Customers
                            </Button>
                        </Link>
                        <Link to="/dashboard/packages">
                            <Button variant="ghost" className="w-full justify-start px-3">
                                <Package className="h-5 w-5 mr-3 stroke-black" />
                                Packages
                            </Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button variant="ghost" className="w-full justify-start px-3">
                                <LineChart className="h-5 w-5 mr-3 stroke-black" />
                                Analytics
                            </Button>
                        </Link>
                        <Link to="/dashboard/transactions">
                            <Button variant="ghost" className="w-full justify-start px-3">
                                <NotebookText className="h-5 w-5 mr-3 stroke-black" />
                                Transactions
                            </Button>
                        </Link>
                        {profile?.role === 'admin' && (
                            <Link to="/dashboard/pricing">
                                <Button variant="ghost" className="w-full justify-start px-3">
                                    <CircleDollarSign className="h-5 w-5 mr-3 stroke-black" />
                                    Pricing
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
                {/* <div className="p-4 mt-72">
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle>Buy Credits</CardTitle>
                            <CardDescription>Purchase credits to schedule walks</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" size="sm">
                                Buy Credits
                            </Button>
                        </CardContent>
                    </Card>
                </div> */}
            </div>
        </div>
    )
}
