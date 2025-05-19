import { Select } from "antd";
import { Column, Pie } from "@antv/g2plot";
import { useEffect, useRef } from "react";
import TicketReport from "../../components/dashboard/TicketReport";
import AnnualRevenue from "../../components/dashboard/AnnualRevenue";

const Dashboard = () => {
    const bookingRateDate = [
        { name: 'Ticket', 月份: 'Jan.', 月均降雨量: 90 },
        { name: 'Ticket', 月份: 'Feb.', 月均降雨量: 82 },
        { name: 'Ticket', 月份: 'Mar.', 月均降雨量: 73 },
        { name: 'Ticket', 月份: 'Apr.', 月均降雨量: 79 },
        { name: 'Ticket', 月份: 'May', 月均降雨量: 80 },
        { name: 'Ticket', 月份: 'Jun.', 月均降雨量: 91 },
        { name: 'Ticket', 月份: 'Jul.', 月均降雨量: 92 },
        { name: 'Ticket', 月份: 'Aug.', 月均降雨量: 80 },
        { name: 'Booking', 月份: 'Jan.', 月均降雨量: 100 },
        { name: 'Booking', 月份: 'Feb.', 月均降雨量: 120 },
        { name: 'Booking', 月份: 'Mar.', 月均降雨量: 120 },
        { name: 'Booking', 月份: 'Apr.', 月均降雨量: 100 },
        { name: 'Booking', 月份: 'May', 月均降雨量: 150 },
        { name: 'Booking', 月份: 'Jun.', 月均降雨量: 120 },
        { name: 'Booking', 月份: 'Jul.', 月均降雨量: 110 },
        { name: 'Booking', 月份: 'Aug.', 月均降雨量: 100 },
    ]
    return (
        <div className="w-full">
            <div className="w-full flex gap-[10px] justify-between flex-wrap gap-y-2">
                <Card title="Total Sales" value="1,800,000 đ" desc="Tăng 10% so với năm trước" filter={true} />
                <Card title="Flights" value="20 flights" desc="Tăng 5% so với năm trước" filter={true} />
                <Card title="Airlines" value="30 airlines" desc="Tăng 10% so với năm trước" />
                <Card title="Airports" value="16 airports" desc="Tăng 12% so với năm trước" />
            </div>

            <div className=" mt-[10px] gap-[10px] flex justify-between flex-wrap gap-y-2">
                <BookingRate
                    bookingRateDate={bookingRateDate} />
                <PopularAirline />
            </div>
            <div className="flex gap-[10px] flex-wrap">
                <TicketReport />
                <AnnualRevenue />
            </div>
        </div>
    );
};

const Card = ({ title, value, desc, filter = false }: { title: string, value: string, desc: string, filter?: boolean }) => {
    return (
        <div className="flex-1 drop-shadow-xs min h-[194px] min-w-[250px] bg-white px-[24px] py-[20px]">
            <div className="w-full flex justify-between items-center mb-2">
                <h3 className="opacity-45">{title}</h3>
                {filter && <Select
                    defaultValue="year"
                    style={{ minWidth: 90 }}
                    options={[
                        { value: 'year', label: <span>The Year</span> },
                        { value: 'week', label: <span>The Week</span> },
                        { value: 'day', label: <span>The Day</span> }
                    ]}
                />}
            </div>
            <p className="text-[30px] font-medium">{value}</p>
            <p>{desc}</p>
        </div>
    );
};
const BookingRate = ({ bookingRateDate }: {
    bookingRateDate: {
        name: string;
        月份: string;
        月均降雨量: number;
    }[]
}) => {
    const chartRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (chartRef.current) {
            const stackedColumnPlot = new Column(chartRef.current, {
                data: bookingRateDate,
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
    }, []);
    return (
        <div className=" flex-5 min-w-[400px] w-full p-[10px] bg-white drop-shadow-xs">
            <div className="h-[56px] flex items-center text-[16px] font-medium justify-between">
                <h2>Booking Rate Overview</h2>
                <Select
                    defaultValue="year"
                    style={{ minWidth: 90 }}
                    options={[
                        { value: 'year', label: <span>The Year</span> },
                        { value: 'week', label: <span>The Week</span> },
                        { value: 'day', label: <span>The Day</span> }
                    ]}
                />
            </div>
            <div ref={chartRef} className="h-[400px]" />
        </div>
    )
}

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
