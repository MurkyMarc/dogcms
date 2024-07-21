import { selectRandomBackgroundColor } from "../../../utils/helpers";
import { cn } from "../../../utils/cn";
import { useCallback, useMemo } from "react";

type CircleIconFallbackProps = {
    text: string;
    imageStyles?: string;
}

export const CircleIconFallback = ({ text, imageStyles = "" }: CircleIconFallbackProps) => {
    const firstLetterUppercase = text.charAt(0).toUpperCase();
    const backgroundColor = useCallback(() => selectRandomBackgroundColor(), []);

    return useMemo(() => (
        <div className={cn(imageStyles, "flex flex-col justify-center sm:w-12 sm:h-12")} style={{ backgroundColor: backgroundColor(), border: `1px solid #e5e7eb` }}>
            {firstLetterUppercase}
        </div>
    ), [imageStyles, backgroundColor, firstLetterUppercase])
}