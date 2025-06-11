import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Popconfirm } from "antd";
import icons from "../../assets/icons";
import { useDeleteAirport } from "../../hooks/useAiports";
import { fetchAllAirports } from "../../services/airport";
import NewAirport from "../../components/airport/NewAirport";
import UpdateAirport from "../../components/airport/UpdateAirport";
import useSelectOptions from "../../utils/selectOptions";
import { hasPermission } from "../../utils/checkPermission";

const Airports = () => {
    const canCreate = hasPermission("Airports", "POST");
    const canUpdate = hasPermission("Airports", "PUT");
    const canDelete = hasPermission("Airports", "DELETE");

    const { citySelectOptions } = useSelectOptions();
    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateAirport, setUpdateAirport] = useState<Airport>({
        id: 0,
        airportCode: '',
        airportName: '',
        city: {
            id: 0,
            cityCode: "",
            cityName: ""
        }
    });
    const [searchForm] = Form.useForm();
    const { mutate } = useDeleteAirport();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [airportsData, setAirportsData] = useState<Airport[]>([]);

    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete airport successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            }
        });
    };

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllAirports();
        setAirportsData(res.data.result);
        setIsLoadingData(false);
    };

    const handleSearch = (value: Airport) => {
        console.log(value); // Optional: filter logic
    };

    const columns: ProColumns<Airport>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{index + 1}</div>,
        },
        {
            title: "Code",
            dataIndex: "airportCode",
        },
        {
            title: "Name",
            dataIndex: "airportName",
        },
        {
            title: "Located At",
            render: (_text, record) => <div>{record.city.cityName}</div>,
        },
        ...(canUpdate || canDelete
            ? [{
                title: "Action",
                render: (_: React.ReactNode, value: Airport) => (
                    <div className="flex gap-[10px]">
                        {canUpdate && (
                            <div
                                onClick={() => {
                                    setUpdateAirport(value);
                                    setIsUpdateOpen(true);
                                }}
                                className="text-yellow-400"
                            >
                                {icons.edit}
                            </div>
                        )}
                        {canDelete && (
                            <Popconfirm
                                title="Delete the airport"
                                description="Are you sure?"
                                onConfirm={() => handleDelete(value.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <div className="text-red-400">{icons.delete}</div>
                            </Popconfirm>
                        )}
                    </div>
                )
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
                            <Form.Item label="Code" name="airportCode">
                                <Input placeholder="Enter airport code" />
                            </Form.Item>
                            <Form.Item label="Name" name="airportName">
                                <Input placeholder="Enter airport name" />
                            </Form.Item>
                            <Button icon={icons.search} type="primary" htmlType="submit" style={{ marginLeft: 'auto' }}>
                                Search
                            </Button>
                        </Form>
                    </div>
                    <ProTable<Airport>
                        loading={isLoadingData}
                        columns={columns}
                        dataSource={airportsData}
                        rowKey="id"
                        search={false}
                        pagination={{
                            pageSizeOptions: [5, 10],
                            showSizeChanger: true,
                            defaultCurrent: 1,
                            defaultPageSize: 5,
                        }}
                        headerTitle="Airport Table"
                        scroll={{ x: 'max-content' }}
                    />
                </div>
                {canCreate && (
                    <NewAirport
                        citySelectOptions={citySelectOptions}
                        refetchData={refetchData}
                    />
                )}
            </div>
            <UpdateAirport
                citySelectOptions={citySelectOptions}
                refetchData={refetchData}
                updatedAirport={updateAirport}
                setIsUpdateOpen={setIsUpdateOpen}
                isUpdateOpen={isUpdateOpen}
            />
        </>
    );
};

export default Airports;
