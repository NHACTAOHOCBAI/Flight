import { Button, DatePicker } from 'antd';
import icons from '../../assets/icons';
import type { DatePickerProps } from 'antd/lib';
import exportToExcel from '../../utils/exportFile';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import formatPrice from '../../utils/formatVNprice';
import { useEffect, useState } from 'react';
import { flightRevenueReport } from '../../services/report';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

const disabledDate = (current: dayjs.Dayjs) => {
    return current.isSameOrAfter(dayjs(), 'month'); // Disable tháng hiện tại trở đi
};
const defaultDate = dayjs().subtract(1, 'month');
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
        title: 'Rate',
        dataIndex: 'percentage',
        sorter: true,
        render: (text) => <div>{text}%</div>,
    },
];

const TicketReport = () => {
    const [report, setReport] = useState<MonthlyRevenueReport>()
    const [date, setDate] = useState<{ month: number, year: number }>({
        month: defaultDate.month() + 1,
        year: defaultDate.year()
    })
    const onChange: DatePickerProps['onChange'] = (date) => {
        setDate({
            month: date.month() + 1,
            year: date.year()
        })
    };
    const refetchReport = async () => {
        const data = await flightRevenueReport(date.month, date.year)
        setReport(data)
    }
    const excelData = [
        ["Year", report?.year ?? ""],
        ["Month", report?.month ?? ""],
        ["Total Revenue", report?.revenue !== undefined ? `${report.revenue.toLocaleString("vi-VN")} VND` : ""],
        ["Growth Percentage", report?.percentage !== undefined ? `${report.percentage}%` : ""],
        ["Flight Count", report?.flightCount ?? ""],
        [],
        ["Flight ID", "Flight Code", "Ticket Count", "Revenue", "Percentage"],
        ...(report?.flights?.map((flight) => [
            flight.flightId,
            flight.flightCode,
            flight.ticketCount,
            `${flight.revenue.toLocaleString("vi-VN")} VND`,
            `${flight.percentage}%`
        ]) ?? [])
    ];
    useEffect(() => {
        refetchReport()
    }, [date])
    return (
        <div className="flex-1 min-w-[400px] bg-white mt-[10px] shadow-md">
            {/* Thống kê tổng quan */}
            <div className="p-4 border-b border-gray-200 text-[15px] font-medium">
                <div>
                    Date: {report?.month}/{report?.year}
                </div>
                <div>
                    Total Revenue: {formatPrice(report?.revenue || 0)}
                </div>
                <div>
                    Percentage: {report?.percentage}%
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
                dataSource={report?.flights}
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

                    <DatePicker
                        value={dayjs(`${date.year}-${date.month}`, 'YYYY-M')}
                        onChange={onChange}
                        picker="month"
                        disabledDate={disabledDate}
                    />
                ]}
                scroll={{ x: "max-content" }}
            />
        </div>
    );
};



export default TicketReport;