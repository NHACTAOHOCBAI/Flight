/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getAllParamaters } from "../../services/parameter";
import dayjs from "dayjs";
const Flights = () => {
    const [params, setParams] = useState<Parameter>({
        maxInterQuantity: 0,
        minFlightTime: 0,
        minStopTime: 0,
        maxFlightTime: 0,
        latestBookingDay: 0,
        latestCancelDay: 0,
        maxStopTime: 0,
    })
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
            airline: {
                id: 0,
                airlineCode: "",
                airlineName: "",
                logo: ""
            }
        },
        departureAirport: {
            id: 0,
            airportCode: "",
            airportName: "",
            city: {
                id: 0,
                cityCode: "",
                cityName: "",
            }
        },
        arrivalAirport: {
            id: 0,
            airportCode: "",
            airportName: "",
            city: {
                id: 0,
                cityCode: "",
                cityName: "",
            }
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
                airportName: "",
                city: {
                    id: 0,
                    cityCode: "",
                    cityName: "",
                }
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
        }],
        canUpdate: false,
        canDelete: false,
    });
    const [isUpdateOpen, setIsUpdateOpen] = useState(false)
    const [updateFlight, setUpdateFlight] = useState<Flight>({
        id: 0,
        flightCode: "",
        plane: {
            id: 0,
            planeCode: "",
            planeName: "",
            airline: {
                id: 0,
                airlineCode: "",
                airlineName: "",
                logo: ""
            }
        },
        departureAirport: {
            id: 0,
            airportCode: "",
            airportName: "",
            city: {
                id: 0,
                cityCode: "",
                cityName: "",
            }
        },
        arrivalAirport: {
            id: 0,
            airportCode: "",
            airportName: "",
            city: {
                id: 0,
                cityCode: "",
                cityName: "",
            }
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
                airportName: "",
                city: {
                    id: 0,
                    cityCode: "",
                    cityName: "",
                }
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
        }],
        canUpdate: false,
        canDelete: false,
    })
    const [isNewOpen, setIsNewOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    // table
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [flightsData, setFlightsData] = useState<Flight[]>([]);
    //
    const { mutate } = useDeleteFlight();
    const refetchData = async (filter: {
        from?: string;
        to?: string;
        departureDate?: string;
        arrivalDate?: string;
        straight?: boolean;
        seats?: number[];
        airlines?: number[];
    } = {}) => {
        setIsLoadingData(true);
        const response = await getAllParamaters();
        setParams(response.data);

        const res = await fetchAllFlights(filter);
        setFlightsData(res.data.result)
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
            title: "Status",
            render: (_text, record) => {
                const departureDateTime = new Date(`${record.departureDate}T${record.departureTime}`);
                const now = new Date();
                const totalRemaining = record.seats.reduce((sum, seat) => sum + seat.remainingTickets, 0);

                if (departureDateTime < now) {
                    return <div className="text-red-500 font-semibold">Expired</div>;
                }

                if (totalRemaining === 0) {
                    return <div className="text-yellow-500 font-semibold">Full</div>;
                }

                return <div className="text-green-500 font-semibold">Active</div>;
            }
        },
        {
            title: "Action",
            render: (_, value) => {
                const canBooking = value.seats.reduce((sum, seat) => sum + seat.remainingTickets, 0) > 0;
                return (
                    <div className="flex flex-row gap-[10px] items-center">
                        <button
                            onClick={() => {
                                setUpdateFlight(value);
                                setIsUpdateOpen(true);
                            }}
                            disabled={!value.canUpdate}
                            className={` ${!value.canUpdate ? 'cursor-not-allowed opacity-40 text-blue-400' : 'cursor-pointer text-yellow-400'}`}
                        >
                            {icons.edit}
                        </button>

                        <Popconfirm
                            disabled={!value.canDelete}
                            title="Delete the city"
                            description="Are you sure to delete this city?"
                            onConfirm={() => { handleDelete(value.id) }}
                            onCancel={() => { }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <button
                                className={` ${!value.canUpdate ? 'cursor-not-allowed opacity-40 text-blue-400' : 'cursor-pointer text-red-400'}`}
                            >
                                {icons.delete}
                            </button>

                        </Popconfirm>
                        <Button
                            disabled={!canBooking}
                            type="dashed"
                            onClick={() => {
                                handleBooking(value)
                            }}
                            className="text-yellow-400">
                            {icons.booking} Booking
                        </Button>
                    </div>
                )
            },
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
                    <Search
                        refetchData={refetchData}
                    />
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
                refetchData={refetchData}
                isFilterOpen={isFilterOpen}
                setIsFilterOpen={setIsFilterOpen}
            />
            <NewFlight
                planeSelectOptions={planeSelectOptions}
                airportSelectOptions={airportSelectOptions}
                seatSelectOptions={seatSelectOptions}
                MAX_INTER_QUANTITY={params.maxInterQuantity}
                MIN_FLIGHT_TIME={params.minFlightTime}
                MIN_STOP_TIME={params.minStopTime}
                MAX_STOP_TIME={params.maxStopTime}
                refetchData={refetchData}
                setIsNewOpen={setIsNewOpen}
                isNewOpen={isNewOpen}
            />
            <UpdateFlight
                MAX_INTER_QUANTITY={params.maxInterQuantity}
                planeSelectOptions={planeSelectOptions}
                airportSelectOptions={airportSelectOptions}
                seatSelectOptions={seatSelectOptions}
                MIN_FLIGHT_TIME={params.minFlightTime}
                MIN_STOP_TIME={params.minStopTime}
                MAX_STOP_TIME={params.maxStopTime}
                isUpdateOpen={isUpdateOpen}
                setIsUpdateOpen={setIsUpdateOpen}
                updatedFlight={updateFlight}
                refetchData={refetchData}
                setUpdateFlight={setUpdateFlight}
            />
        </>
    );
};
const Search = ({ refetchData }: { refetchData: any }) => {
    const { RangePicker } = DatePicker;
    const { citySelectOptions } = useSelectOptions();
    const [searchForm] = Form.useForm();
    const handleSearch = (value: any) => {
        const departureDate = dayjs(value.date[0]).format('YYYY-MM-DD');
        const arrivalDate = dayjs(value.date[1]).format('YYYY-MM-DD');
        const params: {
            from?: string;
            to?: string;
            departureDate?: string;
            arrivalDate?: string;
            straight?: boolean;
            seats?: number[];
            airlines?: number[];
        } = {
            from: value.from,
            to: value.to,
            departureDate,
            arrivalDate
        }
        refetchData(params);
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
