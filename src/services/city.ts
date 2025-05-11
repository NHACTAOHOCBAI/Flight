import axiosInstance from "../configs/axiosConfig";
const fetchAllCities = () => {
    return axiosInstance.get(`/cities`);
}
const createCity = (newCity: City) => {
    return axiosInstance.post(`/cities`, newCity)
}
const updateCity = ({ id, updateCity }: { id: number; updateCity: City }) => {
    return axiosInstance.put(`/cities/${id}`, updateCity);
};
const deleteCity = (id: number) => {
    return axiosInstance.delete(`cities/${id}`)
}
export { fetchAllCities, createCity, updateCity, deleteCity }