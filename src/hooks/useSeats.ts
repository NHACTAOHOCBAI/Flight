import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSeat, deleteSeat, fetchAllSeats, updateSeat } from "../services/seat";

export const useGetAllSeats = () => {
    return useQuery({
        queryKey: ['get all seats'],
        queryFn: fetchAllSeats
    })
}

export const useCreateSeat = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createSeat,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['get all seats'] });
        },
    });
};

export const useUpdateSeat = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateSeat,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['get all seats'] });
        },
    });
};

export const useDeleteSeat = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteSeat,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['get all seats'] });
        },
    });
};
