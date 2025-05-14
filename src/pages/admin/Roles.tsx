// pages/admin/Roles.tsx
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Button, Form, Input, message, Popconfirm } from "antd";
import icons from "../../assets/icons";
import { useDeleteRole } from "../../hooks/useRoles";
import { fetchAllRoles } from "../../services/role";
import NewRole from "../../components/role/NewRole";
import UpdateRole from "../../components/role/UpdateRole";



const Roles = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateRole, setUpdateRole] = useState<Role>({ id: 0, roleName: "", pages: [] });
    const [searchForm] = Form.useForm();
    const { mutate } = useDeleteRole();
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [rolesData, setRolesData] = useState<Role[]>([]);

    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete role successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllRoles();
        setRolesData(res.data);
        setIsLoadingData(false);
    };
    const handleSearch = (value: Plane) => {
        console.log(value); // Optional filter logic
    };
    const columns: ProColumns<Role>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{index + 1}</div>,
        },
        {
            title: "Role Name",
            dataIndex: "roleName",
        },
        {
            title: "Pages",
            render: (_, record) => {
                console.log(record.pages)
                return record.pages.map((value) => value.pageName).join(',')
            }
        },
        {
            title: "Action",
            render: (_, value) => (
                <div className="flex gap-[10px]">
                    <div
                        onClick={() => {
                            setUpdateRole(value);
                            setIsUpdateOpen(true);
                        }}
                        className="text-yellow-400"
                    >
                        {icons.edit}
                    </div>
                    <Popconfirm
                        title="Delete the role"
                        onConfirm={() => handleDelete(value.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <div className="text-red-400">{icons.delete}</div>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    useEffect(() => {
        refetchData();
    }, []);

    return (
        <>
            {contextHolder}
            <div className="flex gap-[14px] w-full h-full">
                <div className="flex  drop-shadow-xs flex-col flex-1 w-[60%] gap-[10px]">
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
                    <ProTable<Role>
                        loading={isLoadingData}
                        columns={columns}
                        dataSource={rolesData}
                        rowKey="id"
                        search={false}
                        pagination={{ pageSizeOptions: [5, 10], showSizeChanger: true, defaultPageSize: 5 }}
                        headerTitle="Role Table"
                        scroll={{ x: 'max-content' }}
                    />
                </div>
                <NewRole refetchData={refetchData} />
            </div>
            <UpdateRole
                refetchData={refetchData}
                updatedRole={updateRole}
                setIsUpdateOpen={setIsUpdateOpen}
                isUpdateOpen={isUpdateOpen}
            />
        </>
    );
};

export default Roles;
