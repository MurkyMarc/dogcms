
import { cn } from "../../../utils/cn"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "../../../components/ui/context-menu"
import { Link } from "react-router-dom"
import { Tables } from "../../../utils/database.types"
import useSupabase from "../../../hooks/useSupabase"
import { getDogImageURL } from "../../../queries/dogQueries"
import { useEffect, useRef, useState } from "react"
import { DogCardPlaceholder } from "./DogCardPlaceholder"

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
    const [loading, setLoading] = useState<boolean>(false);
    const downloadImageRef = useRef(downloadImage);

    async function downloadImage(path: string) {
        try {
            setLoading(true);
            const { url, error } = await getDogImageURL(supabase, path);
            if (error) throw error;
            setImageUrl(url);
        } catch (error) {
            alert((error as Error).message); // TODO - toast
        }
        setLoading(false);
    }

    useEffect(() => {
        if (dog.image) downloadImageRef.current(dog.image);
    }, [dog.image, downloadImageRef])

    return (
        <div className={cn(className)} {...props}>
            <Link to={`/dashboard/dogs/${dog.id}`}>
                <ContextMenu>
                    <ContextMenuTrigger>
                        <div>
                            {loading ? <DogCardPlaceholder className="mb-2" loading /> :
                                <img
                                    src={imageUrl}
                                    alt={dog.name || ""}
                                    className={cn(
                                        "rounded-md object-cover transition-all aspect-[3/4]"
                                    )}
                                />}
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
            </Link>
            {children}
        </div>
    )
}