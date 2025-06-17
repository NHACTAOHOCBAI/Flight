/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { Button, DatePicker, Form, Input, message, Modal, Popconfirm, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fetchAllFlights, importFlights } from "../../services/flight";
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
import { LuEye } from "react-icons/lu";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setFlight } from "../../redux/features/flight/flightSlide";
import * as XLSX from "xlsx";
import { IoCloudDownloadOutline } from "react-icons/io5";
const Flights = () => {
    const canCreate = checkPermission("Create Flight");
    const canUpdate = checkPermission("Update Flight");
    const canDelete = checkPermission("Delete Flight");
    const dispath = useAppDispatch()
    const [params, setParams] = useState<Parameter>({
        maxInterQuantity: 0,
        minFlightTime: 0,
        minStopTime: 0,
        maxFlightTime: 0,
        latestBookingDay: 0,
        latestCancelDay: 0,
        maxStopTime: 0,
        refundRate: 0
    });
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFlightsData, setImportFlightsData] = useState<FlightRequest[]>([]);
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
    const seatTemplate = JSON.stringify([
        {
            "seatId": 1,
            "quantity": 50
        }
    ])
    console.log(seatTemplate)
    const downloadExcel = () => {
        // Dữ liệu mẫu cho file Excel
        const data = [
            {
                "planeId": 1,
                "departureAirportId": 1,
                "arrivalAirportId": 2,
                "departureDate": "2025-06-20",
                "arrivalDate": "2025-06-20",
                "departureTime": "08:00",
                "arrivalTime": "10:00",
                "originPrice": 1000000,
                "interAirports": [],
                "seats": seatTemplate
            }
        ];

        // Tạo worksheet từ dữ liệu
        const ws = XLSX.utils.json_to_sheet(data);
        // Tạo workbook và thêm worksheet
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        // Tạo file Excel và tải xuống
        XLSX.writeFile(wb, 'Mutil_Upload_Template.xlsx');
    };
    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const response = await getAllParamaters();
            setParams(response.data);
            const res = await fetchAllFlights();
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
                if (error instanceof Error) {
                    if (error instanceof Error) {
                        if (error instanceof Error) {
                            if (error instanceof Error) {
                                messageApi.error(error.message);
                            } else {
                                messageApi.error("An unknown error occurred.");
                            }
                        } else {
                            messageApi.error("An unknown error occurred.");
                        }
                    } else {
                        messageApi.error("An unknown error occurred.");
                    }
                } else {
                    messageApi.error("Import error occurred.");
                }
            },
        });
    };

    const handleBooking = (value: Flight) => {
        localStorage.setItem("booked_flight", JSON.stringify(value));
        dispath(setFlight(value))
        navigate("/admin/booking");
    };

    const handleFileUpload = async (file: File) => {
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: "binary", cellDates: true, dateNF: "m/d/yyyy;@" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

                const flights: FlightRequest[] = jsonData.map((row: any, index: number) => {
                    console.log(`Raw data row ${index + 2}:`, row); // Log raw data for each row

                    // Handle date
                    let departureDate = "";
                    if (row.departureDate) {
                        const parsedDate = dayjs(row.departureDate, ["M/D/YYYY", "YYYY-MM-DD", "MM/DD/YYYY", "DD-MM-YYYY"], true);
                        departureDate = parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : "";
                        if (!departureDate) {
                            messageApi.error(`Invalid departure date at row ${index + 2}: ${row.departureDate}`);
                        }
                    }

                    let arrivalDate = "";
                    if (row.arrivalDate) {
                        const parsedDate = dayjs(row.arrivalDate, ["M/D/YYYY", "YYYY-MM-DD", "MM/DD/YYYY", "DD-MM-YYYY"], true);
                        arrivalDate = parsedDate.isValid() ? parsedDate.format("YYYY-MM-DD") : "";
                        if (!arrivalDate) {
                            messageApi.error(`Invalid arrival date at row ${index + 2}: ${row.arrivalDate}`);
                        }
                    }

                    // Handle time
                    let departureTime = "";
                    if (row.departureTime) {
                        const parsedTime = dayjs(row.departureTime, ["h:mm", "HH:mm", "h:mm:ss", "HH:mm:ss", "h:mm A", "h:mm:ss A"], true);
                        departureTime = parsedTime.isValid() ? parsedTime.format("HH:mm:ss") : "";
                        if (!departureTime) {
                            messageApi.error(`Invalid departure time at row ${index + 2}: ${row.departureTime}`);
                        }
                    }

                    let arrivalTime = "";
                    if (row.arrivalTime) {
                        const parsedTime = dayjs(row.arrivalTime, ["h:mm", "HH:mm", "h:mm:ss", "HH:mm:ss", "h:mm A", "h:mm:ss A"], true);
                        arrivalTime = parsedTime.isValid() ? parsedTime.format("HH:mm:ss") : "";
                        if (!arrivalTime) {
                            messageApi.error(`Invalid arrival time at row ${index + 2}: ${row.arrivalTime}`);
                        }
                    }

                    // Handle interAirports
                    let interAirports: { airportId: number; departureDateTime: string; arrivalDateTime: string; note: string }[] = [];
                    if (row.interAirports) {
                        try {
                            const parsedInterAirports = JSON.parse(row.interAirports);
                            interAirports = parsedInterAirports.map((ia: any) => ({
                                airportId: ia.airportId || 0,
                                departureDateTime: ia.departureDateTime || "",
                                arrivalDateTime: ia.arrivalDateTime || "",
                                note: ia.note || "",
                            }));
                        } catch {
                            messageApi.error(`Invalid intermediate airports data at row ${index + 2}: ${row.interAirports}`);
                        }
                    }

                    // Handle seats
                    let seats: {
                        seatId: number;
                        quantity: number;
                    }[] = [];
                    if (row.seats) {
                        console.log(`Raw seats data row ${index + 2}:`, row.seats); // Log raw seats data
                        try {
                            let parsedSeats;
                            if (typeof row.seats === "string") {
                                parsedSeats = JSON.parse(row.seats);
                            } else if (Array.isArray(row.seats)) {
                                parsedSeats = row.seats; // If already an array, no need to parse
                            } else {
                                throw new Error("Seats data is neither a JSON string nor an array");
                            }
                            seats = parsedSeats.map((seat: {
                                seatId: number;
                                quantity: number;
                            }) => {
                                if (!seat.seatId || typeof seat.seatId !== "number") {
                                    throw new Error("seatId is invalid or not a number");
                                }
                                return {
                                    seatId: seat.seatId,
                                    quantity: seat.quantity,
                                };
                            });
                        } catch (e) {
                            if (e instanceof Error) {
                                messageApi.error(`Invalid seats data at row ${index + 2}: ${row.seats} - Error: ${e.message}`);
                            } else {
                                messageApi.error(`Invalid seats data at row ${index + 2}: ${row.seats} - Unknown error`);
                            }
                        }
                    }

                    return {
                        flightCode: row.flightCode || "",
                        planeId: Number(row.planeId) || 0,
                        departureAirportId: Number(row.departureAirportId) || 0,
                        arrivalAirportId: Number(row.arrivalAirportId) || 0,
                        departureDate,
                        arrivalDate,
                        departureTime,
                        arrivalTime,
                        originPrice: Number(row.originPrice) || 0,
                        interAirports,
                        seats,
                    };
                });

                // Check and log invalid flights
                const invalidFlights = flights.filter(
                    (flight) =>
                        !flight.planeId ||
                        !flight.departureAirportId ||
                        !flight.arrivalAirportId ||
                        !flight.departureDate ||
                        !flight.arrivalDate ||
                        !flight.departureTime ||
                        !flight.arrivalTime ||
                        flight.originPrice < 0 ||
                        !flight.seats.every((seat) => seat.seatId && seat.quantity !== undefined)
                );

                if (invalidFlights.length > 0) {
                    invalidFlights.forEach((flight, index) => {
                        console.log(`Invalid flight ${index + 1}:`, flight);
                        if (!flight.departureDate) messageApi.error(`Invalid departure date at row ${index + 2}`);
                        if (!flight.arrivalDate) messageApi.error(`Invalid arrival date at row ${index + 2}`);
                        if (!flight.departureTime) messageApi.error(`Invalid departure time at row ${index + 2}`);
                        if (!flight.arrivalTime) messageApi.error(`Invalid arrival time at row ${index + 2}`);
                        if (!flight.seats.every((seat) => seat.seatId && seat.quantity !== undefined))
                            messageApi.error(`Invalid seats data at row ${index + 2}`);
                    });
                    return;
                }

                // Save valid data to state and show modal
                setImportFlightsData(flights);
                setIsImportModalOpen(true);
            };

            reader.readAsBinaryString(file);
            return false; // Prevent Upload component from sending request automatically
        } catch (error) {
            messageApi.error("Unable to process the file. Please try again.");
            console.error("File import error:", error);
            return false;
        }
    };
    // Hàm xác nhận import
    const handleConfirmImport = async () => {
        try {
            await importFlights(importFlightsData);
            messageApi.success("Flights imported successfully!");
            handleCancelImport()
            fetchData(); // Làm mới dữ liệu
        } catch (error) {
            messageApi.error(error.message);
            console.error("Import error:", error);
        }
    };

    // Hàm hủy import
    const handleCancelImport = () => {
        setIsImportModalOpen(false);
        setImportFlightsData([]);
    };
    // Cột cho bảng dữ liệu import
    const importColumns: ProColumns<FlightRequest>[] = [
        {
            title: "Plane ID",
            dataIndex: "planeId",
        },
        {
            title: "Departure Airport ID",
            dataIndex: "departureAirportId",
        },
        {
            title: "Arrival Airport ID",
            dataIndex: "arrivalAirportId",
        },
        {
            title: "Departure Date",
            dataIndex: "departureDate",
        },
        {
            title: "Arrival Date",
            dataIndex: "arrivalDate",
        },
        {
            title: "Departure Time",
            dataIndex: "departureTime",
        },
        {
            title: "Arrival Time",
            dataIndex: "arrivalTime",
        },
        {
            title: "Price",
            dataIndex: "originPrice",
            render: (price) => `${new Intl.NumberFormat('en-US').format(Number(price) || 0)} VND`,
        },
        {
            title: "Intermediate Airports",
            dataIndex: "interAirports",
            render: (_dom, entity) => entity.interAirports && entity.interAirports.length ? JSON.stringify(entity.interAirports) : "None",
        },
        {
            title: "Seats",
            dataIndex: "seats",
            render: (_dom, entity) => JSON.stringify(entity.seats),
        },
    ];
    const columns: ProColumns<Flight>[] = [
        {
            title: "ID",
            dataIndex: 'id'
        },
        {
            title: "Code",
            dataIndex: 'flightCode'
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
                const totalRemaining = record.seats.reduce((sum, seat) => sum + seat.quantity, 0);

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
            onFilter: (value: boolean | React.Key, record: Flight) => {
                const departureDateTime = new Date(`${record.departureDate}T${record.departureTime}`);
                const now = new Date();
                const totalRemaining = record.seats.reduce((sum, seat) => sum + seat.quantity, 0);

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
                const now = new Date();
                const departureDateTime = new Date(`${value.departureDate}T${value.departureTime}`);
                const isFlightExpired = departureDateTime < now;

                // Thời hạn đặt vé = ngày bay - latestBookingDay
                const bookingDeadline = new Date(departureDateTime);
                bookingDeadline.setDate(bookingDeadline.getDate() - params.latestBookingDay);
                const isBookingExpired = now > bookingDeadline;

                const totalRemaining = value.seats.reduce((sum, seat) => sum + seat.quantity, 0);
                const canBooking = totalRemaining > 0 && !isBookingExpired;
                const allowEditAndDelete = !isFlightExpired;

                return (
                    <div className="flex flex-row gap-[10px] items-center">
                        {/* View luôn được phép */}
                        <div
                            className="text-blue-400"
                            onClick={() => {
                                setDetailFlight(value);
                                setIsDetailOpen(true);
                            }}
                        >
                            <LuEye />
                        </div>

                        {/* Update (luôn hiển thị, disable nếu không được phép) */}
                        {canUpdate && (
                            value.hasTickets ? (
                                allowEditAndDelete ? (
                                    <Popconfirm
                                        title="Update the flight"
                                        description={
                                            <div className="w-[400px]">
                                                This flight has already been booked. If you update the flight,
                                                we will send a notification to all customers. Are you sure you want to edit it?
                                            </div>
                                        }
                                        onConfirm={() => {
                                            setUpdateFlight(value);
                                            setIsUpdateOpen(true);
                                        }}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <button className="cursor-pointer text-yellow-400">
                                            {icons.edit}
                                        </button>
                                    </Popconfirm>
                                ) : (
                                    <div className="text-gray-400 cursor-not-allowed">
                                        {icons.edit}
                                    </div>
                                )
                            ) : (
                                allowEditAndDelete ? (
                                    <button
                                        className="cursor-pointer text-yellow-400"
                                        onClick={() => {
                                            setUpdateFlight(value);
                                            setIsUpdateOpen(true);
                                        }}
                                    >
                                        {icons.edit}
                                    </button>
                                ) : (
                                    <div className="text-gray-400 cursor-not-allowed">
                                        {icons.edit}
                                    </div>
                                )
                            )
                        )}

                        {/* Delete (luôn hiển thị, disable nếu không được phép) */}
                        {canDelete && (
                            allowEditAndDelete ? (
                                <Popconfirm
                                    title="Delete the flight"
                                    description={
                                        <div className="w-[400px]">
                                            {value.hasTickets
                                                ? "This flight has already been booked. If you cancel the flight, we will send a notification to all customers. Do you still want to delete it?"
                                                : "Are you sure you want to delete this flight?"}
                                        </div>
                                    }
                                    onConfirm={() => handleDelete(value.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <button className="cursor-pointer text-red-400">
                                        {icons.delete}
                                    </button>
                                </Popconfirm>
                            ) : (
                                <div className="text-gray-400 cursor-not-allowed">
                                    {icons.delete}
                                </div>
                            )
                        )}

                        {/* Booking (chỉ khi còn ghế và chưa hết hạn đặt vé) */}
                        <Button
                            disabled={!canBooking}
                            type="dashed"
                            onClick={() => {
                                if (canBooking) handleBooking(value);
                            }}
                            className="text-yellow-400"
                        >
                            {icons.booking} Booking
                        </Button>
                    </div>
                );
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
                        options={{
                            reload: false,
                        }}
                        toolBarRender={() => {
                            const buttons = [];
                            if (canCreate) {
                                buttons.push(
                                    <Button
                                        type="primary"
                                        key="new"
                                        onClick={() => setIsNewOpen(true)}
                                    >
                                        {icons.plus} New Flight
                                    </Button>,
                                    <Upload
                                        key="import"
                                        accept=".xlsx,.csv"
                                        showUploadList={false}
                                        beforeUpload={handleFileUpload}
                                    >
                                        <Button type="primary" icon={<UploadOutlined />}>
                                            Import Flights
                                        </Button>
                                    </Upload>,
                                    <Button type="primary" onClick={() => downloadExcel()} icon={<IoCloudDownloadOutline />}>
                                        Download Template
                                    </Button>
                                );
                            }
                            buttons.push(
                                <Button
                                    type="default"
                                    key="filter"
                                    onClick={() => setIsFilterOpen(true)}
                                >
                                    {icons.filter} Filter
                                </Button>
                            );
                            return buttons;
                        }}
                    />
                    <div><span className="text-red-500">Note:</span> {`Only applicable for bookings made at least ${params.latestBookingDay} day(s) before departure`}</div>
                </div>
            </div>
            <Modal
                title="Preview Flights to Import"
                open={isImportModalOpen}
                onOk={handleConfirmImport}
                onCancel={handleCancelImport}
                okText="Confirm Import"
                cancelText="Cancel"
                width={1200}
            >
                <ProTable<FlightRequest>
                    columns={importColumns}
                    dataSource={importFlightsData}
                    rowKey="flightCode"
                    search={false}
                    pagination={{ pageSize: 5 }}
                    options={{ density: false, reload: false, setting: false }}
                />
            </Modal>
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