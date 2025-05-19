import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import icons from "../../assets/icons";
import { useEffect, useState } from "react";
import { Button, DatePicker, Form, message, Popconfirm, Select } from "antd";
import { fetchAllFlights } from "../../services/flight";
import DetailFlight from "../../components/flight/DetailFlight";
import NewFlight from "../../components/flight/NewFlight";
import { useDeleteFlight } from "../../hooks/useFlights";
import UpdateFlight from "../../components/flight/UpdateFlight";
import useSelectOptions from "../../utils/selectOptions";
import { useNavigate } from "react-router";
import Filter from "../../components/flight/Filter";

const MIN_FLIGHT_TIME = 300;
const MIN_STOP_TIME = 60;
const MAX_STOP_TIME = 100
const Flights = () => {
    const navigate = useNavigate();
    const { planeSelectOptions, airportSelectOptions, seatSelectOptions } = useSelectOptions();
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailFlight, setDetailFlight] = useState<Flight>({
        id: 0,
        flightCode: "",
        plane: {
            id: 0,
            planeCode: "",
            planeName: "",
        },
        departureAirport: {
            id: 0,
            airportCode: "",
            airportName: ""
        },
        arrivalAirport: {
            id: 0,
            airportCode: "",
            airportName: ""
        },
        departureDate: "",
        arrivalDate: "",
        departureTime: "",
        arrivalTime: "",
        originalPrice: 0,
        interAirports: [{
            airport: {
                id: 0,
                airportCode: "",
                airportName: ""
            },
            departureDateTime: "",
            arrivalDateTime: "",
            note: ""
        }],
        seats: [{
            seat: {
                id: 0,
                seatCode: "",
                seatName: "",
                price: 0,
                description: ""
            },
            quantity: 0,
            remainingTickets: 0,
            price: 0
        }]
    });
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const [updateFlight, setUpdateFlight] = useState({
        id: 0,
        flightCode: "",
        plane: {
            id: 0,
            planeCode: "",
            planeName: "",
        },
        departureAirport: {
            id: 0,
            airportCode: "",
            airportName: ""
        },
        arrivalAirport: {
            id: 0,
            airportCode: "",
            airportName: ""
        },
        departureDate: "",
        arrivalDate: "",
        departureTime: "",
        arrivalTime: "",
        originalPrice: 0,
        interAirports: [{
            airport: {
                id: 0,
                airportCode: "",
                airportName: ""
            },
            departureDateTime: "",
            arrivalDateTime: "",
            note: ""
        }],
        seats: [{
            seat: {
                id: 0,
                seatCode: "",
                seatName: "",
                price: 0,
                description: ""
            },
            quantity: 0,
            remainingTickets: 0,
            price: 0
        }]
    })
    const [isNewOpen, setIsNewOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    // table
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [flightsData, setFlightsData] = useState<Flight[]>([]);
    //
    const { mutate } = useDeleteFlight();
    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllFlights();
        setFlightsData(res.data)
        setIsLoadingData(false);
    }

    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete flight successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            }
        });
    };

    const handleBooking = (value: Flight) => {
        localStorage.setItem('booked_flight', JSON.stringify(value));
        navigate("/admin/booking")
    }
    const columns: ProColumns<Flight>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{(index + 1)}</div>,
        },
        {
            title: "Code",
            render: (_text, record) => <div
                onClick={() => {
                    setIsDetailOpen(true)
                    setDetailFlight(record)
                }}
                className="text-cyan-400 cursor-pointer">{record.flightCode}</div>,
        },
        {
            title: "Plane",
            render: (_text, record) => <div>{record.plane.planeName}</div>,
        },
        {
            title: "Location",
            children: [
                {
                    title: "Departure Airport",
                    render: (_text, record) => <div>{record.departureAirport.airportName}</div>,
                },
                {
                    title: "Arrival Airport",
                    render: (_text, record) => <div>{record.arrivalAirport.airportName}</div>,
                },
            ]
        },
        {
            title: "Time",
            children: [
                {
                    title: "Departure Date",
                    dataIndex: "departureDate",
                    sorter: (a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime(),
                },
                {
                    title: "Arrival Date",
                    dataIndex: "arrivalDate",
                    sorter: (a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime(),
                },
            ]
        },
        {
            title: "Price",
            render: (_text, record) => (
                <div>{`${new Intl.NumberFormat('en-US').format(record.originalPrice)} VND`}</div>
            ),
            sorter: (a, b) => a.originalPrice - b.originalPrice,
        },
        {
            title: "Available Tickets",
            render: (_text, record) => {
                const ticketQuantity = record.seats.reduce((value, seat) =>
                    value + seat.remainingTickets, 0)
                return (<div>{ticketQuantity}</div>)
            }
        },
        {
            title: "Action",
            render: (_, value) => (
                <div className="flex flex-row gap-[10px] items-center">
                    <div
                        onClick={() => {
                            setUpdateFlight(value)
                            setIsUpdateOpen(true)
                        }}
                        className="text-yellow-400">
                        {icons.edit}
                    </div>
                    <Popconfirm
                        title="Delete the city"
                        description="Are you sure to delete this city?"
                        onConfirm={() => { handleDelete(value.id) }}
                        onCancel={() => { }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <div className="text-red-400">
                            {icons.delete}
                        </div>
                    </Popconfirm>
                    <Button
                        type="dashed"
                        onClick={() => {
                            handleBooking(value)
                        }}
                        className="text-yellow-400">
                        {icons.booking} Booking
                    </Button>
                </div>
            ),
        }
    ];

    useEffect(() => {
        refetchData();
    }, [])
    return (
        <>
            {contextHolder}
            <div className="flex flex-row gap-[14px] w-full h-full">
                <div className="flex drop-shadow-xs flex-col flex-1 gap-[10px]">
                    <Search />
                    <ProTable<Flight>
                        loading={isLoadingData}
                        columns={columns}
                        dataSource={flightsData}
                        rowKey="id"
                        search={false}
                        pagination={{
                            pageSizeOptions: [5, 10],
                            showSizeChanger: true,
                            defaultCurrent: 1,
                            defaultPageSize: 5
                        }}
                        headerTitle="Flight Table"
                        scroll={{ x: 'max-content' }}
                        toolBarRender={() => {
                            return [
                                <Button
                                    type="primary"
                                    key="save"
                                    onClick={() => {
                                        setIsNewOpen(true);
                                    }}
                                >
                                    New Flight
                                </Button>,
                                <Button
                                    type="default"
                                    key="save"
                                    onClick={() => {
                                        setIsFilterOpen(true);
                                    }}
                                >
                                    Filter
                                </Button>,
                            ];
                        }}
                    />
                </div>
            </div>
            <DetailFlight
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                detailFlight={detailFlight}
            />
            <Filter
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
            />
            <NewFlight
                planeSelectOptions={planeSelectOptions}
                airportSelectOptions={airportSelectOptions}
                seatSelectOptions={seatSelectOptions}
                MIN_FLIGHT_TIME={MIN_FLIGHT_TIME}
                MIN_STOP_TIME={MIN_STOP_TIME}
                MAX_STOP_TIME={MAX_STOP_TIME}
                refetchData={refetchData}
                setIsNewOpen={setIsNewOpen}
                isNewOpen={isNewOpen}
            />
            <UpdateFlight
                planeSelectOptions={planeSelectOptions}
                airportSelectOptions={airportSelectOptions}
                seatSelectOptions={seatSelectOptions}
                MIN_FLIGHT_TIME={MIN_FLIGHT_TIME}
                MIN_STOP_TIME={MIN_STOP_TIME}
                MAX_STOP_TIME={MAX_STOP_TIME}
                isUpdateOpen={isUpdateOpen}
                setIsUpdateOpen={setIsUpdateOpen}
                updatedFlight={updateFlight}
                refetchData={refetchData}
                setUpdateFlight={setUpdateFlight}
            />
        </>
    );
};
const Search = () => {
    const { RangePicker } = DatePicker;
    const { citySelectOptions } = useSelectOptions();
    const [searchForm] = Form.useForm();
    const handleSearch = (value: Flight) => {
        console.log(value)
    }
    return (
        <div className="w-full bg-white p-[20px] rounded-[8px]">
            <Form
                layout={"inline"}
                style={{ height: '100%' }}
                form={searchForm}
                onFinish={handleSearch}
            >
                <Form.Item label="From"
                    name="from">
                    <Select
                        style={{ width: 200 }}
                        options={citySelectOptions} placeholder="Select departure city"
                    />
                </Form.Item>
                <Form.Item label="To"
                    name="to">
                    <Select
                        style={{ width: 200 }}
                        options={citySelectOptions} placeholder="Select departure city"
                    />
                </Form.Item>
                <Form.Item label="Date"
                    style={{ marginLeft: 'auto' }}
                    name="date">
                    <RangePicker style={{ width: 500 }} />
                </Form.Item>
                <Button
                    style={{ marginLeft: 'auto' }}
                    icon={icons.search}
                    type="primary" htmlType="submit">Search</Button>

            </Form>
        </div >
    )
}
export default Flights;
