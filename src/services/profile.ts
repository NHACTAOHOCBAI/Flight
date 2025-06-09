import axiosInstance from "../configs/axiosConfig";
const updateProfile = ({ account, avatar }: { account: AccountRequest, avatar?: File }) => {
    const formData = new FormData();
    formData.append("account", new Blob([JSON.stringify(account)], { type: 'application/json' }));
    if (avatar)
        formData.append("avatar", avatar);
    return axiosInstance.put("/auth/profile", formData);
};
// const updateProfile = ({ fullName, phone }: { fullName: string, phone: string }) =>
//     axiosInstance.put("/auth/profile", { fullName, phone });
export { updateProfile };
