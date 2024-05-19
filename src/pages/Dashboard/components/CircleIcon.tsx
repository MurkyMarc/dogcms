import { cn } from "../../../utils/cn"
import { Link } from "react-router-dom"
import { Tables } from "../../../utils/database.types"
import useSupabase from "../../../api/hooks/useSupabase"
import { getDogImageURL } from "../../../api/queries/dogQueries"
import { useCallback, useEffect, useMemo, useState } from "react"
import { CardPlaceholder } from "./CardPlaceholder"
import { errorToast, selectRandomBackgroundColor } from "../../../utils/helpers"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    dog: Tables<'dogs'>
    children?: React.ReactNode
    imageStyles?: string
}

export function CircleIcon({
    dog,
    className,
    imageStyles,
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

    const CircleIconFallback = useCallback(({ text }: { text: string }) => {
        const firstLetterUppercase = text.charAt(0).toUpperCase();
        const backgroundColor = selectRandomBackgroundColor();

        return (
            <div className={cn(imageStyles, "flex flex-col justify-center")} style={{ backgroundColor: backgroundColor, border: `1px solid #e5e7eb` }}>
                {firstLetterUppercase}
            </div>
        )
    }, [imageStyles]);

    const circleIconFallback = useMemo(() => CircleIconFallback({ text: dog.name }), [CircleIconFallback, dog.name]);

    return (
        <div className={cn(className)} {...props}>
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
                                            "rounded-md object-cover transition-all aspect-[3/4]", imageStyles
                                        )}
                                    /> : circleIconFallback
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