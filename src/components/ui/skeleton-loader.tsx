interface SkeletonLoaderProps {
    children?: React.ReactNode;
    width?: number;
    height?: number;
    borderRadius?: number;
    variant: "rectangle" | "circle" | "text";
    fontSize?: string;
    backgroundColorStart?: string;
    backgroundColorEnd?: string;
    className: string;
}

export const SkeletonLoader = ({ children, width, height, variant, borderRadius, backgroundColorStart, backgroundColorEnd, fontSize, className = "" }: SkeletonLoaderProps) => {

    const variants = {
        rectangle: { borderRadius: "4px" },
        circle: { borderRadius: "1000px" },
        text: { width: "100%", borderRadius: "4px" }
    }

    const fadeInAnimation = `
        @keyframes skeletonLoaderAnimate{
            from {
                background: ${backgroundColorStart ? backgroundColorStart : '#efefef'};
            }
            to {
                background: ${backgroundColorEnd ? backgroundColorEnd : '#e4e4e4'};
            }
        }
    `;

    return (
        <>
            <style>{fadeInAnimation}</style>
            <div className={className} style={
                {
                    width: width,
                    animation: 'skeletonLoaderAnimate 1s 0s linear infinite alternate',
                    ...(variant ? variants[variant] : variants["rectangle"]),
                    ...(borderRadius ? { 'borderRadius': borderRadius + "px" } : {}),
                    ...(fontSize ? { 'height': fontSize } : { height: height })
                }
            }>
                {children}
            </div>
        </>
    );
};