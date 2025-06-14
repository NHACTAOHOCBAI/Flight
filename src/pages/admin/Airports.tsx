/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState, useCallback } from "react";
import { Button, Input, message, Popconfirm } from "antd";
import icons from "../../assets/icons";
import { useDeleteAirport } from "../../hooks/useAiports";
import { fetchAllAirports } from "../../services/airport";
import NewAirport from "../../components/airport/NewAirport";
import UpdateAirport from "../../components/airport/UpdateAirport";
import useSelectOptions from "../../utils/selectOptions";
import { checkPermission } from "../../utils/checkPermission";
import debounce from "lodash.debounce";

const Airports = () => {
    const canCreate = checkPermission("Create Airport");
    const canUpdate = checkPermission("Update Airport");
    const canDelete = checkPermission("Delete Airport");

    const { citySelectOptions } = useSelectOptions();
    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateAirport, setUpdateAirport] = useState<Airport>({
        id: 0,
        airportCode: "",
        airportName: "",
        city: {
            id: 0,
            cityCode: "",
            cityName: "",
        },
    });
    const { mutate } = useDeleteAirport();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [airportsData, setAirportsData] = useState<Airport[]>([]);
    const [airportCode, setAirportCode] = useState("");
    const [airportName, setAirportName] = useState("");
    const filterCities: {
        text: string,
        value: number
    }[] = citySelectOptions.map((value) => {
        return {
            text: value.label,
            value: value.value
        }
    })
    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete airport successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllAirports();
        setAirportsData(res.data.result);
        setIsLoadingData(false);
    };

    const debouncedSearch = useCallback(
        debounce(async (code: string, name: string) => {
            setIsLoadingData(true);
            const res = await fetchAllAirports();
            const filtered = res.data.result.filter((airport: Airport) => {
                return (
                    airport.airportCode.toLowerCase().includes(code.toLowerCase()) &&
                    airport.airportName.toLowerCase().includes(name.toLowerCase())
                );
            });
            setAirportsData(filtered);
            setIsLoadingData(false);
        }, 500),
        []
    );

    const columns: ProColumns<Airport>[] = [
        {
            title: "ID",
            dataIndex: 'id'
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
            filters: filterCities,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.city.id === value
        },
        ...(canUpdate || canDelete
            ? [
                {
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
                                value={airportCode}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAirportCode(val);
                                    debouncedSearch(val, airportName);
                                }}
                                placeholder="Enter airport code"
                                style={{ width: 200 }}
                            />
                        </div>
                        <div className="flex gap-[10px] items-center">
                            <p>Name:</p>
                            <Input
                                addonBefore={icons.search}
                                value={airportName}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setAirportName(val);
                                    debouncedSearch(airportCode, val);
                                }}
                                placeholder="Enter airport name"
                                style={{ width: 200 }}
                            />
                        </div>
                        <Button
                            style={{ marginLeft: "auto" }}
                            type="primary"
                            onClick={() => {
                                setAirportCode("");
                                setAirportName("");
                                refetchData();
                            }}
                        >
                            {icons.reset} Reset
                        </Button>
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
                        options={{
                            reload: false,
                        }}
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