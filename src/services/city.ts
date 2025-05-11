import axiosInstance from "../configs/axiosConfig";
const fetchAllCities = () => {
    return axiosInstance.get(`/cities`);
}
const createCity = (newCity: City) => {
    return axiosInstance.post(`/cities`, newCity)
}

export { fetchAllCities, createCity }