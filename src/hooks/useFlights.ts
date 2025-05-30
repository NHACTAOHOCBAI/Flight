import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFlight, deleteFlight, fetchAllFlights, updateFlight } from "../services/flight";

export const useGetAllFlights = () => {
    return useQuery({
        queryKey: ['get all flights'],
        queryFn: fetchAllFlights
    });
};

export const useCreateFlight = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createFlight,
        onSuccess: async (_, __, context: { onSettled?: () => void }) => {
            await queryClient.invalidateQueries({ queryKey: ['get all flights'] });
            context?.onSettled?.();
        },
    });
};

export const useUpdateFlight = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateFlight,
        onSuccess: async (_, __, context: { onSettled?: () => void }) => {
            await queryClient.invalidateQueries({ queryKey: ['get all flights'] });
            context?.onSettled?.();
        },
    });
};

export const useDeleteFlight = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteFlight,
        onSuccess: async (_, __, context: { onSettled?: () => void }) => {
            await queryClient.invalidateQueries({ queryKey: ['get all flights'] });
            context?.onSettled?.();
        },
    });
};
