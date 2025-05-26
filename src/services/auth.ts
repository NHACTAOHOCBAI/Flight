import axiosInstance from "../configs/axiosConfig";
const login = ({ username, password }: { username: string, password: string }) => {
    return axiosInstance.post('/auth/login', { username, password })
}

const register = ({ account }: { account: { username: string, password: string, fullName: string, phone: string } }) => {
    const formData = new FormData();
    formData.append("registerRequest", new Blob([JSON.stringify(account)], { type: 'application/json' }));
    return axiosInstance.post("/auth/register", formData);
};

export { login, register }