import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllPlanes, createPlane, updatePlane, deletePlane } from "../services/plane";

export const useGetAllPlanes = () => {
    return useQuery({
        queryKey: ["get all planes"],
        queryFn: fetchAllPlanes
    });
};

export const useCreatePlane = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPlane,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all planes"] });
        }
    });
};

export const useUpdatePlane = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updatePlane,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all planes"] });
        }
    });
};

export const useDeletePlane = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePlane,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all planes"] });
        }
    });
};
