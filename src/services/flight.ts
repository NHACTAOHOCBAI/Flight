import axiosInstance from "../configs/axiosConfig";

const fetchAllFlights = () => {
    return axiosInstance.get(`/flights`);
}
const createFlight = (newFlight: FlightRequest) => {
    return axiosInstance.post(`/flights`, newFlight)
}
const updateFlight = ({ id, updateFlight }: { id: number, updateFlight: FlightRequest }) => {
    return axiosInstance.post(`/flights/${id}`, updateFlight);
}
const deleteFlight = (id: number) => {
    return axiosInstance.delete(`flights/${id}`)
}
export { fetchAllFlights, createFlight, updateFlight, deleteFlight }