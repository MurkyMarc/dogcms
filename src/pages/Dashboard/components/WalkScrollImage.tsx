import { cn } from "../../../utils/cn"
import { Tables } from "../../../utils/database.types"
import useSupabase from "../../../api/hooks/useSupabase"
import { getDogImageURL } from "../../../api/queries/dogQueries"
import { useCallback, useEffect, useState } from "react"
import { CardPlaceholder } from "./CardPlaceholder"
import { errorToast } from "../../../utils/helpers"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    dog: Tables<'dogs'>
    selectedDogIds: number[];
    setDogIds: React.Dispatch<React.SetStateAction<number[]>>
}

export function WalkScrollImage({
    dog,
    className,
    setDogIds,
    selectedDogIds = [],
    ...props
}: Props) {
    const supabase = useSupabase();
    const [imageUrl, setImageUrl] = useState("/placeholder.svg");
    const [loading, setLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState(selectedDogIds.includes(dog.id));

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

    const handleClick = () => {
        setSelected(!selected);
        setDogIds((dogs) => {
            if (dogs.includes(dog.id)) {
                return dogs.filter((id) => id !== dog.id);
            }
            return [...dogs, dog.id];
        });
    }

    return (
        <div key={dog.id} className={cn("p-2 m-1 shrink-0 rounded-md cursor-pointer", selected && "bg-blue-200", !selected && "hover:bg-blue-100")} onClick={handleClick}>
            <div className="rounded-md">
                <div className={cn(className)} {...props}>
                    {loading ? <CardPlaceholder className={"aspect-[3/4] w-24"} loading={loading} /> :
                        <img
                            src={imageUrl}
                            alt={dog.name || ""}
                            className={cn(
                                "rounded-md object-cover transition-all aspect-[3/4] w-24"
                            )}
                        />
                    }
                </div>
            </div>
            <figcaption className="pt-2 text-xs text-muted-foreground text-center">
                <span className="font-semibold text-foreground">
                    {dog.name}
                </span>
            </figcaption>
        </div>
    )
}
