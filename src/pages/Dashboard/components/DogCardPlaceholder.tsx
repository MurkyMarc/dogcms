
import { cn } from "../../../utils/cn"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    loading?: boolean
}

export function DogCardPlaceholder({
    className,
    children,
    loading = false,
    ...props
}: Props) {
    return (
        <div className={cn("flex items-center justify-center aspect-[3/4] min-w-[8rem] w-[8rem] md:w-[9.5rem] lg:w-[15rem] rounded-md", className, loading && "bg-gray-300 animate-pulse")} {...props}>
                <img
                    src={loading ? "/loading.gif" : "/placeholder.svg"}
                    className={cn(loading &&  "w-1/5 h-1/5")}
                />
            {children}
        </div>
    )
}
