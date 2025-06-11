import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Popconfirm } from "antd";
import icons from "../../assets/icons";
import { useDeleteCity } from "../../hooks/useCities";
import { fetchAllCities } from "../../services/city";
import NewCity from "../../components/city/NewCity";
import UpdateCity from "../../components/city/UpdateCity";
import { hasPermission } from "../../utils/checkPermission";

const Cities = () => {
    const canCreate = hasPermission("Cities", "POST");
    const canUpdate = hasPermission("Cities", "PUT");
    const canDelete = hasPermission("Cities", "DELETE");

    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateCity, setUpdateCity] = useState<City>({ id: 0, cityCode: '', cityName: '' });
    const [searchForm] = Form.useForm();
    const { mutate } = useDeleteCity();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [citiesData, setCitiesData] = useState<City[]>([]);

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllCities();
        setCitiesData(res.data.result);
        setIsLoadingData(false);
    };

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

    const handleSearch = (value: City) => {
        console.log(value); // optional: filter logic
    };

    const columns: ProColumns<City>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{index + 1}</div>,
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
            ? [{
                title: "Action",
                render: (_: React.ReactNode, record: City) => (
                    <div className="flex gap-[10px]">
                        {canUpdate && (
                            <div
                                onClick={() => {
                                    setUpdateCity(record);
                                    setIsUpdateOpen(true);
                                }}
                                className="text-yellow-400"
                            >
                                {icons.edit}
                            </div>
                        )}
                        {canDelete && (
                            <Popconfirm
                                title="Delete the city"
                                description="Are you sure to delete this city?"
                                onConfirm={() => handleDelete(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <div className="text-red-400">{icons.delete}</div>
                            </Popconfirm>
                        )}
                    </div>
                ),
            }] : [])
    ];

    useEffect(() => {
        refetchData();
    }, []);

    return (
        <>
            {contextHolder}
            <div className="flex gap-[14px] w-full h-full">
                <div className="flex drop-shadow-xs flex-col flex-1 w-[60%] gap-[10px]">
                    <div className="w-full bg-white p-[20px] rounded-[8px]">
                        <Form layout="inline" form={searchForm} onFinish={handleSearch}>
                            <Form.Item label="Code" name="cityCode">
                                <Input placeholder="Enter city code" />
                            </Form.Item>
                            <Form.Item label="City" name="cityName">
                                <Input placeholder="Enter city name" />
                            </Form.Item>
                            <Button icon={icons.search} type="primary" htmlType="submit" style={{ marginLeft: 'auto' }}>
                                Search
                            </Button>
                        </Form>
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
                        scroll={{ x: 'max-content' }}
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
