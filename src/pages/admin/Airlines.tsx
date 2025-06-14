import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useCallback, useEffect, useState } from "react";
import { Button, Input, message, Popconfirm } from "antd";
import icons from "../../assets/icons";
import { useDeleteAirline } from "../../hooks/useAirlines";
import { fetchAllAirlines } from "../../services/airline";
import NewAirline from "../../components/airline/NewAirline";
import UpdateAirline from "../../components/airline/UpdateAirline";
import { checkPermission } from "../../utils/checkPermission";
import debounce from "lodash.debounce";

const Airlines = () => {
    const canCreate = checkPermission("Create Airline");
    const canUpdate = checkPermission("Update Airline");
    const canDelete = checkPermission("Delete Airline");
    const [airlineCode, setAirlineCode] = useState("");
    const [airlineName, setAirlineName] = useState("");
    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateAirline, setUpdateAirline] = useState<Airline>({
        id: 0,
        airlineCode: "",
        airlineName: "",
        logo: "",
    });
    const { mutate } = useDeleteAirline();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [airlinesData, setAirlinesData] = useState<Airline[]>([]);

    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete airline successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllAirlines();
        setAirlinesData(res.data.result);
        setIsLoadingData(false);
    };

    const columns: ProColumns<Airline>[] = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Code",
            dataIndex: "airlineCode",
        },
        {
            title: "Name",
            dataIndex: "airlineName",
        },
        {
            title: "Logo",
            dataIndex: "logo",
            render: (_, record) => {
                if (record.logo)
                    return (
                        <img
                            style={{
                                objectFit: "cover",
                                width: 50,
                                height: 30,
                            }}
                            src={record.logo}
                            alt="logo"
                        />
                    )
                return <div className="text-red-300">Not updated yet...</div>
            },
        },
        ...(canUpdate || canDelete)
            ? [
                {
                    title: "Action",
                    render: (_: React.ReactNode, value: Airline) => (
                        <div className="flex gap-[10px]">
                            {canUpdate && (
                                value.canDelete ? (
                                    <div
                                        onClick={() => {
                                            setUpdateAirline(value);
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
                                value.canDelete ? (
                                    <Popconfirm
                                        title="Delete the airline"
                                        description="Are you sure?"
                                        onConfirm={() => handleDelete(value.id)}
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

                },
            ]
            : [],
    ];

    const debouncedSearch = useCallback(
        debounce(async (code: string, name: string) => {
            setIsLoadingData(true);
            const res = await fetchAllAirlines();
            const filtered = res.data.result.filter((airline: Airline) => {
                return (
                    airline.airlineCode.toLowerCase().includes(code.toLowerCase()) &&
                    airline.airlineName.toLowerCase().includes(name.toLowerCase())
                );
            });
            setAirlinesData(filtered);
            setIsLoadingData(false);
        }, 500),
        []
    );

    useEffect(() => {
        refetchData();
    }, []);

    return (
        <>
            {contextHolder}
            <div className="flex gap-[14px] w-full h-full">
                <div className="flex drop-shadow-xs flex-col flex-1 w-[60%] gap-[10px]">
                    <div className="flex gap-[30px] drop-shadow-xs bg-white p-[20px] rounded-[8px]">
                        <div className="flex gap-[10px] items-center">
                            <p>Code:</p>
                            <Input
                                addonBefore={icons.search}
                                value={airlineCode}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAirlineCode(val);
                                    debouncedSearch(val, airlineName); // Sử dụng airlineName hiện tại
                                }}
                                placeholder="Enter Code"
                                style={{ width: 200 }}
                            />
                        </div>
                        <div className="flex gap-[10px] items-center">
                            <p>Name:</p>
                            <Input
                                addonBefore={icons.search}
                                value={airlineName}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAirlineName(val);
                                    debouncedSearch(airlineCode, val); // Sử dụng airlineCode hiện tại
                                }}
                                placeholder="Enter Name"
                                style={{ width: 200 }}
                            />
                        </div>
                        <Button
                            style={{ marginLeft: "auto" }}
                            type="primary"
                            onClick={() => {
                                setAirlineCode("");
                                setAirlineName("");
                                refetchData();
                            }}
                        >
                            {icons.reset} Reset
                        </Button>
                    </div>

                    <ProTable<Airline>
                        loading={isLoadingData}
                        columns={columns}
                        dataSource={airlinesData}
                        rowKey="id"
                        search={false}
                        pagination={{
                            pageSizeOptions: [5, 10],
                            showSizeChanger: true,
                            defaultCurrent: 1,
                            defaultPageSize: 5,
                        }}
                        headerTitle="Airline Table"
                        options={{
                            reload: false,
                        }}
                    />
                </div>
                {canCreate && <NewAirline refetchData={refetchData} />}
            </div>
            <UpdateAirline
                setUpdateAirline={setUpdateAirline}
                refetchData={refetchData}
                updatedAirline={updateAirline}
                setIsUpdateOpen={setIsUpdateOpen}
                isUpdateOpen={isUpdateOpen}
            />
        </>
    );
};

export default Airlines;

