import { useState, useCallback, useEffect } from "react";
import useSupabase from "../../../../api/hooks/useSupabase";
import { getMessageImageURL } from "../../../../api/queries/messageQueries";
import { cn } from "../../../../utils/cn";
import { errorToast } from "../../../../utils/helpers";
import { CardPlaceholder } from "../../components/CardPlaceholder";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    image: string
    children?: React.ReactNode
}

export function MessagePicCard({
    image,
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
            const { url } = await getMessageImageURL(supabase, image);
            if (url) setImageUrl(url);
        } catch (error) {
            errorToast(error);
        } finally {
            setLoading(false);
        }
    }, [image, supabase])

    useEffect(() => {
        let isMounted = true;

        const loadImage = async () => {
            if (image && isMounted) {
                await downloadImage();
            } else if (isMounted) {
                setLoading(false);
            }
        };

        loadImage();

        return () => { isMounted = false};
    }, [image, downloadImage]);

    return (
        <div className={cn(className)} {...props}>
            {loading ? <CardPlaceholder className={className} loading={loading} /> :
                <img
                    src={imageUrl}
                    className={cn(
                        "rounded-md object-cover transition-all", className
                    )}
                />
            }
            {children}
        </div>
    )
}