/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, DatePicker, Form, Input, message, Popconfirm, Select } from "antd";
import { fetchAllFlights } from "../../services/flight";
import DetailFlight from "../../components/flight/DetailFlight";
import NewFlight from "../../components/flight/NewFlight";
import UpdateFlight from "../../components/flight/UpdateFlight";
import Filter from "../../components/flight/Filter";
import useSelectOptions from "../../utils/selectOptions";
import { useDeleteFlight } from "../../hooks/useFlights";
import { useNavigate } from "react-router";
import { getAllParamaters } from "../../services/parameter";
import { checkPermission } from "../../utils/checkPermission";
import icons from "../../assets/icons";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
const Flights = () => {
    const canCreate = checkPermission("Create Flight");
    const canUpdate = checkPermission("Update Flight");
    const canDelete = checkPermission("Delete Flight");
    const [params, setParams] = useState<Parameter>({
        maxInterQuantity: 0,
        minFlightTime: 0,
        minStopTime: 0,
        maxFlightTime: 0,
        latestBookingDay: 0,
        latestCancelDay: 0,
        maxStopTime: 0,
    });
    const navigate = useNavigate();
    const { planeSelectOptions, airportSelectOptions, seatSelectOptions } = useSelectOptions();
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailFlight, setDetailFlight] = useState<Flight>();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateFlight, setUpdateFlight] = useState<Flight>();
    const [isNewOpen, setIsNewOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [flightsData, setFlightsData] = useState<Flight[]>([]);
    const [originalFlightsData, setOriginalFlightsData] = useState<Flight[]>([]); // Lưu dữ liệu gốc
    const { mutate } = useDeleteFlight();

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const response = await getAllParamaters();
            setParams(response.data);
            const res = await fetchAllFlights({});
            setFlightsData(res.data.result);
            setOriginalFlightsData(res.data.result); // Lưu dữ liệu gốc
        } catch (error) {
            if (error instanceof Error) {
                messageApi.error(`Failed to fetch flights. ${error.message}`);
            } else {
                messageApi.error("Failed to fetch flights.");
            }
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await fetchData();
                messageApi.success("Delete flight successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    const handleBooking = (value: Flight) => {
        localStorage.setItem("booked_flight", JSON.stringify(value));
        navigate("/admin/booking");
    };

    const columns: ProColumns<Flight>[] = [
        {
            title: "ID",
            dataIndex: 'id'
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
            },
            filters: [
                { text: "Active", value: "Active" },
                { text: "Full", value: "Full" },
                { text: "Expired", value: "Expired" },
            ],
            filterMode: "tree",
            filterSearch: true,
            onFilter: (value: boolean | React.Key, record: Flight) => {
                const departureDateTime = new Date(`${record.departureDate}T${record.departureTime}`);
                const now = new Date();
                const totalRemaining = record.seats.reduce((sum, seat) => sum + seat.remainingTickets, 0);

                if (value === "Expired") {
                    return departureDateTime < now;
                }
                if (value === "Full") {
                    return totalRemaining === 0 && departureDateTime >= now;
                }
                if (value === "Active") {
                    return departureDateTime >= now && totalRemaining > 0;
                }
                return true; // Trường hợp mặc định
            },
        },
        {
            title: "Action",
            render: (_, value) => {
                const canBooking = value.seats.reduce((sum, seat) => sum + seat.remainingTickets, 0) > 0;
                return (
                    <div className="flex flex-row gap-[10px] items-center">
                        {canUpdate && <button
                            onClick={() => {
                                setUpdateFlight(value);
                                setIsUpdateOpen(true);
                            }}
                            disabled={!value.canUpdate}
                            className={` ${!value.canUpdate ? 'cursor-not-allowed opacity-40 text-blue-400' : 'cursor-pointer text-yellow-400'}`}
                        >
                            {icons.edit}
                        </button>}

                        {
                            canDelete &&
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
                        }
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
        fetchData();
    }, []);

    return (
        <>
            {contextHolder}
            <div className="flex flex-row gap-[14px] w-full h-full">
                <div className="flex drop-shadow-xs flex-col flex-1 gap-[10px]">
                    <Search
                        setFlightsData={setFlightsData}
                        originalFlightsData={originalFlightsData}
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
                            defaultPageSize: 5,
                        }}
                        headerTitle="Flight Table"
                        scroll={{ x: "max-content" }}
                        toolBarRender={() => {
                            const buttons = [];
                            if (canCreate) {
                                buttons.push(
                                    <Button
                                        type="primary"
                                        key="new"
                                        onClick={() => setIsNewOpen(true)}
                                    >
                                        New Flight
                                    </Button>
                                );
                            }
                            buttons.push(
                                <Button
                                    type="default"
                                    key="filter"
                                    onClick={() => setIsFilterOpen(true)}
                                >
                                    Filter
                                </Button>
                            );
                            return buttons;
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
                setFlightsData={setFlightsData}
                originalFlightsData={originalFlightsData}
            />
            <NewFlight
                planeSelectOptions={planeSelectOptions}
                airportSelectOptions={airportSelectOptions}
                seatSelectOptions={seatSelectOptions}
                MAX_INTER_QUANTITY={params.maxInterQuantity}
                MIN_FLIGHT_TIME={params.minFlightTime}
                MIN_STOP_TIME={params.minStopTime}
                MAX_STOP_TIME={params.maxStopTime}
                refetchData={fetchData}
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
                refetchData={fetchData}
                setUpdateFlight={setUpdateFlight}
            />
        </>
    );
};
interface SearchProps {
    setFlightsData: React.Dispatch<React.SetStateAction<Flight[]>>;
    originalFlightsData: Flight[]; // Dữ liệu gốc để reset và lọc
}

const Search = ({ setFlightsData, originalFlightsData }: SearchProps) => {
    const { RangePicker } = DatePicker;
    const { citySelectOptions } = useSelectOptions();
    const [searchForm] = useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const handleSearch = (values: any) => {
        console.log("Search values:", values); // Debug giá trị đầu vào
        try {
            // Lọc dữ liệu từ originalFlightsData
            const filteredFlights = originalFlightsData.filter((flight) => {
                // Lọc theo flightCode (không phân biệt hoa thường)
                const matchesFlightCode = values.flightCode
                    ? flight.flightCode.toLowerCase().includes(values.flightCode.toLowerCase())
                    : true;

                // Lọc theo cityCode hoặc city.id cho departure
                const matchesFrom = values.from
                    ? flight.departureAirport.city.cityCode === values.from ||
                    flight.departureAirport.city.id === values.from
                    : true;

                // Lọc theo cityCode hoặc city.id cho arrival
                const matchesTo = values.to
                    ? flight.arrivalAirport.city.cityCode === values.to ||
                    flight.arrivalAirport.city.id === values.to
                    : true;

                // Lọc theo departureDate
                const matchesDepartureDate = values.date && values.date[0]
                    ? dayjs(flight.departureDate).isSame(dayjs(values.date[0]), "day") ||
                    dayjs(flight.departureDate).isAfter(dayjs(values.date[0]), "day")
                    : true;

                // Lọc theo arrivalDate
                const matchesArrivalDate = values.date && values.date[1]
                    ? dayjs(flight.arrivalDate).isSame(dayjs(values.date[1]), "day") ||
                    dayjs(flight.arrivalDate).isBefore(dayjs(values.date[1]).add(1, "day"), "day")
                    : true;

                return matchesFlightCode && matchesFrom && matchesTo && matchesDepartureDate && matchesArrivalDate;
            });

            // Cập nhật danh sách chuyến bay
            setFlightsData(filteredFlights);

            if (filteredFlights.length === 0) {
                messageApi.warning("No flights found matching your criteria.");
            } else {
                messageApi.success(`Found ${filteredFlights.length} flights.`);
            }
        } catch (error) {
            messageApi.error("An error occurred while searching. Please try again.");
            console.error("Search error:", error);
        }
    };

    // Hàm reset form và dữ liệu
    const handleReset = () => {
        searchForm.resetFields();
        setFlightsData(originalFlightsData); // Khôi phục dữ liệu gốc
        messageApi.info("Search filters cleared.");
    };

    return (
        <>
            {contextHolder}
            <div className="w-full bg-white p-[20px] rounded-[8px]">
                <Form
                    layout="inline"
                    style={{ height: "100%" }}
                    form={searchForm}
                    onFinish={handleSearch}
                    initialValues={{
                        flightCode: undefined,
                        from: undefined,
                        to: undefined,
                        date: undefined,
                    }}
                >
                    <div className="flex w-full gap-[10px]">
                        <Form.Item label="Code" name="flightCode">
                            <Input placeholder="Enter flight code" allowClear style={{ width: 100 }} />
                        </Form.Item>
                        <Form.Item label="From" name="from">
                            <Select
                                style={{ width: 200 }}
                                options={citySelectOptions}
                                placeholder="Select departure city"
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item label="To" name="to">
                            <Select
                                style={{ width: 200 }}
                                options={citySelectOptions}
                                placeholder="Select arrival city"
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item label="Date" name="date">
                            <RangePicker style={{ width: 300 }} format="YYYY-MM-DD" />
                        </Form.Item>
                        <Button style={{ marginLeft: "auto" }} type="primary" htmlType="submit" icon={icons.search}>
                            Search
                        </Button>
                        <Form.Item>
                            <Button type="default" onClick={handleReset}>
                                {icons.reset} Reset
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
        </>
    );
};
export default Flights;