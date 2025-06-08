import axiosInstance from "../configs/axiosConfig";

const updateProfile = ({ fullName, phone }: { fullName: string, phone: string }) =>
    axiosInstance.put("/profile", { fullName, phone });
export { updateProfile };
