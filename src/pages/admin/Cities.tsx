import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import icons from "../../assets/icons";
import NewCity from "../../components/city/NewCity";
import UpdateCity from "../../components/city/updateCity";
import { useEffect, useState } from "react";
import { Button, Form, Input } from "antd";
import { fetchAllCities } from "../../services/city";



const Cities = () => {
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateCity, setUpdatedCity] = useState<City>({
        id: 0,
        cityCode: '',
        cityName: ''
    });
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
    useEffect(() => {
        fetchAllCities();
    }, [])
    return (
        <>
            <div className="flex flex-row gap-[14px] flex-1">
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
                        columns={columns}
                        dataSource={data}
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
const data: City[] = [
    { id: 1, cityCode: "DN", cityName: "Da Nang" },
    { id: 2, cityCode: "HCM", cityName: "Ho Chi Minh" },
    { id: 3, cityCode: "DN", cityName: "Da Nang" },
    { id: 4, cityCode: "HCM", cityName: "Ho Chi Minh" },
    { id: 5, cityCode: "DN", cityName: "Da Nang" },
    { id: 6, cityCode: "HCM", cityName: "Ho Chi Minh" },
    { id: 7, cityCode: "DN", cityName: "Da Nang" },
    { id: 8, cityCode: "HCM", cityName: "Ho Chi Minh" },
    { id: 9, cityCode: "DN", cityName: "Da Nang" },
    { id: 10, cityCode: "HCM", cityName: "Ho Chi Minh" },
    { id: 11, cityCode: "DN", cityName: "Da Nang" },
    { id: 12, cityCode: "HCM", cityName: "Ho Chi Minh" },
];
export default Cities;
