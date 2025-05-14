// services/page.ts
import axiosInstance from "../configs/axiosConfig";

export const fetchPages = () => {
    return axiosInstance.get("/pages");
};
