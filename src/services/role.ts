// services/role.ts
import axiosInstance from "../configs/axiosConfig";

export const fetchAllRoles = async () => {
    const res = await axiosInstance.get("/roles");
    return res
}

export const createRole = (data: { roleName: string; pages: number[] }) =>
    axiosInstance.post("/roles", data);

export const updateRole = ({ id, updateRole }: { id: number; updateRole: { roleName: string; pages: number[] } }) =>
    axiosInstance.put(`/roles/${id}`, updateRole);

export const deleteRole = (id: number) => axiosInstance.delete(`/roles/${id}`);
