import axiosInstance from "../configs/axiosConfig";

const fetchAllTickets = () => axiosInstance.get("/tickets");

const createTicket = (data: TicketRequest) =>
    axiosInstance.post("/tickets", data);

export { fetchAllTickets, createTicket };
