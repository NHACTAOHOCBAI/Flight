// services/page.ts
import axiosInstance from "../configs/axiosConfig";

export const fetchPages = async () => {
    return (await axiosInstance.get("/pages")).data.result;
};
