import { Descriptions, Drawer, Table, type TableProps } from "antd"
import type { DescriptionsProps } from "antd/lib"

interface Props {
    isDetailOpen: boolean
    setIsDetailOpen: (value: boolean) => void
    detailFlight: Flight
}
interface InterAiportDataType {
    airport: {
        id: number,
        airportCode: string,
        airportName: string
    }
    departureDate: string
    arrivalDate: string
    note: string
}
interface SeatsDataType {
    seat: {
        id: number,
        seatCode: string,
        seatName: string,
        price: number,
        description: string
    }
    quantity: number,
    remainingTickets: number,
    price: number
}
const DetailFlight = ({ isDetailOpen, setIsDetailOpen, detailFlight }: Props) => {
    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'ID',
            children: detailFlight.id,
            span: "filled"
        },
        {
            key: '2',
            label: 'Flight Code',
            children: detailFlight.flightCode,
        },
        {
            key: '3',
            label: 'Plane',
            children: `${detailFlight.plane.planeName}(${detailFlight.plane.planeCode})`,
        },
        {
            key: '4',
            label: 'Departure Airport',
            children: detailFlight.departureAirport.airportName,
        },
        {
            key: '5',
            label: 'Arrival Airport',
            children: detailFlight.arrivalAirport.airportName,
        },
        {
            key: '6',
            label: 'Departure Date',
            children: detailFlight.departureTime + " | " + detailFlight.departureDate,
        },
        {
            key: '7',
            label: 'Arrival Date',
            children: detailFlight.arrivalTime + " | " + detailFlight.arrivalDate,
        },
        {
            key: '8',
            label: 'Quantity Tickets',
            children: detailFlight.seats.reduce((result, value) =>
                result + value.quantity, 0),
        },
        {
            key: '9',
            label: 'Available Tickets',
            children: detailFlight.seats.reduce((result, value) =>
                result + value.remainingTickets, 0),
        },
        {
            key: '10',
            label: 'Original Price',
            children: new Intl.NumberFormat('en-US').format(detailFlight.originalPrice) + " VND"
        },
    ];


    const interAirportsColumns: TableProps<InterAiportDataType>['columns'] = [
        {
            title: < div className="font-normal text-gray-600 min-w-[100px]" >Inter Airport</div >,
            children: [
                {
                    title: < div className="font-normal text-gray-600 min-w-[100px]" >Airport</div >,
                    render: (_text, record) => <div>{record.airport.airportName}</div>,
                },
                {
                    title: < div className="font-normal text-gray-600 min-w-[130px]" >Stop Date</div >,
                    dataIndex: 'arrivalDate',
                },
                {
                    title: < div className="font-normal text-gray-600 min-w-[130px]" >Re-Departure Date</div >,
                    dataIndex: 'departureDate',
                },
                {
                    title: < div className="font-normal text-gray-600" >Note</div >,
                    render: (_text, record) => <div>{record.airport.airportName}</div>,
                },
            ]
        }
    ];
    const seatsColumns: TableProps<SeatsDataType>['columns'] = [
        {
            title: < div className="font-normal text-gray-600 min-w-[100px]" >Tickets</div >,
            children: [
                {
                    title: < div className="font-normal text-gray-600 min-w-[100px]" >Class</div >,
                    render: (_text, record) => <div>{record.seat.seatName}</div>,
                },
                {
                    title: < div className="font-normal text-gray-600 min-w-[130px]" >Quantity</div >,
                    dataIndex: 'quantity',
                },
                {
                    title: < div className="font-normal text-gray-600 min-w-[130px]" >Remaining Tickets</div >,
                    dataIndex: 'remainingTickets',
                },
                {
                    title: < div className="font-normal text-gray-600" >Price</div >,
                    render: (_text, record) => <div>{new Intl.NumberFormat('en-US').format(record.price) + " VND"}</div>,
                },
            ]
        }
    ];
    return (
        <Drawer
            size="large"
            title="Flight View"
            closable={{ 'aria-label': 'Close Button' }}
            onClose={() => setIsDetailOpen(false)}
            open={isDetailOpen}
        >
            <Descriptions bordered items={items} column={2} />
            <Table<InterAiportDataType>
                pagination={false}
                style={{ marginTop: 20 }} bordered columns={interAirportsColumns} dataSource={detailFlight.interAirports} />
            <Table<SeatsDataType>
                pagination={false}
                style={{ marginTop: 20 }} bordered columns={seatsColumns} dataSource={detailFlight.seats} />
        </Drawer>
    );

}
export default DetailFlight;