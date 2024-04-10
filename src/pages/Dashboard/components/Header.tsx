import { cn } from "../../../utils/cn"
import { Link } from "react-router-dom"
import { Menu, Search } from "lucide-react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { MenuDrawer } from "../../../components/ui/menu-drawer"

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    showSearch?: boolean;
    handleSearch?: () => void
}

export function Header({ className, title, handleSearch, showSearch = false }: HeaderProps) {
    return (
        <header className={cn("flex h-16 items-center gap-4 border-b bg-gray-50 px-6", className)}>
            <Link className="lg:hidden" to="#">
                <MenuDrawer>
                    <Button className="px-2 lg:hidden h-auto" variant={"ghost"}>
                        <Menu className="h-6 w-6" />
                    </Button>
                </MenuDrawer>
            </Link>
            <div className="flex-1">
                <h1 className="font-semibold text-lg">{title}</h1>
            </div>
            {showSearch ?
                <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <form className="ml-auto flex-1 sm:flex-initial">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                className="pl-8 sm:w-80 bg-white"
                                placeholder="Search..."
                                type="search"
                                onChange={handleSearch}
                            />
                        </div>
                    </form>
                </div>
                : null}
        </header>
    )
}
