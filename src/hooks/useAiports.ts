import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllAirports, createAirport, updateAirport, deleteAirport } from "../services/airport";

export const useGetAllAirports = () => {
    return useQuery({
        queryKey: ["get all airports"],
        queryFn: fetchAllAirports
    });
};

export const useCreateAirport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAirport,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all airports"] });
        }
    });
};

export const useUpdateAirport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAirport,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all airports"] });
        }
    });
};

export const useDeleteAirport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAirport,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all airports"] });
        }
    });
};
