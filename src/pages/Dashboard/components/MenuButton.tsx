import { cn } from "../../../utils/cn"
import { Link } from "react-router-dom"
import { Menu } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { MenuDrawer } from "../../../components/ui/menu-drawer"

export function MenuButton({ className }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <Link className={cn("lg:hidden", className)} to="#">
            <MenuDrawer>
                <Button className="p-3 lg:hidden h-auto" variant={"ghost"}>
                    <Menu className="h-6 w-6" />
                </Button>
            </MenuDrawer>
        </Link>
    )
}
