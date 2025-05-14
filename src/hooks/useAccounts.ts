import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    fetchAllAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
} from "../services/account";

export const useGetAllAccounts = () => {
    return useQuery({
        queryKey: ["get all accounts"],
        queryFn: fetchAllAccounts,
    });
};

export const useCreateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAccount,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all accounts"] });
        },
    });
};

export const useUpdateAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAccount,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all accounts"] });
        },
    });
};

export const useDeleteAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAccount,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all accounts"] });
        },
    });
};
