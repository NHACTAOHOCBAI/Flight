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
import { checkPermission } from "../../utils/checkPermission";
import { LuEye } from "react-icons/lu";


const Seats = () => {
    const canCreate = checkPermission("Create Seat")
    const canUpdate = checkPermission("Update Seat")
    const canDelete = checkPermission("Delete Seat")
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
            title: "ID",
            dataIndex: 'id'
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
        {
            title: "Action",
            render: (_: React.ReactNode, record: Seat) => (
                <div className="flex gap-[10px] items-center">
                    <div
                        className="text-blue-400 cursor-pointer"
                        onClick={() => {
                            setDetailSeat(record);
                            setIsDetailOpen(true);
                        }}
                    >
                        <LuEye />
                    </div>

                    {canUpdate && (
                        record.canDelete ? (
                            <div
                                onClick={() => {
                                    setUpdateSeat(record);
                                    setIsUpdateOpen(true);
                                }}
                                className="text-yellow-400 cursor-pointer"
                            >
                                {icons.edit}
                            </div>
                        ) : (
                            <div className="text-gray-400 cursor-not-allowed">{icons.edit}</div>
                        )
                    )}

                    {canDelete && (
                        record.canDelete ? (
                            <Popconfirm
                                title="Delete the seat"
                                description="Are you sure to delete this seat?"
                                onConfirm={() => handleDelete(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <div className="text-red-400 cursor-pointer">{icons.delete}</div>
                            </Popconfirm>
                        ) : (
                            <div className="text-gray-400 cursor-not-allowed">{icons.delete}</div>
                        )
                    )}
                </div>
            )

        }
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
