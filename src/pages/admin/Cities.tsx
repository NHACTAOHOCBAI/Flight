import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import icons from "../../assets/icons";
import NewCity from "../../components/city/NewCity";
import UpdateCity from "../../components/city/updateCity";
import { useState } from "react";
import { Button, Form, Input } from "antd";
import { useGetAllCities } from "../../hooks/useCities";
import Error from "../../components/Error";

const Cities = () => {
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateCity, setUpdatedCity] = useState<City>({ id: 0, cityCode: '', cityName: '' });
    const [searchForm] = Form.useForm();
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
                    <div className="text-red-400">
                        {icons.delete}
                    </div>
                </div>
            ),
        }
    ];
    const { data, isLoading, isError, error } = useGetAllCities();
    if (isError) {
        return (<Error error={error.message} />)
    }
    return (
        <>
            <div className="flex flex-row gap-[14px] w-full h-full">
                <div className="flex flex-col flex-1 w-[60%] gap-[10px]">
                    <div className="w-full bg-white p-[20px] rounded-[8px]">
                        <Form
                            style={{ height: '100%' }}
                            layout={"inline"}
                            form={searchForm}
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
                        loading={isLoading}
                        columns={columns}
                        dataSource={data?.data}
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

                <NewCity />
            </div>
            <UpdateCity
                updatedCity={updateCity}
                setIsUpdateOpen={setIsUpdateOpen}
                isUpdateOpen={isUpdateOpen}
            />
        </>
    );
};
export default Cities;
