import axiosInstance from "../configs/axiosConfig";

export const getAllParamaters = async () => {
    return await axiosInstance.get("/parameters");
};
export const updateParameter = async (parameters: {
    maxInterQuantity?: number,
    minFlightTime?: number,
    minStopTime?: number,
    maxStopTime?: number,
    latestBookingDays?: number,
    LatestCancelDays?: number,
}) => {
    return await axiosInstance.put("/parameters", parameters);
}
