// hooks/useRoles.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllRoles, createRole, updateRole, deleteRole } from "../services/role";

export const useGetAllRoles = () => {
    return useQuery({ queryKey: ["get all roles"], queryFn: fetchAllRoles });
};

export const useCreateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createRole,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all roles"] });
        }
    });
};

export const useUpdateRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateRole,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all roles"] });
        }
    });
};

export const useDeleteRole = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteRole,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all roles"] });
        }
    });
};
