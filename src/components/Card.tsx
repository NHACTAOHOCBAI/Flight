import type { ReactNode } from "react";

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
    return (
        <div className={`rounded-2xl shadow-md bg-white ${className}`}>
            {children}
        </div>
    );
};
