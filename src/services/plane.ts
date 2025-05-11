import axiosInstance from "../configs/axiosConfig";

const fetchAllPlanes = () => axiosInstance.get("/planes");

const createPlane = (data: { planeCode: string, planeName: string, airlineId: number }) =>
    axiosInstance.post("/planes", data);

const updatePlane = ({ id, updatePlane }: { id: number, updatePlane: { planeCode: string, planeName: string, airlineId: number } }) =>
    axiosInstance.put(`/planes/${id}`, updatePlane);

const deletePlane = (id: number) => axiosInstance.delete(`/planes/${id}`);

export { fetchAllPlanes, createPlane, updatePlane, deletePlane };
