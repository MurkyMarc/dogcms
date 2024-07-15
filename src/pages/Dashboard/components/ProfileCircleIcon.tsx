import { cn } from "../../../utils/cn"
import useSupabase from "../../../api/hooks/useSupabase"
import { useCallback, useEffect, useMemo, useState } from "react"
import { CardPlaceholder } from "./CardPlaceholder"
import { errorToast } from "../../../utils/helpers"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"
import { CircleIconFallback } from "../../../components/ui/icons/CircleIconFallback"
import { getProfileAvatarUrl } from "../../../api/queries/profileQueries"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    image?: string;
    name?: string;
    children?: React.ReactNode
    imageStyles?: string
}

export function ProfileCircleIcon({
    image,
    name,
    className,
    imageStyles = "rounded-full w-10 h-10 sm:w-12 sm:h-12 cursor-default",
    ...props
}: Props) {
    const supabase = useSupabase();
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    const downloadImage = useCallback(async () => {
        let isMounted = true;
        if (!image) return;

        try {
            setLoading(true);
            const { url } = await getProfileAvatarUrl(supabase, image);
            if (isMounted && url) setImageUrl(url);
        } catch (error) {
            isMounted && errorToast(error);
        } finally {
            isMounted && setLoading(false);
        }
        return () => { isMounted = false; };
    }, [image, supabase]);

    useEffect(() => {
        if (image) downloadImage();
    }, [image, downloadImage])

    const tooltipText = useMemo(() => {
        return (
            <TooltipContent>
                <p>{name}</p>
            </TooltipContent>
        )
    }, [name]);

    return (
        <div className={cn(className, " min-w-max")} {...props}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        {loading ? <CardPlaceholder className={cn(className, imageStyles)} loading={loading} /> :
                            imageUrl ?
                                <img
                                    src={imageUrl}
                                    alt={name || ""}
                                    className={cn(
                                        "rounded-md object-cover transition-all", imageStyles
                                    )}
                                /> : <CircleIconFallback text={name || ""} imageStyles={imageStyles} />
                        }
                    </TooltipTrigger>
                    {tooltipText}
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}