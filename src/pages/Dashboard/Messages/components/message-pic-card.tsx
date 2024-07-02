import { useState, useCallback, useEffect } from "react";
import useSupabase from "../../../../api/hooks/useSupabase";
import { getMessageImageURL } from "../../../../api/queries/messageQueries";
import { cn } from "../../../../utils/cn";
import { errorToast } from "../../../../utils/helpers";
import { CardPlaceholder } from "../../components/CardPlaceholder";
import { Dialog, DialogContent } from "../../../../components/ui/dialog";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    image: string;
    children?: React.ReactNode;
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
    const [isOpen, setIsOpen] = useState(false);

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
    }, [image, supabase]);

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

        return () => { isMounted = false };
    }, [image, downloadImage]);

    const openPopup = () => setIsOpen(true);

    return (
        <div className={cn(className)} {...props}>
            {loading ? (
                <CardPlaceholder className={className} loading={loading} />
            ) : (
                <img
                    src={imageUrl}
                    alt="Message Pic"
                    className={cn("rounded-lg object-cover transition-all cursor-pointer", className)}
                    onClick={openPopup}
                />
            )}
            {children}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="bg-white shadow-lg">
                    <div className="flex justify-center items-center p-4">
                        <img src={imageUrl} alt="Enlarged Message Pic" className="max-w-90vw max-h-90vh" />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
