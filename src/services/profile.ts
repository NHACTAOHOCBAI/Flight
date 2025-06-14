import axiosInstance from "../configs/axiosConfig";
interface Profile {
    fullName: string;
    phone: string;
}
const updateProfile = ({ profile, avatar }: { profile: Profile, avatar?: File }) => {
    const formData = new FormData();
    formData.append("profile", new Blob([JSON.stringify(profile)], { type: 'application/json' }));
    console.log("Profile data:", formData.get("profile"));
    if (avatar)
        formData.append("avatar", avatar);
    return axiosInstance.put("/auth/profile", formData);
};
const updatePassword = async (value: { oldPassword: string, newPassword: string }) => {
    await axiosInstance.post("accounts/change-password", value)
}
export { updateProfile, updatePassword };
