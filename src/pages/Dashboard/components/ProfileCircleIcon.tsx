import { cn } from "../../../utils/cn"
import { Tables } from "../../../utils/database.types"
import useSupabase from "../../../api/hooks/useSupabase"
import { useCallback, useEffect, useState } from "react"
import { CardPlaceholder } from "./CardPlaceholder"
import { errorToast } from "../../../utils/helpers"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"
import { CircleIconFallback } from "../../../components/ui/icons/CircleIconFallback"
import { getProfileAvatarUrl } from "../../../api/queries/profileQueries"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    profile: Tables<'profiles'> | null
    children?: React.ReactNode
    imageStyles?: string
}

export function ProfileCircleIcon({
    profile,
    className,
    imageStyles = "rounded-full w-12 h-12 cursor-default",
    ...props
}: Props) {
    const supabase = useSupabase();
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState<boolean>(false);

    const downloadImage = useCallback(async () => {
        if (!profile) return;
        try {
            setLoading(true);
            const { url } = await getProfileAvatarUrl(supabase, profile);
            if (url) setImageUrl(url);
        } catch (error) {
            errorToast(error);
        }
        setLoading(false);
    }, [supabase, profile])

    useEffect(() => {
        if (profile?.image) downloadImage();
    }, [profile?.image, downloadImage])

    return (
        <div className={cn(className, " min-w-max")} {...props}>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        {loading ? <CardPlaceholder className={cn(className, imageStyles)} loading={loading} /> :
                            imageUrl ?
                                <img
                                    src={imageUrl}
                                    alt={profile?.f_name || ""}
                                    className={cn(
                                        "rounded-md object-cover transition-all", imageStyles
                                    )}
                                /> : <CircleIconFallback text={profile?.f_name || ""} imageStyles={imageStyles} />
                        }
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{profile?.f_name || ""}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}