import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFlight, deleteFlight, fetchAllFlights, getFlightCount, updateFlight } from "../services/flight";


interface FlightFilter {
    minPrice?: number;
    maxPrice?: number;
    from?: string;
    to?: string;
    arrivalDate?: string;
    departureDate?: string;
    straight?: boolean;
    seats?: number[];
    airlines?: number[];
}

export const useGetAllFlights = (filters: FlightFilter = {}) => {
    return useQuery({
        queryKey: ['get all flights', filters],
        queryFn: () => fetchAllFlights(filters),
    });
};


export const useGetFlightCount = (period: "year" | "month") => {
    return useQuery({
        queryKey: ['get flights count', period],
        queryFn: () => getFlightCount(period)
    });
}

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
