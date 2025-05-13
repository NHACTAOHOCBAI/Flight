import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Popconfirm } from "antd";
import icons from "../../assets/icons";


import { useDeletePlane } from "../../hooks/usePlanes";
import { fetchAllPlanes } from "../../services/plane";
import UpdatePlane from "../../components/plane/UpdatePlane";
import NewPlane from "../../components/plane/NewPlane";
import useSelectOptions from "../../utils/selectOptions";

const Planes = () => {
    const { airlineSelectOptions } = useSelectOptions();
    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updatePlane, setUpdatePlane] = useState<Plane>({
        id: 0,
        planeCode: '',
        planeName: '',
        airline: {
            id: 0,
            airlineCode: '',
            airlineName: '',
            logo: ''
        }
    });
    const [searchForm] = Form.useForm();
    const { mutate } = useDeletePlane();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [planesData, setPlanesData] = useState<Plane[]>([]);


    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete plane successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            }
        });
    };

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllPlanes();
        setPlanesData(res.data);
        setIsLoadingData(false);
    };

    const handleSearch = (value: Plane) => {
        console.log(value); // Optional filter logic
    };

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
        },
        {
            title: "Action",
            render: (_, value) => (
                <div className="flex gap-[10px]">
                    <div
                        onClick={() => {
                            setUpdatePlane(value);
                            setIsUpdateOpen(true);
                        }}
                        className="text-yellow-400"
                    >
                        {icons.edit}
                    </div>
                    <Popconfirm
                        title="Delete the plane"
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
                <div className="flex flex-col flex-1 w-[60%] gap-[10px]">
                    <div className="w-full bg-white p-[20px] rounded-[8px]">
                        <Form layout="inline" form={searchForm} onFinish={handleSearch}>
                            <Form.Item label="Code" name="planeCode">
                                <Input placeholder="Enter plane code" />
                            </Form.Item>
                            <Form.Item label="Name" name="planeName">
                                <Input placeholder="Enter plane name" />
                            </Form.Item>
                            <Button icon={icons.search} type="primary" htmlType="submit" style={{ marginLeft: 'auto' }}>
                                Search
                            </Button>
                        </Form>
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
                        scroll={{ x: 'max-content' }}
                    />
                </div>
                <NewPlane
                    airlineSelectOptions={airlineSelectOptions}
                    refetchData={refetchData} />
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
