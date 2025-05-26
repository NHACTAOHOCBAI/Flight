/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    exp: number;
    iat: number;
    user?: {
        id: number;
        name: string;
        username: string;
    };
    permissions?: string[];
    [key: string]: any;
}

export const getUserRoleFromToken = (): {
    id?: number;
    name?: string;
    username?: string;
    permissions?: string[];
} | null => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const { user, permissions } = decoded;

        if (!user) return null;

        return {
            ...user,
            permissions: permissions || [],
        };
    } catch (error) {
        console.error("Token decoding failed:", error);
        return null;
    }
};
