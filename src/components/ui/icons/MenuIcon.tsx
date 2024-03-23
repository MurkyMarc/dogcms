import { SVGProps } from "react";

export const MenuIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="0" x2="16" y1="3" y2="3" />
            <line x1="0" x2="16" y1="8" y2="8" />
            <line x1="0" x2="16" y1="13" y2="13" />
        </svg>
    )
}
