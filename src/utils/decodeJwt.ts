/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    exp: number;
    iat: number;
    projectcnpm?: {
        principal?: {
            username?: string;
            authorities?: { role: string }[];
        };
    };
    [key: string]: any;
}

export const getUserRoleFromToken = (): string | null => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        return decoded.projectcnpm?.principal?.authorities?.[0]?.role || null;
    } catch (error) {
        console.error("Token decoding failed:", error);
        return null;
    }
};
