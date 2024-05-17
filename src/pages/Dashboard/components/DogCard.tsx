import { cn } from "../../../utils/cn"
import { Link } from "react-router-dom"
import useSupabase from "../../../api/hooks/useSupabase"
import { getDogImageURL } from "../../../api/queries/dogQueries"
import { useCallback, useEffect, useState } from "react"
import { CardPlaceholder } from "./CardPlaceholder"
import { errorToast } from "../../../utils/helpers"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    itemId?: number
    image?: string
    localImage?: boolean
    name?: string
    children?: React.ReactNode
    imageStyles?: string
}

export function DogCard({
    itemId,
    image,
    localImage = false,
    name,
    className,
    children,
    imageStyles,
    ...props
}: Props) {
    const supabase = useSupabase();
    const [imageUrl, setImageUrl] = useState("/placeholder.svg");
    const [loading, setLoading] = useState<boolean>(false);

    const downloadImage = useCallback(async (path: string) => {
        try {
            setLoading(true);
            const { url } = await getDogImageURL(supabase, path);
            if (url) setImageUrl(url);
        } catch (error) {
            errorToast(error);
        }
        setLoading(false);
    }, [supabase])

    useEffect(() => {
        if (localImage && image) {
            setImageUrl(image);
        } else if (!localImage && image) {
            downloadImage(image);
        }
    }, [image, downloadImage, localImage])

    return (
        <div className={cn(className)} {...props}>
            <Link to={ itemId ? `/dashboard/dogs/${itemId}` : "#" } className={cn(!itemId && "cursor-default")}>
                {loading ? <CardPlaceholder className={cn(className, imageStyles)} loading={loading} /> :
                    <img
                        src={imageUrl}
                        alt={name || ""}
                        className={cn(
                            "rounded-md object-cover transition-all aspect-[3/4]", imageStyles
                        )}
                    />
                }
            </Link>
            {children}
        </div>
    )
}