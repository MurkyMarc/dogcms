import { cn } from "../../../utils/cn"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "../../../components/ui/context-menu"
import { Link } from "react-router-dom"
import { Tables } from "../../../utils/database.types"
import useSupabase from "../../../hooks/useSupabase"
import { getDogImageURL } from "../../../queries/dogQueries"
import { useCallback, useEffect, useState } from "react"
import { CardPlaceholder } from "./CardPlaceholder"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    dog: Tables<'dogs'>
    children?: React.ReactNode
}

export function DogCard({
    dog,
    className,
    children,
    ...props
}: Props) {
    const supabase = useSupabase();
    const [imageUrl, setImageUrl] = useState("/placeholder.svg");
    const [loading, setLoading] = useState<boolean>(true);

    const downloadImage = useCallback(async (path: string) => {
        try {
            setLoading(true);
            const { url } = await getDogImageURL(supabase, path);
            if (url) setImageUrl(url);
        } catch (error) {
            alert((error as Error).message); // TODO - toast
        }
        setLoading(false);
    }, [supabase])

    useEffect(() => {
        if (dog.image) downloadImage(dog.image);
    }, [dog.image, downloadImage])

    return (
        <div className={cn(className)} {...props}>
            <Link to={`/dashboard/dogs/${dog.id}`}>
                {loading ? <CardPlaceholder className={className} loading={loading} /> :
                    <ContextMenu>
                        <ContextMenuTrigger>
                            <img
                                src={imageUrl}
                                alt={dog.name || ""}
                                className={cn(
                                    "hover:scale-105 rounded-md object-cover transition-all aspect-[3/4]", className
                                )}
                            />
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-40">
                            <ContextMenuItem>Open</ContextMenuItem>
                            <ContextMenuItem>Edit</ContextMenuItem>
                            <ContextMenuSeparator />
                            <ContextMenuItem>Delete</ContextMenuItem>
                            <ContextMenuItem>Share</ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                }
            </Link>
            {children}
        </div>
    )
}