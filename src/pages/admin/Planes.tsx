/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState, useCallback } from "react";
import { Button, Input, message, Popconfirm } from "antd";
import icons from "../../assets/icons";
import { useDeletePlane } from "../../hooks/usePlanes";
import { fetchAllPlanes } from "../../services/plane";
import UpdatePlane from "../../components/plane/UpdatePlane";
import NewPlane from "../../components/plane/NewPlane";
import useSelectOptions from "../../utils/selectOptions";
import { checkPermission } from "../../utils/checkPermission";
import debounce from "lodash.debounce";

const Planes = () => {
    const canCreate = checkPermission("Create Plane");
    const canUpdate = checkPermission("Update Plane");
    const canDelete = checkPermission("Delete Plane");
    const { airlineSelectOptions } = useSelectOptions();
    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updatePlane, setUpdatePlane] = useState<Plane>({
        id: 0,
        planeCode: "",
        planeName: "",
        airline: {
            id: 0,
            airlineCode: "",
            airlineName: "",
            logo: "",
        },
    });
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [planesData, setPlanesData] = useState<Plane[]>([]);
    const [planeCode, setPlaneCode] = useState("");
    const [planeName, setPlaneName] = useState("");

    const { mutate } = useDeletePlane();
    const filterAirlines: {
        text: string,
        value: number
    }[] = airlineSelectOptions.map((value) => {
        return {
            text: value.label,
            value: value.value
        }
    })
    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete plane successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllPlanes();
        setPlanesData(res.data.result);
        setIsLoadingData(false);
    };

    const debouncedSearch = useCallback(
        debounce(async (code: string, name: string) => {
            setIsLoadingData(true);
            const res = await fetchAllPlanes();
            const filtered = res.data.result.filter((plane: Plane) => {
                return (
                    plane.planeCode.toLowerCase().includes(code.toLowerCase()) &&
                    plane.planeName.toLowerCase().includes(name.toLowerCase())
                );
            });
            setPlanesData(filtered);
            setIsLoadingData(false);
        }, 500),
        []
    );

    const columns: ProColumns<Plane>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{index + 1}</div>,
        },
        {
            title: "Code",
            dataIndex: "planeCode",
        },
        {
            title: "Name",
            dataIndex: "planeName",
        },
        {
            title: "Airline",
            render: (_, record) => <div>{record.airline.airlineName}</div>,
            filters: filterAirlines,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.airline.id === value
        },
        ...(canUpdate || canDelete
            ? [
                {
                    title: "Action",
                    render: (_: React.ReactNode, value: Plane) => (
                        <div className="flex gap-[10px]">
                            {canUpdate && (
                                <div
                                    onClick={() => {
                                        setUpdatePlane(value);
                                        setIsUpdateOpen(true);
                                    }}
                                    className="text-yellow-400"
                                >
                                    {icons.edit}
                                </div>
                            )}
                            {canDelete && (
                                <Popconfirm
                                    title="Delete the plane"
                                    description="Are you sure?"
                                    onConfirm={() => handleDelete(value.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <div className="text-red-400">{icons.delete}</div>
                                </Popconfirm>
                            )}
                        </div>
                    ),
                },
            ]
            : []),
    ];

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
                                value={planeCode}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setPlaneCode(val);
                                    debouncedSearch(val, planeName);
                                }}
                                placeholder="Enter plane code"
                                style={{ width: 200 }}
                            />
                        </div>
                        <div className="flex gap-[10px] items-center">
                            <p>Name:</p>
                            <Input
                                addonBefore={icons.search}
                                value={planeName}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setPlaneName(val);
                                    debouncedSearch(planeCode, val);
                                }}
                                placeholder="Enter plane name"
                                style={{ width: 200 }}
                            />
                        </div>
                        <Button
                            style={{ marginLeft: "auto" }}
                            type="primary"
                            onClick={() => {
                                setPlaneCode("");
                                setPlaneName("");
                                refetchData();
                            }}
                        >
                            {icons.reset} Reset
                        </Button>
                    </div>
                    <ProTable<Plane>
                        loading={isLoadingData}
                        columns={columns}
                        dataSource={planesData}
                        rowKey="id"
                        search={false}
                        pagination={{
                            pageSizeOptions: [5, 10],
                            showSizeChanger: true,
                            defaultCurrent: 1,
                            defaultPageSize: 5,
                        }}
                        headerTitle="Plane Table"
                        scroll={{ x: "max-content" }}
                    />
                </div>
                {canCreate && (
                    <NewPlane
                        airlineSelectOptions={airlineSelectOptions}
                        refetchData={refetchData}
                    />
                )}
            </div>
            <UpdatePlane
                airlineSelectOptions={airlineSelectOptions}
                refetchData={refetchData}
                updatedPlane={updatePlane}
                setIsUpdateOpen={setIsUpdateOpen}
                isUpdateOpen={isUpdateOpen}
            />
        </>
    );
};

export default Planes;