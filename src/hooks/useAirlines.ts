import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllAirlines, createAirline, updateAirline, deleteAirline } from "../services/airline";

export const useGetAllAirlines = () => {
    return useQuery({
        queryKey: ['get all airlines'],
        queryFn: fetchAllAirlines,
    });
};

export const useCreateAirline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createAirline,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['get all airlines'] });
        },
    });
};

export const useUpdateAirline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateAirline,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['get all airlines'] });
        },
    });
};

export const useDeleteAirline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteAirline,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['get all airlines'] });
        },
    });
};
