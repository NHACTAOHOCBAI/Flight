import axiosInstance from "../configs/axiosConfig";

const fetchAllAirlines = () => axiosInstance.get("/airlines");

const createAirline = ({ airline, logo }: { airline: Airline, logo?: File }) => {
    const formData = new FormData();
    formData.append("airline", new Blob([JSON.stringify(airline)], { type: 'application/json' }));
    if (logo)
        formData.append("logo", logo);
    return axiosInstance.post("/airlines", formData);
};

const getPoplarAirlines = () => axiosInstance.get("/airlines/flights/airline-popular");
const updateAirline = ({ id, airline, logo }: { id: number, airline: Airline, logo?: File }) => {
    const formData = new FormData();
    formData.append("airline", new Blob([JSON.stringify(airline)], { type: 'application/json' }));
    if (logo)
        formData.append("logo", logo);
    return axiosInstance.put(`/airlines/${id}`, formData);
};

const deleteAirline = (id: number) => axiosInstance.delete(`/airlines/${id}`);

export { fetchAllAirlines, createAirline, updateAirline, deleteAirline, getPoplarAirlines };
