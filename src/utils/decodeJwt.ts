/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    exp: number;
    iat: number;
    permissions?: string[];
    account?: {
        id: number;
        username: string;
        fullName: string;
        phone: string;
        avatar: string | null;
        role: string | null;
    };
    [key: string]: any;
}

export const getUserRoleFromToken = (): {
    id?: number;
    username?: string;
    fullName?: string;
    phone?: string;
    avatar?: string | null;
    role?: string | null;
    permissions?: string[];
} | null => {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const { account, permissions } = decoded;

        if (!account) return null;

        return {
            ...account,
            permissions: permissions || [],
        };
    } catch (error) {
        console.error("Token decoding failed:", error);
        return null;
    }
};
