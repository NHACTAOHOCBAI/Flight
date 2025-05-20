import { useQuery } from "@tanstack/react-query";
import {
    getAnnualRevenueReport,
    getMonthlyRevenueReport,
    getDashboard,
    getYearDashboard,
} from "../services/report"; // điều chỉnh path nếu cần

export const useGetAnnualRevenueReport = (year: number) => {
    return useQuery({
        queryKey: ["get annual revenue report", year],
        queryFn: () => getAnnualRevenueReport({ year }),
    });
};

export const useGetMonthlyRevenueReport = (month: number, year: number) => {
    return useQuery({
        queryKey: ["get monthly revenue report", month, year],
        queryFn: () => getMonthlyRevenueReport({ month, year }),
    });
};

export const useGetDashboard = () => {
    return useQuery({
        queryKey: ["get dashboard"],
        queryFn: () => getDashboard(),
    });
};

export const useGetYearDashboard = (year: number) => {
    return useQuery({
        queryKey: ["get year dashboard", year],
        queryFn: () => getYearDashboard({ year }),
    });
};
