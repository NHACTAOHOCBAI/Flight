import axiosInstance from "../configs/axiosConfig";
const login = ({ username, password }: { username: string, password: string }) => {
    return axiosInstance.post('/login', { username, password })
}
export { login }