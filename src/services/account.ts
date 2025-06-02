import axiosInstance from "../configs/axiosConfig";

export const fetchAllAccounts = () => axiosInstance.get("/accounts");

export const createAccount = ({ account, avatar, }: { account: AccountRequest; avatar?: File; }) => {
    console.log(avatar)
    const formData = new FormData();
    formData.append("account", new Blob([JSON.stringify(account)], { type: "application/json", }));
    if (avatar)
        formData.append("avatar", avatar);
    return axiosInstance.post("/accounts", formData);
};
export const updateAccount = ({ id, account, avatar }: { id: number, account: AccountRequest, avatar?: File }) => {
    const formData = new FormData();
    formData.append("account", new Blob([JSON.stringify(account)], { type: 'application/json' }));
    if (avatar)
        formData.append("avatar", avatar);
    return axiosInstance.put(`/accounts/${id}`, formData);
};

export const deleteAccount = (id: number) =>
    axiosInstance.delete(`/accounts/${id}`);
