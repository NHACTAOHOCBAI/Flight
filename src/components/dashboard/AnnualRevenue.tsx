
import { Button, DatePicker } from 'antd';
import icons from '../../assets/icons';
import type { DatePickerProps } from 'antd/lib';
import exportToExcel from '../../utils/exportFile';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';
import { annualRevenueReport } from '../../services/report';
import dayjs from 'dayjs';
interface DataType {

    month: number,
    flightCount: number,
    revenue: number,
    percentage: number
}
const currentYear = dayjs().year();
const disabledDate = (current: dayjs.Dayjs) => {
    return current.year() >= currentYear; // Vô hiệu hóa năm hiện tại trở lên
};
const columns: ProColumns<DataType>[] = [
    {
        title: 'Month',
        dataIndex: 'month',
        key: 'month',
    },
    {
        title: 'Flight quantity',
        dataIndex: 'flightCount',
        key: 'flightCount',
        sorter: true,
    },
    {
        title: 'Revenue',
        dataIndex: 'revenue',
        key: 'revenue',
        sorter: true,
        render: (_, record) => <div>{record.revenue.toLocaleString("vi-VN") + " VND"}</div>
    },
    {
        title: 'Rate',
        dataIndex: 'percentage',
        key: 'percentage',
        sorter: true,
        render: (text) => <div>{text}%</div>
    },
];


const AnnualRevenue = () => {
    const [report, setReport] = useState<DataType[]>([])
    const [year, setYear] = useState<number>(currentYear - 1)
    const refetchReport = async () => {
        const data = await annualRevenueReport(year)
        setReport(data.months)
    }
    const excelData: unknown[][] = [
        ["Month", "Flight quantity", "Revenue", "Rate"],
        ...report.map((value) => [
            value.month,
            value.flightCount,
            value.revenue.toLocaleString("vi-VN") + " VND",
            value.percentage + "%"
        ])
    ];
    const onChange: DatePickerProps['onChange'] = (date) => {
        setYear(date.year())
    };
    useEffect(() => {
        refetchReport()
    }, [year])
    return (
        <div className='flex-1 min-w-[400px] bg-white mt-[10px] shadow-md'>
            <ProTable<DataType>
                style={{ width: "100%" }}
                headerTitle={<div className='text-[18px] flex gap-[5px] underline underline-offset-1'>{icons.report}Annual Revenue  Report</div>}
                columns={columns}
                dataSource={report}
                rowKey="id"
                search={false}
                pagination={{
                    pageSizeOptions: [5, 10, 12],
                    showSizeChanger: true,
                    defaultCurrent: 1,
                    defaultPageSize: 10,
                }}
                options={{
                    reload: false,
                    setting: false
                }}
                toolBarRender={() => {
                    return [
                        <Button type='primary' style={{ marginLeft: "auto", marginRight: 10 }} onClick={() => exportToExcel(excelData, "Flight_Ticket_Sales_Report")}>
                            {icons.export} Export
                        </Button>,
                        <DatePicker
                            onChange={onChange}
                            picker="year"
                            disabledDate={disabledDate}
                            value={dayjs(String(year), 'YYYY')} // ✅ truyền giá trị mặc định vào đây
                        />
                    ];
                }}
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

export default AnnualRevenue;