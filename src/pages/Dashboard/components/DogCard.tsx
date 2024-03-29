import { Dog } from "../data/albums"
import { cn } from "../../../utils/cn"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "../../../components/ui/context-menu"
import { Link } from "react-router-dom"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    dog: Dog
    aspectRatio?: "portrait" | "square"
    width?: number
    height?: number
}

export function DogCard({
    dog,
    aspectRatio = "portrait",
    width,
    height,
    className,
    ...props
}: Props) {
    return (
        <div className={cn("space-y-3", className)} {...props}>
            <Link to={`/dashboard/dogs/${dog.id}`}>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div>
                        <img
                            src={dog.cover}
                            alt={dog.name}
                            width={width}
                            height={height}
                            className={cn(
                                " rounded-md md:h-auto md:w-auto object-cover transition-all hover:scale-105",
                                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                            )}
                        />
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-40">
                    <ContextMenuItem>Open</ContextMenuItem>
                    <ContextMenuItem>Edit</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Delete</ContextMenuItem>
                    <ContextMenuItem>Share</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <div className="space-y-1 text-sm">
                <h3 className="font-medium leading-none pt-2">{dog.name}</h3>
                {/* <p className="text-xs text-muted-foreground">{album.artist}</p> */}
            </div>
            </Link>
        </div>
    )
}