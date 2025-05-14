import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTicket, fetchAllTickets } from "../services/ticket";


export const useGetAllTickets = () => {
    return useQuery({
        queryKey: ['get all tickets'],
        queryFn: fetchAllTickets
    })
}

export const useCreateTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTicket,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['get all tickets'] });
        },
    });
};


