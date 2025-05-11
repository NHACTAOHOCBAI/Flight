import axiosInstance from "../configs/axiosConfig";

export const fetchAllSeats = () => axiosInstance.get(`/seats`);
export const createSeat = (newSeat: Seat) => axiosInstance.post(`/seats`, newSeat);
export const updateSeat = ({ id, updateSeat }: { id: number; updateSeat: Seat }) =>
    axiosInstance.put(`/seats/${id}`, updateSeat);
export const deleteSeat = (id: number) => axiosInstance.delete(`/seats/${id}`);
