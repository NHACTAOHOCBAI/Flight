import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Popconfirm } from "antd";
import icons from "../../assets/icons";
import { useDeleteAirline } from "../../hooks/useAirlines";
import { fetchAllAirlines } from "../../services/airline";
import NewAirline from "../../components/airline/NewAirline";
import UpdateAirline from "../../components/airline/UpdateAirline";


const Airlines = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateAirline, setUpdateAirline] = useState<Airline>({
        id: 0,
        airlineCode: '',
        airlineName: '',
        logo: ''
    });
    const [searchForm] = Form.useForm();
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
            }
        });
    };

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllAirlines();
        setAirlinesData(res.data);
        setIsLoadingData(false);
    };

    const handleSearch = (value: Airline) => {
        console.log(value); // Filter logic optional
    };

    const columns: ProColumns<Airline>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{index + 1}</div>,
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
            render: (_, record) => <img src={record.logo} alt="logo" style={{ width: 50, height: 30 }} />,
        },
        {
            title: "Action",
            render: (_, value) => (
                <div className="flex gap-[10px]">
                    <div
                        onClick={() => {
                            setUpdateAirline(value);
                            setIsUpdateOpen(true);
                        }}
                        className="text-yellow-400"
                    >
                        {icons.edit}
                    </div>
                    <Popconfirm
                        title="Delete the airline"
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
                            <Form.Item label="Code" name="airlineCode">
                                <Input placeholder="Enter airline code" />
                            </Form.Item>
                            <Form.Item label="Name" name="airlineName">
                                <Input placeholder="Enter airline name" />
                            </Form.Item>
                            <Button icon={icons.search} type="primary" htmlType="submit" style={{ marginLeft: 'auto' }}>
                                Search
                            </Button>
                        </Form>
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
                        scroll={{ x: 'max-content' }}
                    />
                </div>
                <NewAirline refetchData={refetchData} />
            </div>
            <UpdateAirline
                refetchData={refetchData}
                updatedAirline={updateAirline}
                setIsUpdateOpen={setIsUpdateOpen}
                isUpdateOpen={isUpdateOpen}
            />
        </>
    );
};

export default Airlines;
