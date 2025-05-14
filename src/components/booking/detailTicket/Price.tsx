import { Table, type TableProps } from "antd";
import { useGetAllSeats } from "../../../hooks/useSeats";
import formatPrice from "../../../utils/formatVNprice";
import { useTicketsContext } from "../../../context/TicketsContext";

const Price = () => {
    const { tickets } = useTicketsContext();
    const { data: seatsData } = useGetAllSeats()
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Seat',
            dataIndex: 'seatName',
            key: 'seatName',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (value) => "x" + value
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (value: number) =>
                formatPrice(value)
        },
    ];
    const flight: Flight = JSON.parse(localStorage.getItem('booked_flight') as string);
    const seatList = seatsData?.data || [];
    const data = convertTicketsToDataType(tickets, seatList, flight?.originalPrice);
    const totalPrice = data.reduce((result, value) => result + value.price * value.quantity, 0)
    return (
        <div className="w-full p-[10px] rounded-[10px] bg-white drop-shadow-xl">
            <h2 className="font-medium text-[16px] mb-[10px]">Detail Price</h2>
            <Table<DataType>
                pagination={false}
                columns={columns} dataSource={data} />
            <div className="flex justify-between items-center p-[10px] bg-blue-200">
                <p className="font-medium">Total Price:</p>
                <h2 className="font-bold text-[18px]">{formatPrice(totalPrice)}</h2>
            </div>
        </div>
    )
}

interface DataType {
    key: string;
    seatName: string;
    quantity: number,
    price: number
}
function convertTicketsToDataType(tickets: TicketRequest[], seatMap: Seat[], originalPrice: number): DataType[] {
    const grouped: Record<number, number> = {};
    for (const ticket of tickets) {
        grouped[ticket.seatId] = (grouped[ticket.seatId] || 0) + 1;
    }
    return Object.entries(grouped).map(([seatIdStr, quantity], index) => {
        const seatId = Number(seatIdStr);
        const seatInfo = seatMap.find(seat => seat.id === seatId);

        return {
            key: `${index + 1}`,
            seatName: seatInfo?.seatName || `Seat ${seatId}`,
            quantity,
            price: (seatInfo?.price || 0) * originalPrice / 100
        };
    });
}

export default Price