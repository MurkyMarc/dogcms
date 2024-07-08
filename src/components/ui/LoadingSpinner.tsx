import { cn } from "../../utils/cn";

export const LoadingSpinner = ({ width = "24rem", className = "" }) => {
    return (
        <div className={cn("loading-spinner", className)}>
            <img width={width} src="/loading.gif" alt="Loading..." />
        </div>
    );
};