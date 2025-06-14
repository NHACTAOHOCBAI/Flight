/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState, useCallback } from "react";
import { Button, Input, message, Popconfirm } from "antd";
import icons from "../../assets/icons";
import { useDeleteCity } from "../../hooks/useCities";
import { fetchAllCities } from "../../services/city";
import NewCity from "../../components/city/NewCity";
import UpdateCity from "../../components/city/UpdateCity";
import { checkPermission } from "../../utils/checkPermission";
import debounce from "lodash.debounce";

const Cities = () => {
    const canCreate = checkPermission("Create City");
    const canUpdate = checkPermission("Update City");
    const canDelete = checkPermission("Delete City");

    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateCity, setUpdateCity] = useState<City>({ id: 0, cityCode: "", cityName: "" });
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [citiesData, setCitiesData] = useState<City[]>([]);
    const [cityCode, setCityCode] = useState("");
    const [cityName, setCityName] = useState("");

    const { mutate } = useDeleteCity();

    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete city successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllCities();
        setCitiesData(res.data.result);
        setIsLoadingData(false);
    };

    const debouncedSearch = useCallback(
        debounce(async (code: string, name: string) => {
            setIsLoadingData(true);
            const res = await fetchAllCities();
            const filtered = res.data.result.filter((city: City) => {
                return (
                    city.cityCode.toLowerCase().includes(code.toLowerCase()) &&
                    city.cityName.toLowerCase().includes(name.toLowerCase())
                );
            });
            setCitiesData(filtered);
            setIsLoadingData(false);
        }, 500),
        []
    );

    const columns: ProColumns<City>[] = [
        {
            title: "ID",
            dataIndex: 'id'
        },
        {
            title: "Code",
            dataIndex: "cityCode",
        },
        {
            title: "City",
            dataIndex: "cityName",
        },
        ...(canUpdate || canDelete
            ? [
                {
                    title: "Action",
                    render: (_: React.ReactNode, record: City) => (
                        <div className="flex gap-[10px]">
                            {canUpdate && (
                                record.canDelete ? (
                                    <div
                                        onClick={() => {
                                            setUpdateCity(record);
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
                                        title="Delete the city"
                                        description="Are you sure to delete this city?"
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
                                value={cityCode}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setCityCode(val);
                                    debouncedSearch(val, cityName);
                                }}
                                placeholder="Enter city code"
                                style={{ width: 200 }}
                            />
                        </div>
                        <div className="flex gap-[10px] items-center">
                            <p>Name:</p>
                            <Input
                                addonBefore={icons.search}
                                value={cityName}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setCityName(val);
                                    debouncedSearch(cityCode, val);
                                }}
                                placeholder="Enter city name"
                                style={{ width: 200 }}
                            />
                        </div>
                        <Button
                            style={{ marginLeft: "auto" }}
                            type="primary"
                            onClick={() => {
                                setCityCode("");
                                setCityName("");
                                refetchData();
                            }}
                        >
                            {icons.reset} Reset
                        </Button>
                    </div>
                    <ProTable<City>
                        loading={isLoadingData}
                        columns={columns}
                        dataSource={citiesData}
                        rowKey="id"
                        search={false}
                        pagination={{
                            pageSizeOptions: [5, 10],
                            showSizeChanger: true,
                            defaultCurrent: 1,
                            defaultPageSize: 5,
                        }}
                        headerTitle="City Table"
                        options={{
                            reload: false,
                        }}
                    />
                </div>
                {canCreate && <NewCity refetchData={refetchData} />}
            </div>
            <UpdateCity
                refetchData={refetchData}
                updatedCity={updateCity}
                setIsUpdateOpen={setIsUpdateOpen}
                isUpdateOpen={isUpdateOpen}
            />
        </>
    );
};

export default Cities;