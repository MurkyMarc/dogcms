import { Album } from "../data/albums"
import { cn } from "../../../utils/cn"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "../../../components/ui/context-menu"

interface AlbumArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
    album: Album
    aspectRatio?: "portrait" | "square"
    width?: number
    height?: number
}

export function AlbumArtwork({
    album,
    aspectRatio = "portrait",
    width,
    height,
    className,
    ...props
}: AlbumArtworkProps) {
    return (
        <div className={cn("space-y-3", className)} {...props}>
            <ContextMenu>
                <ContextMenuTrigger>
                    <div className="overflow-hidden rounded-md">
                        <img
                            src={album.cover}
                            alt={album.name}
                            width={width}
                            height={height}
                            className={cn(
                                "md:h-auto md:w-auto object-cover transition-all hover:scale-105",
                                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                            )}
                        />
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-40">
                    <ContextMenuItem>Add to Library</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Play Next</ContextMenuItem>
                    <ContextMenuItem>Play Later</ContextMenuItem>
                    <ContextMenuItem>Create Station</ContextMenuItem>
                    <ContextMenuSeparator />
                    <ContextMenuItem>Like</ContextMenuItem>
                    <ContextMenuItem>Share</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <div className="space-y-1 text-sm">
                <h3 className="font-medium leading-none">{album.name}</h3>
                <p className="text-xs text-muted-foreground">{album.artist}</p>
            </div>
        </div>
    )
}