/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState, useCallback } from "react";
import { Button, Input, message, Popconfirm } from "antd";
import icons from "../../assets/icons";
import { useDeleteTicket } from "../../hooks/useTickets";
import { fetchAllTickets } from "../../services/ticket";
import UpdateTicket from "../../components/ticket/UpdateTicket";
import useSelectOptions from "../../utils/selectOptions";
import debounce from "lodash.debounce";
import { checkPermission } from "../../utils/checkPermission";

const Tickets = () => {
    const canCreate = checkPermission("Create Ticket")
    const canUpdate = checkPermission("Update Ticket")
    const canDelete = checkPermission("Delete Ticket")
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

    const { mutate } = useDeleteTicket();

    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete ticket successfully");
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
            title: "Action",
            render: (_, value) => (
                <div className="flex gap-[10px]">
                    <div
                        onClick={() => {
                            setUpdateTicket(value);
                            setIsUpdateOpen(true);
                        }}
                        className="text-yellow-400"
                    >
                        {icons.edit}
                    </div>
                    <Popconfirm
                        title="Delete the ticket"
                        description="Are you sure?"
                        onConfirm={() => handleDelete(value.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <div className="text-red-400">{icons.delete}</div>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    useEffect(() => {
        refetchData();
    }, []);

    return (
        <>
            {contextHolder}
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
                        scroll={{ x: "max-content" }}
                    />
                </div>
            </div>
            <UpdateTicket
                flightSelectOptions={flightSelectOptions}
                seatSelectOptions={seatSelectOptions}
                refetchData={refetchData}
                updatedTicket={updateTicket}
                setIsUpdateOpen={setIsUpdateOpen}
                isUpdateOpen={isUpdateOpen}
            />
        </>
    );
};

export default Tickets;