import axiosInstance from "../configs/axiosConfig";
const getAnnualRevenueReport = ({ year }: { year: number }) => axiosInstance.get(`/reports/annual-revenue/${year}`)
const getMonthlyRevenueReport = ({ month, year }: { month: number, year: number }) => axiosInstance.get(`/reports/monthly-revenue/${month}/${year}`)
const getDashboard = () => axiosInstance.get('/dashboard')
const getYearDashboard = ({ year }: { year: number }) => axiosInstance.get(`/dashboard/${year}`)
export { getAnnualRevenueReport, getMonthlyRevenueReport, getDashboard, getYearDashboard };