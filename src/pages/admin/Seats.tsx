import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import icons from "../../assets/icons";


import { useEffect, useState } from "react";
import { message, Popconfirm } from "antd";
import { useDeleteSeat } from "../../hooks/useSeats";
import { fetchAllSeats } from "../../services/seat";
import NewSeat from "../../components/seat/NewSeat";
import UpdateSeat from "../../components/seat/UpdateSeat";
import DetailSeat from "../../components/seat/DetailSeat";
import { hasPermission } from "../../utils/checkPermission";


const Seats = () => {
    const canCreate = hasPermission("Seats", "POST");
    const canUpdate = hasPermission("Seats", "PUT");
    const canDelete = hasPermission("Seats", "DELETE");
    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [updateSeat, setUpdateSeat] = useState<Seat>({ id: 0, seatCode: '', seatName: '', price: 0, description: '' });
    const [detailSeat, setDetailSeat] = useState<Seat>({ id: 0, seatCode: '', seatName: '', price: 0, description: '' });

    const { mutate } = useDeleteSeat();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [seatsData, setSeatsData] = useState<Seat[]>([]);

    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete seat successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            }
        })
    }

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllSeats();
        setSeatsData(res.data.result);
        setIsLoadingData(false);
    }


    const columns: ProColumns<Seat>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{index + 1}</div>,
        },
        {
            title: "Code",
            render: (_text, record) => <div
                onClick={() => {
                    setIsDetailOpen(true)
                    setDetailSeat(record)
                }}
                className="text-cyan-400 cursor-pointer">{record.seatCode}</div>,
        },
        { title: "Name", dataIndex: "seatName", key: "seatName" },
        {
            title: "Price",
            render: (_text, record) => <div>{`${record.price} %`}</div>,
            sorter: (a, b) => a.price - b.price,
        },
        ...(canUpdate || canDelete)
            ?
            [{
                title: "Action",
                render: (_: React.ReactNode, record: Seat) => (
                    <div className="flex flex-row gap-[10px]">
                        <div
                            onClick={() => {
                                setUpdateSeat(record);
                                setIsUpdateOpen(true);
                            }}
                            className="text-yellow-400"
                        >
                            {icons.edit}
                        </div>
                        <Popconfirm
                            title="Delete the seat"
                            description="Are you sure to delete this seat?"
                            onConfirm={() => handleDelete(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <div className="text-red-400">{icons.delete}</div>
                        </Popconfirm>
                    </div>
                ),
            }]
            : []
    ];

    useEffect(() => {
        refetchData();
    }, []);

    return (
        <>
            {contextHolder}
            <div className="flex flex-row gap-[14px] w-full h-full">
                <div className="flex flex-col  drop-shadow-xs flex-1 w-[60%] gap-[10px]">
                    <ProTable<Seat>
                        loading={isLoadingData}
                        columns={columns}
                        dataSource={seatsData}
                        rowKey="id"
                        search={false}
                        pagination={{
                            pageSizeOptions: [5, 10],
                            showSizeChanger: true,
                            defaultCurrent: 1,
                            defaultPageSize: 5
                        }}
                        headerTitle="Seat Table"
                        scroll={{ x: 'max-content' }}
                    />
                </div>
                {canCreate && <NewSeat refetchData={refetchData} />}
            </div>
            <UpdateSeat
                refetchData={refetchData}
                updatedSeat={updateSeat}
                isUpdateOpen={isUpdateOpen}
                setIsUpdateOpen={setIsUpdateOpen}
            />
            <DetailSeat
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                detailSeat={detailSeat}
            />
        </>
    );
};

export default Seats;
