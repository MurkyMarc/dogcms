import { cn } from "../../../utils/cn"
import { Link } from "react-router-dom"
import { Tables } from "../../../utils/database.types"
import useSupabase from "../../../api/hooks/useSupabase"
import { getDogImageURL } from "../../../api/queries/dogQueries"
import { useCallback, useEffect, useState } from "react"
import { CardPlaceholder } from "./CardPlaceholder"
import { errorToast } from "../../../utils/helpers"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"
import { CircleIconFallback } from "../../../components/ui/icons/CircleIconFallback"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    dog: Tables<'dogs'>
    children?: React.ReactNode
    imageStyles?: string
}

export function DogCircleIcon({
    dog,
    className,
    imageStyles = "rounded-full w-12 h-12",
    ...props
}: Props) {
    const supabase = useSupabase();
    const [imageUrl, setImageUrl] = useState("");
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
        if (dog.image) downloadImage(dog.image);
    }, [dog.image, downloadImage])

    return (
        <div className={cn(className, "min-w-max")} {...props}>
            <Link to={`/dashboard/dogs/${dog.id}`} onClick={e => e.stopPropagation()}>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            {loading ? <CardPlaceholder className={cn(className, imageStyles)} loading={loading} /> :
                                imageUrl ?
                                    <img
                                        src={imageUrl}
                                        alt={dog.name || ""}
                                        className={cn(
                                            "rounded-md object-cover transition-all", imageStyles
                                        )}
                                    /> : <CircleIconFallback text={dog.name} imageStyles={imageStyles} />
                            }
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{dog.name}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </Link>
        </div>
    )
}