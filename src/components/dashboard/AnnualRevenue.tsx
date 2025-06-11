
import { Button, DatePicker } from 'antd';
import icons from '../../assets/icons';
import type { DatePickerProps } from 'antd/lib';
import exportToExcel from '../../utils/exportFile';
import { ProTable, type ProColumns } from '@ant-design/pro-components';

interface DataType {
    key: number,
    month: number,
    flightQuantity: number,
    revenue: number,
    rate: number
}
const data: DataType[] = [
    { key: 1, month: 1, flightQuantity: 120, revenue: 125000000, rate: 5.2 },
    { key: 2, month: 2, flightQuantity: 110, revenue: 115000000, rate: 4.8 },
    { key: 3, month: 3, flightQuantity: 130, revenue: 140000000, rate: 6.1 },
    { key: 4, month: 4, flightQuantity: 145, revenue: 160000000, rate: 7.5 },
    { key: 5, month: 5, flightQuantity: 150, revenue: 170000000, rate: 6.9 },
    { key: 6, month: 6, flightQuantity: 140, revenue: 155000000, rate: 5.6 },
    { key: 7, month: 7, flightQuantity: 160, revenue: 180000000, rate: 8.2 },
    { key: 8, month: 8, flightQuantity: 155, revenue: 175000000, rate: 7.8 },
    { key: 9, month: 9, flightQuantity: 135, revenue: 150000000, rate: 6.0 },
    { key: 10, month: 10, flightQuantity: 125, revenue: 140000000, rate: 5.3 },
    { key: 11, month: 11, flightQuantity: 115, revenue: 130000000, rate: 4.7 },
    { key: 12, month: 12, flightQuantity: 170, revenue: 190000000, rate: 9.1 }
];

const excelData: unknown[][] = [
    ["Month", "Flight quantity", "Revenue", "Rate"],
    ...data.map((value) => [
        value.month,
        value.flightQuantity,
        value.revenue.toLocaleString("vi-VN") + " VND",
        value.rate + "%"
    ])
];
const columns: ProColumns<DataType>[] = [
    {
        title: 'Month',
        dataIndex: 'month',
        key: 'month',
    },
    {
        title: 'Flight quantity',
        dataIndex: 'flightQuantity',
        key: 'flightQuantity',
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
        dataIndex: 'rate',
        key: 'rate',
        sorter: true,
        render: (text) => <div>{text}%</div>
    },
];



const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
}
const AnnualRevenue = () => {
    return (
        <div className='flex-1 min-w-[400px] bg-white mt-[10px] shadow-md'>
            <ProTable<DataType>
                style={{ width: "100%" }}
                headerTitle={<div className='text-[18px] flex gap-[5px] underline underline-offset-1'>{icons.report}Annual Revenue  Report</div>}
                columns={columns}
                dataSource={data}
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
                        <DatePicker onChange={onChange} picker="year" />
                    ];
                }}
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

export default AnnualRevenue;