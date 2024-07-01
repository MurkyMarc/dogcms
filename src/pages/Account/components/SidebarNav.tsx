import { cn } from "../../../utils/cn"
import { Link, useLocation } from "react-router-dom"
import { buttonVariants } from "../../../components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
    const { pathname } = useLocation();

    const links = [
        {
            title: "Account",
            href: "/account",
        },
        {
            title: "Profile",
            href: "/account/profile",
        },
        {
            title: "Address",
            href: "/account/address",
        },
        {
            title: "Notifications",
            href: "/account/notifications",
        }
    ]

    return (
        <nav
            className={cn(
                "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
                className
            )}
            {...props}
        >
            {links.map((item) => (
                <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        pathname === item.href
                            ? "bg-muted hover:bg-muted"
                            : "hover:bg-transparent hover:underline",
                        "justify-start"
                    )}
                >
                    {item.title}
                </Link>
            ))}
        </nav>
    )
}