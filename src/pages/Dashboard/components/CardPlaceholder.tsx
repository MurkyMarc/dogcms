
import { cn } from "../../../utils/cn"

interface CardPlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
    loading?: boolean
}

export function CardPlaceholder({
    className,
    children,
    loading = false,
    ...props
}: CardPlaceholderProps) {
    return (
        <div className={cn("flex items-center justify-center", className, loading && "bg-gray-300 animate-pulse")} {...props}>
            <img
                src={loading ? "/loading.gif" : "/placeholder.svg"}
                className={cn(loading ? "w-1/5 h-1/5" : className)}
            />
            {children}
        </div>
    )
}
