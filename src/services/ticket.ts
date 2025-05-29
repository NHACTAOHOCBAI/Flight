
import axiosInstance from "../configs/axiosConfig";

export const fetchAllTickets = async () => {
    const res = await axiosInstance.get('/tickets');
    return res.data;
};

export const createTicket = async (data: TicketRequest) => {
    await axiosInstance.post('/tickets', data);
};

export const updateTicket = async (id: number, data: TicketRequest) => {
    await axiosInstance.put(`/tickets/${id}`, data);
};

export const deleteTicket = async (id: number) => {
    await axiosInstance.delete(`/tickets/${id}`);
};
