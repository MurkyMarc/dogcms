import { cn } from "../../../utils/cn"
import { Tables } from "../../../utils/database.types"
import useSupabase from "../../../api/hooks/useSupabase"
import { getProfileAvatarUrl } from "../../../api/queries/profileQueries"
import { useCallback, useEffect, useState } from "react"
import { CardPlaceholder } from "../../Dashboard/components/CardPlaceholder"
import { errorToast } from "../../../utils/helpers"

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

    const downloadImage = useCallback(async () => {
        try {
            setLoading(true);
            const { url } = await getProfileAvatarUrl(supabase, profile.image);
            if (url) setImageUrl(url);
        } catch (error) {
            errorToast(error);
        } finally {
            setLoading(false);
        }
    }, [profile, supabase])

    useEffect(() => {
        let isMounted = true;

        const loadImage = async () => {
            if (profile.image && isMounted) {
                await downloadImage();
            } else if (isMounted) {
                setLoading(false);
            }
        };

        loadImage();

        return () => { isMounted = false};
    }, [profile.image, downloadImage]);

    return (
        <div className={cn(className)} {...props}>
            {loading ? <CardPlaceholder className={className} loading={loading} /> :
                <img
                    src={imageUrl}
                    alt={profile.f_name || ""}
                    className={cn(
                        "rounded-md object-cover transition-all aspect-[3/4]", className
                    )}
                />
            }
            {children}
        </div>
    )
}