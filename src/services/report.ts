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
const annualRevenueReport = async (year: number) => {
    const res = await axiosInstance.get(`/reports/annual-revenue/${year}`)
    return res.data
}
const flightRevenueReport = async (month: number, year: number) => {
    const res = await axiosInstance.get(`/reports/monthly-revenue/${month}/${year}`)
    return res.data
}
export { getAnnualRevenueReport, getMonthlyRevenueReport, getDashboard, getYearDashboard, annualRevenueReport, flightRevenueReport };