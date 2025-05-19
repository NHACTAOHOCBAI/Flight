import { Button, DatePicker } from 'antd';
import icons from '../../assets/icons';
import type { DatePickerProps } from 'antd/lib';
import exportToExcel from '../../utils/exportFile';
import { ProTable, type ProColumns } from '@ant-design/pro-components';

interface DataType {
    key: number,
    flightCode: string,
    ticketQuantity: number,
    revenue: number,
    rate: number
}
const data: DataType[] = [
    {
        key: 1,
        flightCode: "VN101",
        ticketQuantity: 120,
        revenue: 150000000,
        rate: 12.5,
    },
    {
        key: 2,
        flightCode: "VN202",
        ticketQuantity: 95,
        revenue: 113000000,
        rate: 10.8,
    },
    {
        key: 3,
        flightCode: "VN303",
        ticketQuantity: 145,
        revenue: 175000000,
        rate: 14.2,
    },
    {
        key: 4,
        flightCode: "VN404",
        ticketQuantity: 80,
        revenue: 92000000,
        rate: 9.0,
    },
    {
        key: 5,
        flightCode: "VN505",
        ticketQuantity: 160,
        revenue: 195000000,
        rate: 15.1,
    },
    {
        key: 6,
        flightCode: "VN606",
        ticketQuantity: 110,
        revenue: 130000000,
        rate: 11.6,
    },
    {
        key: 7,
        flightCode: "VN707",
        ticketQuantity: 135,
        revenue: 162000000,
        rate: 13.3,
    },
    {
        key: 8,
        flightCode: "VN808",
        ticketQuantity: 100,
        revenue: 118000000,
        rate: 10.2,
    },
    {
        key: 9,
        flightCode: "VN909",
        ticketQuantity: 150,
        revenue: 185000000,
        rate: 14.7,
    },
    {
        key: 10,
        flightCode: "VN010",
        ticketQuantity: 90,
        revenue: 105000000,
        rate: 9.5,
    },
];
const excelData = data.map((value) => {
    return {
        "Flight code": value.flightCode,
        "Ticket quantiy": value.ticketQuantity,
        "Revenue": value.revenue.toLocaleString("vi-VN") + " VND",
        "Rate": value.rate + "%"
    }
})
const columns: ProColumns<DataType>[] = [
    {
        title: 'No.',
        dataIndex: 'key',
    },
    {
        title: 'Flight ',
        dataIndex: 'flightCode',
        key: 'flightCode',
        copyable: true
    },
    {
        title: 'Ticket Quantity',
        dataIndex: 'ticketQuantity',
        key: 'ticketQuantity',
        sorter: true
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
        render: (text) => <div className=''>{text}%</div>
    },
];



const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
}
const TicketReport = () => {
    return (
        <div className='flex-1 min-w-[400px] bg-white mt-[10px] shadow-md'>
            <ProTable<DataType>
                style={{ width: "100%" }}
                headerTitle={<div className='text-[18px] flex gap-[5px] underline underline-offset-1'>{icons.report}Flight Revenue Report</div>}
                columns={columns}
                dataSource={data}
                rowKey="id"
                search={false}
                pagination={{
                    pageSizeOptions: [5, 10, 20, 50],
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
                        <DatePicker onChange={onChange} picker="month" />
                    ];
                }}
                scroll={{ x: 'max-content' }}
            />
        </div>
    )
}

export default TicketReport;