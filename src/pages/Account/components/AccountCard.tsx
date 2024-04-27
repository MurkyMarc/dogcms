import { cn } from "../../../utils/cn"
import { Tables } from "../../../utils/database.types"
import useSupabase from "../../../api/hooks/useSupabase"
import { getAvatarURL } from "../../../api/queries/avatarQueries"
import { useCallback, useEffect, useState } from "react"
import { CardPlaceholder } from "../../Dashboard/components/CardPlaceholder"
import { toast } from "sonner"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    profile: Tables<'profiles'>
    children?: React.ReactNode
}

export function AccountCard({
    profile,
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
            const { url } = await getAvatarURL(supabase, path);
            if (url) setImageUrl(url);
        } catch (error) {
            toast.error("Something went wrong", {
                description: (error as Error).message,
                cancel: {
                    label: 'Dismiss',
                    onClick: () => { },
                }
            });
        }
        setLoading(false);
    }, [supabase])

    useEffect(() => {
        if (profile.image) downloadImage(profile.image);
    }, [profile.image, downloadImage])

    return (
        <div className={cn(className)} {...props}>
            {loading ? <CardPlaceholder className={className} loading={true} /> :
                <img
                    src={imageUrl}
                    alt={profile.username || ""}
                    className={cn(
                        "rounded-md object-cover transition-all aspect-[3/4]", className
                    )}
                />
            }
            {children}
        </div>
    )
}