import { Button, DatePicker } from 'antd';
import icons from '../../assets/icons';
import type { DatePickerProps } from 'antd/lib';
import exportToExcel from '../../utils/exportFile';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import formatPrice from '../../utils/formatVNprice';


const reportData: MonthlyRevenueReport = {
    year: 2025,
    month: 4,
    revenue: 1_353_000_000,
    percentage: 12.3,
    flightCount: 10,
    flights: [
        {
            flightId: 1,
            flightCode: "VN101",
            ticketCount: 120,
            revenue: 150_000_000,
            percentage: 12.5,
        },
        {
            flightId: 2,
            flightCode: "VN202",
            ticketCount: 95,
            revenue: 113_000_000,
            percentage: 10.8,
        },
        // ...các chuyến bay còn lại tương tự
    ],
};

const excelData = [
    ["Year", reportData.year],
    ["Month", reportData.month],
    ["Total Revenue", `${reportData.revenue.toLocaleString("vi-VN")} VND`],
    ["Growth Percentage", `${reportData.percentage}%`],
    ["Flight Count", reportData.flightCount],
    [],
    ["Flight ID", "Flight Code", "Ticket Count", "Revenue", "Percentage"],
    ...reportData.flights.map((flight) => [
        flight.flightId,
        flight.flightCode,
        flight.ticketCount,
        `${flight.revenue.toLocaleString("vi-VN")} VND`,
        `${flight.percentage}%`
    ])
];


const columns: ProColumns<MonthlyRevenueReport["flights"][0]>[] = [
    {
        title: 'ID',
        dataIndex: 'flightId',
    },
    {
        title: 'Flight Code',
        dataIndex: 'flightCode',
        copyable: true,
    },
    {
        title: 'Ticket Quantity',
        dataIndex: 'ticketCount',
        sorter: true,
    },
    {
        title: 'Revenue',
        dataIndex: 'revenue',
        sorter: true,
        render: (_, record) => <div>{record.revenue.toLocaleString("vi-VN")} VND</div>,
    },
    {
        title: 'Percentage',
        dataIndex: 'percentage',
        sorter: true,
        render: (text) => <div>{text}%</div>,
    },
];

const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
}
const TicketReport = () => {
    return (
        <div className="flex-1 min-w-[400px] bg-white mt-[10px] shadow-md">
            {/* Thống kê tổng quan */}
            <div className="p-4 border-b border-gray-200 text-[15px] font-medium">
                <div>
                    Date: {reportData.month}/{reportData.year}
                </div>
                <div>
                    Total Revenue: {formatPrice(reportData.revenue)}
                </div>
                <div>
                    Percentage: {reportData.percentage}%
                </div>
            </div>

            {/* Bảng ProTable */}
            <ProTable<MonthlyRevenueReport["flights"][0]>
                style={{ width: "100%" }}
                headerTitle={
                    <div className="text-[18px] flex gap-[5px] underline underline-offset-1">
                        {icons.report}Flight Revenue Report
                    </div>
                }
                columns={columns}
                dataSource={reportData.flights}
                rowKey="flightId"
                search={false}
                pagination={{
                    pageSizeOptions: [5, 10, 20, 50],
                    showSizeChanger: true,
                    defaultCurrent: 1,
                    defaultPageSize: 10,
                }}
                options={{
                    reload: false,
                    setting: false,
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        style={{ marginLeft: "auto", marginRight: 10 }}
                        onClick={() => exportToExcel(excelData, "Flight_Ticket_Sales_Report")}
                    >
                        {icons.export} Export
                    </Button>,
                    <DatePicker onChange={onChange} picker="month" />,
                ]}
                scroll={{ x: "max-content" }}
            />
        </div>
    );
};



export default TicketReport;