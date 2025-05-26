import { Select } from "antd";
import { Column, Pie } from "@antv/g2plot";
import { useEffect, useRef, useState } from "react";
import TicketReport from "../../components/dashboard/TicketReport";
import AnnualRevenue from "../../components/dashboard/AnnualRevenue";
import { useGetDashboard, useGetYearDashboard } from "../../hooks/useReports";
import getMonthName from "../../utils/getMonthName";

const Dashboard = () => {
    const { data } = useGetDashboard();
    return (
        <div className="w-full">
            <div className="w-full flex gap-[10px] justify-between flex-wrap gap-y-2">
                <Card title="Total Sales" thisYear={data?.revenueThisYear || 0} lastYear={data?.revenueLastYear || 0} thisMonth={data?.revenueThisMonth} lastMonth={data?.revenueLastMonth} filter={true} />
                <Card title="Flights" thisYear={data?.flightCountThisYear || 0} lastYear={data?.flightCountLastYear || 0} thisMonth={data?.flightCountThisMonth} lastMonth={data?.flightCountLastMonth} filter={true} />
                <Card title="Airlines" thisYear={data?.airlineCount || 0} />
                <Card title="Airports" thisYear={data?.airportCount || 0} />
            </div>

            <div className=" mt-[10px] gap-[10px] flex justify-between flex-wrap gap-y-2">
                <BookingRate />
                <PopularAirline />
            </div>
            <div className="flex gap-[10px] flex-wrap">
                <TicketReport />
                <AnnualRevenue />
            </div>
        </div>
    );
};

const Card = ({ title, thisYear, lastYear, thisMonth, lastMonth, filter = false }: { title: string, thisYear: number, lastYear?: number, thisMonth?: number, lastMonth?: number, filter?: boolean }) => {
    const [value, setValue] = useState(thisYear)
    const [preValue, setPreValue] = useState(lastYear)
    const onChange = (value: "year" | "month") => {
        if (value === "month") {
            setValue(thisMonth!)
            setPreValue(lastMonth!)
        }
        else {
            setValue(thisYear)
            setPreValue(lastYear)
        }
    }
    return (
        <div className="flex-1 drop-shadow-xs min h-[194px] min-w-[250px] bg-white px-[24px] py-[20px]">
            <div className="w-full flex justify-between items-center mb-2">
                <h3 className="opacity-45">{title}</h3>
                {filter && <Select
                    onChange={onChange}
                    defaultValue="year"
                    style={{ minWidth: 90 }}
                    options={[
                        { value: 'year', label: <span>The Year</span> },
                        { value: 'month', label: <span>The Month</span> },
                    ]}
                />}
            </div>
            <p className="text-[30px] font-medium">{value}</p>
            <p>{preValue}</p>
        </div>
    );
};
const BookingRate = () => {
    const [value, setValue] = useState(2025)
    const { data: bookingRateData } = useGetYearDashboard(value);
    const chartData = bookingRateData?.months.flatMap((item) => {
        const monthName = getMonthName(item.month);
        return [
            { name: "Booking", 月份: monthName, 月均降雨量: item.maxTickets },
            { name: "Ticket", 月份: monthName, 月均降雨量: item.ticketsSold },
        ];
    });

    const chartRef = useRef<HTMLDivElement>(null);
    const onChange = (value: number) => {
        setValue(value)
    }
    useEffect(() => {
        if (chartRef.current) {
            const stackedColumnPlot = new Column(chartRef.current, {
                data: chartData || [],
                isGroup: true,
                xField: "月份",
                yField: "月均降雨量",
                seriesField: "name",
                label: {
                    position: "middle",
                    layout: [
                        { type: "interval-adjust-position" },
                        { type: "interval-hide-overlap" },
                        { type: "adjust-color" },
                    ],
                },
            });

            stackedColumnPlot.render();

            return () => {
                stackedColumnPlot.destroy();
            };
        }
    }, [value, bookingRateData, chartData]);

    return (
        <div className="flex-5 min-w-[400px] w-full p-[10px] bg-white drop-shadow-xs">
            <div className="h-[56px] flex items-center text-[16px] font-medium justify-between">
                <h2>Booking Rate Overview</h2>
                <Select
                    onChange={onChange}
                    defaultValue={2025}
                    style={{ minWidth: 90 }}
                    options={[
                        { value: 2025, label: <span>2025</span> },
                        { value: 2024, label: <span>2024</span> },
                        { value: 2023, label: <span>2023</span> },
                    ]}
                />
            </div>
            <div ref={chartRef} className="h-[400px]" />
        </div>
    );
};


const PopularAirline = () => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const data = [
            { type: 'Vietjet', value: 100 },
            { type: 'Bamboo Airway', value: 40 },
            { type: 'Other', value: 190 },
        ];

        const piePlot = new Pie(chartRef.current, {
            appendPadding: 10,
            data,
            angleField: 'value',
            colorField: 'type',
            radius: 1,
            innerRadius: 0.6,
            label: {
                type: 'inner',
                offset: '-50%',
                content: '{value}',
                style: {
                    textAlign: 'center',
                    fontSize: 14,
                },
            },
            interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
            statistic: {
                title: false,
                content: {
                    style: {
                        whiteSpace: 'pre-wrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    },
                    content: 'AntV\nG2Plot',
                },
            },
        });

        piePlot.render();

        // Cleanup khi component bị unmount
        return () => {
            piePlot.destroy();
        };
    }, []);

    return (
        <div className="flex-2 min-w-[400px] bg-white drop-shadow-xs p-[10px]">
            <div className="h-[56px] flex items-center text-[16px] font-medium justify-between">
                <h2>Popular Airlines</h2>
            </div>
            <div ref={chartRef} className="h-[400px] w-full" />
        </div>
    );
};


export default Dashboard;
