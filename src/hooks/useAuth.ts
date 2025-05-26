import { useMutation } from "@tanstack/react-query";

import { login, register } from "../services/auth";
export const useLogin = () => {
    return useMutation({
        mutationFn: login,
    });
};
export const useRegister = () => {
    return useMutation({
        mutationFn: register,
    });
};
