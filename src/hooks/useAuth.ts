import { useMutation } from "@tanstack/react-query";

import { login } from "../services/auth";
import { useNavigate } from "react-router";
export const useLogin = () => {
    const navigator = useNavigate();
    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            localStorage.setItem('accessToken', data.data.accessToken);
            navigator('/admin/dashboard')
        },
    });
};
