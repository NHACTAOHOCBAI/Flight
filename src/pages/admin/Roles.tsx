// pages/admin/Roles.tsx
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { message, Popconfirm } from "antd";
import icons from "../../assets/icons";
import { useDeleteRole } from "../../hooks/useRoles";
import { fetchAllRoles } from "../../services/role";
import NewRole from "../../components/role/NewRole";
import UpdateRole from "../../components/role/UpdateRole";
import { checkPermission } from "../../utils/checkPermission";
import DetailRole from "../../components/role/DetailRole";
import { LuEye } from "react-icons/lu";

const Roles = () => {
    const canCreate = checkPermission("Create Role");
    const canUpdate = checkPermission("Update Role");
    const canDelete = checkPermission("Delete Role");
    const [messageApi, contextHolder] = message.useMessage();
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [detailRole, setDetailRole] = useState<Role>({
        id: 0,
        roleName: "",
        pages: [],
        roleDescription: ""
    });
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateRole, setUpdateRole] = useState<Role>({
        id: 0,
        roleName: "",
        pages: [],
        roleDescription: ""
    });
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
        setRolesData(res.data.result);
        setIsLoadingData(false);
    };
    const columns: ProColumns<Role>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{index + 1}</div>,
        },
        {
            title: "Role Name",
            dataIndex: "roleName"
        },

        {
            title: "Action",
            render: (_: React.ReactNode, value: Role) => (
                <div className="flex gap-[10px] items-center">
                    <div className="text-blue-400"
                        onClick={() => {
                            setDetailRole(value);
                            setIsDetailOpen(true);
                        }}
                    >
                        <LuEye />
                    </div>
                    {canUpdate && <div
                        onClick={() => {
                            setUpdateRole(value);
                            setIsUpdateOpen(true);
                        }}
                        className="text-yellow-400"
                    >
                        {icons.edit}
                    </div>}
                    {
                        canDelete &&
                        <Popconfirm
                            title="Delete the role"
                            onConfirm={() => handleDelete(value.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <div className="text-red-400">{icons.delete}</div>
                        </Popconfirm>
                    }
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
                <div className="flex  drop-shadow-xs flex-col flex-1 w-[60%] gap-[10px]">
                    <ProTable<Role>
                        loading={isLoadingData}
                        columns={columns}
                        dataSource={rolesData}
                        rowKey="id"
                        search={false}
                        pagination={{ pageSizeOptions: [5, 10], showSizeChanger: true, defaultPageSize: 5 }}
                        headerTitle="Role Table"
                        scroll={{ x: 'max-content' }}
                        options={{
                            reload: false,
                        }}
                    />
                </div>
                {canCreate && <NewRole refetchData={refetchData} />}
            </div>
            <UpdateRole
                refetchData={refetchData}
                updatedRole={updateRole}
                setIsUpdateOpen={setIsUpdateOpen}
                isUpdateOpen={isUpdateOpen}
            />
            <DetailRole
                isDetailOpen={isDetailOpen}
                setIsDetailOpen={setIsDetailOpen}
                detailRole={detailRole}
            />
        </>
    );
};

export default Roles;
