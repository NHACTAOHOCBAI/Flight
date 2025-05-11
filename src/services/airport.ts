import axiosInstance from "../configs/axiosConfig";
const fetchAllAirports = () => axiosInstance.get("/airports");
const createAirport = (data: { airportCode: string, airportName: string, cityId: number }) => axiosInstance.post("/airports", data);
const updateAirport = ({ id, updateAirport }: { id: number, updateAirport: { airportCode: string, airportName: string, cityId: number } }) => axiosInstance.put(`/airports/${id}`, updateAirport);
const deleteAirport = (id: number) => axiosInstance.delete(`/airports/${id}`);

export { fetchAllAirports, createAirport, updateAirport, deleteAirport };