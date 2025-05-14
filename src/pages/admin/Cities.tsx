import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import icons from "../../assets/icons";
import NewCity from "../../components/city/NewCity";

import { useEffect, useState } from "react";
import { Button, Form, Input, message, Popconfirm } from "antd";
import { useDeleteCity } from "../../hooks/useCities";
import { fetchAllCities } from "../../services/city";
import UpdateCity from "../../components/city/UpdateCity";


const Cities = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateCity, setUpdatedCity] = useState<City>({ id: 0, cityCode: '', cityName: '' });
    const [searchForm] = Form.useForm();
    const { mutate } = useDeleteCity();
    // table
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [citiesData, setCitiesData] = useState<City[]>([]);
    //
    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete city successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            }
        })
    }
    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllCities();
        setCitiesData(res.data)
        setIsLoadingData(false);
    }

    const handleSearch = (value: City) => {
        console.log(value)
    }

    const columns: ProColumns<City>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{(index + 1)}</div>,
        },
        {
            title: "Code",
            dataIndex: "cityCode",
            key: "cityCode",
        },
        {
            title: "City",
            dataIndex: "cityName",
            key: "cityName",
        },
        {
            title: "Action",
            render: (_, value) => (
                <div className="flex flex-row gap-[10px]">
                    <div
                        onClick={() => {
                            setUpdatedCity(value)
                            setIsUpdateOpen(true)
                        }}
                        className="text-yellow-400">
                        {icons.edit}
                    </div>
                    <Popconfirm
                        title="Delete the city"
                        description="Are you sure to delete this city?"
                        onConfirm={() => handleDelete(value.id)}
                        onCancel={() => { }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <div className="text-red-400">
                            {icons.delete}
                        </div>
                    </Popconfirm>
                </div>
            ),
        }
    ];

    useEffect(() => {
        refetchData();
    }, [])
    return (
        <>
            {contextHolder}
            <div className="flex flex-row gap-[14px] w-full h-full">
                <div className="flex flex-col  drop-shadow-xs flex-1 w-[60%] gap-[10px]">
                    <div className="w-full bg-white p-[20px] rounded-[8px]">
                        <Form
                            style={{ height: '100%' }}
                            layout={"inline"}
                            form={searchForm}
                            onFinish={handleSearch}
                        >

                            <Form.Item label="Code"
                                name="cityCode">
                                <Input placeholder="please input city code" />
                            </Form.Item>

                            <Form.Item label="City"
                                name="cityName">
                                <Input placeholder="please input city name" />
                            </Form.Item>

                            <Button
                                style={{ marginLeft: 'auto' }}
                                icon={icons.search}
                                type="primary" htmlType="submit">Search</Button>
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
                            defaultPageSize: 5
                        }}
                        headerTitle="City Table"
                        scroll={{ x: 'max-content' }}
                    />
                </div>

                <NewCity
                    refetchData={refetchData}
                />
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
