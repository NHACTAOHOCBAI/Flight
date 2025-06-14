/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState, useCallback } from "react";
import { Button, Input, message, Modal } from "antd";
import icons from "../../assets/icons";
import { useDeleteTicket } from "../../hooks/useTickets";
import { fetchAllTickets } from "../../services/ticket";
import UpdateTicket from "../../components/ticket/UpdateTicket";
import useSelectOptions from "../../utils/selectOptions";
import debounce from "lodash.debounce";
import { checkPermission } from "../../utils/checkPermission";
import NewTicket from "../../components/ticket/New Ticket/NewTicket";
import { BsArrowReturnLeft } from "react-icons/bs";
import { TbExclamationCircleFilled } from "react-icons/tb";
import formatPrice from "../../utils/formatVNprice"; const checkDate = (value: Flight) => {
    const now = new Date();

    const dateStr = value.departureDate;
    const timeStr = value.departureTime;

    const departureDateTime = dateStr && timeStr
        ? new Date(`${dateStr}T${timeStr}`)
        : null;

    return departureDateTime ? departureDateTime < now : false;
}
const Tickets = () => {
    const canCreate = checkPermission("Create Ticket")
    const canUpdate = checkPermission("Update Ticket")
    const canDelete = checkPermission("Delete Ticket")
    const [isOpen, setIsOpen] = useState(false)
    const [deletedTicket, setDeletedTicket] = useState<Ticket>()
    const [isNewOpen, setIsNewOpen] = useState(false)
    const { flightSelectOptions, seatSelectOptions } = useSelectOptions();
    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateTicket, setUpdateTicket] = useState<Ticket>({
        id: 0,
        passengerName: "",
        passengerEmail: "",
        passengerPhone: "",
        passengerIDCard: "",
        flight: undefined,
        seat: undefined,
    });
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [ticketsData, setTicketsData] = useState<Ticket[]>([]);
    const [flightCode, setFlightCode] = useState("");
    const [passengerEmail, setPassengerEmail] = useState("");

    const { mutate, isPending } = useDeleteTicket();

    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Refund ticket successfully");
                setIsOpen(false)
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllTickets();
        setTicketsData(res?.result || []);
        setIsLoadingData(false);
    };

    const debouncedSearch = useCallback(
        debounce(async (flightCode: string, email: string) => {
            setIsLoadingData(true);
            const res = await fetchAllTickets();
            const filtered = (res?.result || []).filter((ticket: Ticket) => {
                const matchesFlightCode = ticket.flight?.flightCode
                    ?.toLowerCase()
                    .includes(flightCode.toLowerCase()) ?? true;
                const matchesEmail = ticket.passengerEmail
                    ?.toLowerCase()
                    .includes(email.toLowerCase()) ?? true;
                return matchesFlightCode && matchesEmail;
            });
            setTicketsData(filtered);
            setIsLoadingData(false);
        }, 500),
        []
    );

    const columns: ProColumns<Ticket>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{index + 1}</div>,
        },
        {
            title: "Flight",
            render: (_, record) => record.flight?.flightCode || "-",
        },
        {
            title: "Seat",
            render: (_, record) => record.seat?.seatCode || "-",
        },
        {
            title: "Name",
            dataIndex: "passengerName",
        },
        {
            title: "Email",
            dataIndex: "passengerEmail",
        },
        {
            title: "Phone",
            dataIndex: "passengerPhone",
        },
        {
            title: "ID Card",
            dataIndex: "passengerIDCard",
        },
        {
            title: "Booking Account",
            render: (_, value) => (
                <div>{value.userBooking?.username}</div>
            )
        },
        {
            title: "Status",
            render: (_: any, value: Ticket) => {
                const isExpired = value.flight ? checkDate(value.flight) : false;
                if (isExpired)
                    return <div className="text-red-400">Expired</div>;
                return <div className="text-green-400">Active</div>;
            }
        },
        {
            title: "Action",
            render: (_, value) => {
                const isExpired = value.flight ? checkDate(value.flight) : false
                return (
                    <div className="flex gap-[10px] items-center">
                        <div
                            onClick={() => {
                                setUpdateTicket(value);
                                setIsUpdateOpen(true);
                            }}
                            className="text-yellow-400"
                        >
                            {icons.edit}
                        </div>
                        {
                            canDelete && !isExpired &&

                            <div className="text-red-400" onClick={() => {
                                setDeletedTicket(value)
                                setIsOpen(true)
                            }}><BsArrowReturnLeft /></div>
                        }
                    </div>
                )
            }
        },
    ];

    useEffect(() => {
        refetchData();
    }, []);

    return (
        <>
            {contextHolder}
            <RefundModal
                isPending={isPending}
                handleRefund={handleDelete}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                ticket={deletedTicket}
            />
            <div className="flex gap-[14px] w-full h-full">
                <div className="flex drop-shadow-xs flex-col flex-1 w-full gap-[10px]">
                    <div className="flex gap-[30px] drop-shadow-xs bg-white p-[20px] rounded-[8px]">
                        <div className="flex gap-[10px] items-center">
                            <p>Flight Code:</p>
                            <Input
                                addonBefore={icons.search}
                                value={flightCode}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFlightCode(val);
                                    debouncedSearch(val, passengerEmail);
                                }}
                                placeholder="Enter flight code"
                                style={{ width: 200 }}
                            />
                        </div>
                        <div className="flex gap-[10px] items-center">
                            <p>Email:</p>
                            <Input
                                addonBefore={icons.search}
                                value={passengerEmail}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setPassengerEmail(val);
                                    debouncedSearch(flightCode, val);
                                }}
                                placeholder="Enter passenger email"
                                style={{ width: 200 }}
                            />
                        </div>
                        <Button
                            style={{ marginLeft: "auto" }}
                            type="primary"
                            onClick={() => {
                                setFlightCode("");
                                setPassengerEmail("");
                                refetchData();
                            }}
                        >
                            {icons.reset} Reset
                        </Button>
                    </div>
                    <ProTable<Ticket>
                        loading={isLoadingData}
                        columns={columns}
                        dataSource={ticketsData}
                        rowKey="id"
                        search={false}
                        pagination={{
                            pageSizeOptions: [5, 10],
                            showSizeChanger: true,
                            defaultCurrent: 1,
                            defaultPageSize: 5,
                        }}
                        headerTitle="Ticket Table"
                        options={{
                            reload: false,
                        }}
                        toolBarRender={() => {
                            if (canCreate)
                                return [
                                    <Button
                                        type="primary"
                                        key="save"
                                        onClick={() => {
                                            setIsNewOpen(true)
                                        }}
                                    >
                                        New Ticket
                                    </Button>,
                                ];
                            return [];
                        }}
                    />
                </div>
            </div>
            <NewTicket

                isNewOpen={isNewOpen}
                setIsNewOpen={setIsNewOpen}
                refetchData={refetchData}
            />
            {
                canUpdate &&
                <UpdateTicket
                    flightSelectOptions={flightSelectOptions}
                    seatSelectOptions={seatSelectOptions}
                    refetchData={refetchData}
                    updatedTicket={updateTicket}
                    setIsUpdateOpen={setIsUpdateOpen}
                    isUpdateOpen={isUpdateOpen}
                />
            }
        </>
    );
};
const RefundModal = ({ isOpen, setIsOpen, ticket, isPending, handleRefund }: { isOpen: boolean, setIsOpen: (value: boolean) => void, ticket: Ticket | undefined, isPending: boolean, handleRefund: any }) => {
    const handleCancel = () => {
        setIsOpen(false);
    };

    const refundAmount = (ticket?.flight?.originalPrice ?? 0) * ((ticket?.seat?.price ?? 0) / 100) * 0.5

    return (
        <>
            <Modal
                loading={isPending}
                title={
                    <div className="flex items-center gap-2">
                        <TbExclamationCircleFilled className="text-yellow-500" />
                        <span>Refund Ticket</span>
                    </div>
                }
                open={isOpen}
                onCancel={handleCancel}
                onOk={() => handleRefund(ticket?.id)}
                okText="Confirm Refund"
                cancelText="Cancel"
                okButtonProps={{ className: "bg-blue-500 hover:bg-blue-600" }}
                className="rounded-lg"
            >
                <div className="flex flex-col gap-3 p-4 text-gray-800 dark:text-gray-200">
                    <p className="text-base font-medium">
                        Do you want to refund ticket for flight{" "}
                        <span className="font-bold">{ticket?.flight?.flightCode || "N/A"}</span>?
                    </p>
                    <p className="text-base">
                        Refund amount: <span className="font-bold text-green-600 dark:text-green-400">${formatPrice(refundAmount)}</span> (50% of original price).
                    </p>
                    <p className="text-base">
                        This action cannot be undone.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Please confirm to proceed with the refund.
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default Tickets;