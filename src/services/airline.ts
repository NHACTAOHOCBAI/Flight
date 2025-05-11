import axiosInstance from "../configs/axiosConfig";

const fetchAllAirlines = () => axiosInstance.get("/airlines");

const createAirline = (newAirline: Airline) => axiosInstance.post("/airlines", newAirline);

const updateAirline = ({ id, updateAirline }: { id: number; updateAirline: Airline }) =>
    axiosInstance.put(`/airlines/${id}`, updateAirline);

const deleteAirline = (id: number) => axiosInstance.delete(`/airlines/${id}`);

export { fetchAllAirlines, createAirline, updateAirline, deleteAirline };
