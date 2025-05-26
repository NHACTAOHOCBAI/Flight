import axiosInstance from "../configs/axiosConfig";
const getAnnualRevenueReport = ({ year }: { year: number }) => axiosInstance.get(`/reports/annual-revenue/${year}`)
const getMonthlyRevenueReport = ({ month, year }: { month: number, year: number }) => axiosInstance.get(`/reports/monthly-revenue/${month}/${year}`)
const getDashboard = async () => {
    const res = await axiosInstance.get('/dashboard')
    return res.data as Dashboard;
}
const getYearDashboard = async ({ year }: { year: number }) => {
    const res = await axiosInstance.get(`/dashboard/${year}`);
    return res.data as BookingRate
}
export { getAnnualRevenueReport, getMonthlyRevenueReport, getDashboard, getYearDashboard };