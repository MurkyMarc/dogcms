import { cn } from "../../../utils/cn"
import { Link } from "react-router-dom"
import { Tables } from "../../../utils/database.types"
import useSupabase from "../../../api/hooks/useSupabase"
import { getDogImageURL } from "../../../api/queries/dogQueries"
import { useCallback, useEffect, useState } from "react"
import { CardPlaceholder } from "./CardPlaceholder"
import { errorToast } from "../../../utils/helpers"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    dog: Tables<'dogs'>
    children?: React.ReactNode
    imageStyles?: string
}

export function DogCard({
    dog,
    className,
    children,
    imageStyles,
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
            errorToast(error);
        }
        setLoading(false);
    }, [supabase])

    useEffect(() => {
        if (dog.image) downloadImage(dog.image);
    }, [dog.image, downloadImage])

    return (
        <div className={cn(className)} {...props}>
            <Link to={`/dashboard/dogs/${dog.id}`}>
                {loading ? <CardPlaceholder className={cn(className, imageStyles)} loading={loading} /> :
                    <img
                        src={imageUrl}
                        alt={dog.name || ""}
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