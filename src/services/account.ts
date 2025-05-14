import axiosInstance from "../configs/axiosConfig";

export const fetchAllAccounts = () => axiosInstance.get("/accounts");

export const createAccount = (data: AccountRequest) =>
    axiosInstance.post("/accounts", data);

export const updateAccount = ({
    id,
    updateAccount,
}: {
    id: number;
    updateAccount: AccountRequest;
}) => axiosInstance.put(`/accounts/${id}`, updateAccount);

export const deleteAccount = (id: number) =>
    axiosInstance.delete(`/accounts/${id}`);
