import axiosInstance from "../configs/axiosConfig";


const fetchAllFlights = () => {
    return axiosInstance.get("/flights");
};
const createFlight = (newFlight: FlightRequest) => {
    return axiosInstance.post(`/flights`, newFlight)
}
const updateFlight = ({ id, updateFlight }: { id: number, updateFlight: FlightRequest }) => {
    return axiosInstance.put(`/flights/${id}`, updateFlight);
}
const deleteFlight = (id: number) => {
    return axiosInstance.delete(`flights/${id}`)
}
const getFlightCount = async (period: "year" | "month") => {
    return await axiosInstance.get(`/flights/flightcount?period=${period}`)
}
const getFlightById = (id: number) => {
    return axiosInstance.get(`/flights/${id}`)
}
export { fetchAllFlights, createFlight, updateFlight, deleteFlight, getFlightCount, getFlightById }