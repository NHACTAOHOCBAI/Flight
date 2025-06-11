import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTicket, deleteTicket, fetchAllTickets, getRevenue, updateTicket } from "../services/ticket";


export const useGetAllTickets = () => {
    return useQuery({
        queryKey: ["get all tickets"],
        queryFn: fetchAllTickets,
    });
};

export const useGetRevenue = (period: "year" | "month") => {
    return useQuery({
        queryKey: ["get revenue", period],
        queryFn: () => getRevenue(period),
    });
};

export const useCreateTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTicket,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all tickets"] });
        },
    });
};

type UpdateTicketVariables = { id: number; data: TicketRequest };

export const useUpdateTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: UpdateTicketVariables) => updateTicket(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all tickets"] });
        },
    });
};

export const useDeleteTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteTicket,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["get all tickets"] });
        },
    });
};
