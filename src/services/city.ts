import axiosInstance from "../configs/axiosConfig";
const fetchAllCities = () => {
    return axiosInstance.get(`/cities`);
}

export { fetchAllCities }