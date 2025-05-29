import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Popconfirm } from "antd";
import icons from "../../assets/icons";
import { useDeleteTicket } from "../../hooks/useTickets";
import { fetchAllTickets } from "../../services/ticket";
import UpdateTicket from "../../components/ticket/UpdateTicket";
import useSelectOptions from "../../utils/selectOptions";

const Tickets = () => {
    const { flightSelectOptions, seatSelectOptions } = useSelectOptions();
    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateTicket, setUpdateTicket] = useState<Ticket>({
        id: 0,
        passengerName: "",
        passengerEmail: "",
        passengerPhone: "",
        passengerIDCard: ""
    });
    const [searchForm] = Form.useForm();
    const { mutate } = useDeleteTicket();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [ticketsData, setTicketsData] = useState<Ticket[]>([]);

    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete ticket successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            }
        });
    };

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllTickets();
        setTicketsData(res?.result);
        setIsLoadingData(false);
    };

    const handleSearch = (value: Partial<Ticket>) => {
        console.log(value); // Optional search handling
    };

    const columns: ProColumns<Ticket>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{index + 1}</div>,
        },
        {
            title: "Flight",
            render: (_, record) => record.flight?.flightCode,
        },
        {
            title: "Seat",
            render: (_, record) => record.seat?.seatCode,
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
        }
    ];

    useEffect(() => {
        refetchData();
    }, []);

    return (
        <>
            {contextHolder}
            <div className="flex gap-[14px] w-full h-full">
                <div className="flex drop-shadow-xs flex-col flex-1 w-full gap-[10px]">
                    <div className="w-full bg-white p-[20px] rounded-[8px]">
                        <Form layout="inline" form={searchForm} onFinish={handleSearch}>
                            <Form.Item label="Name" name="passengerName">
                                <Input placeholder="Enter passenger name" />
                            </Form.Item>
                            <Form.Item label="Phone" name="passengerPhone">
                                <Input placeholder="Enter phone number" />
                            </Form.Item>
                            <Button icon={icons.search} type="primary" htmlType="submit" style={{ marginLeft: 'auto' }}>
                                Search
                            </Button>
                        </Form>
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
                        scroll={{ x: 'max-content' }}
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
