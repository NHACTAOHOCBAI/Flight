import axiosInstance from "../configs/axiosConfig";

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

const fetchAllFlights = (filters: FlightFilter) => {
    const params: Record<string, string | number | boolean> = {};
    console.log(filters)
    if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;
    if (filters.arrivalDate) params.arrivalDate = filters.arrivalDate;
    if (filters.departureDate) params.departureDate = filters.departureDate;
    if (filters.straight !== undefined) params.straight = filters.straight;
    if (filters.seats && filters.seats.length > 0) params.seats = filters.seats.join(",");
    if (filters.airlines && filters.airlines.length > 0) params.airlines = filters.airlines.join(",");
    console.log(params)
    return axiosInstance.get("/flights", { params });
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
export { fetchAllFlights, createFlight, updateFlight, deleteFlight, getFlightCount }