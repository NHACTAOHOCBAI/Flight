/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Button, Form, Input, Popconfirm, message } from "antd";
import icons from "../../assets/icons";

import { useDeleteAccount } from "../../hooks/useAccounts";
import { fetchAllAccounts } from "../../services/account";
import NewAccount from "../../components/account/NewAccount";
import UpdateAccount from "../../components/account/UpdateAccount";
import useSelectOptions from "../../utils/selectOptions";
import { hasPermission } from "../../utils/checkPermission";

const Accounts = () => {
    const canCreate = hasPermission("Accounts", "POST");
    const canUpdate = hasPermission("Accounts", "PUT");
    const canDelete = hasPermission("Accounts", "DELETE");
    const { roleSelectOptions } = useSelectOptions();
    const [messageApi, contextHolder] = message.useMessage();
    const [searchForm] = Form.useForm();
    const [accountsData, setAccountsData] = useState<Account[]>([]);
    const [isNewOpen, setIsNewOpen] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [updateAccount, setUpdateAccount] = useState<Account>({
        id: 0,
        username: "",
        password: "",
        fullName: "",
        phone: "",
        avatar: "",
        role: {
            id: 0,
            roleName: "",
            pages: []
        }
    });

    const { mutate } = useDeleteAccount();

    const handleDelete = (id: number) => {
        mutate(id, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Delete account successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    const refetchData = async () => {
        setIsLoadingData(true);
        const res = await fetchAllAccounts();
        setAccountsData(res.data.result);
        setIsLoadingData(false);
    };

    const handleSearch = (value: any) => {
        console.log(value); // optional filter logic
    };

    const columns: ProColumns<Account>[] = [
        {
            title: "No.",
            render: (_text, _record, index) => <div className="text-blue-400">{index + 1}</div>,
        },
        {
            title: "Username",
            dataIndex: "username",
        },
        {
            title: "Full Name",
            dataIndex: "fullName",
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        {
            title: "Avatar",
            dataIndex: "logo",
            render: (_, record) => {
                return (
                    <img style={{
                        objectFit: "cover",
                        width: 30, height: 30,
                        borderWidth: 1,
                        borderRadius: 9999
                    }} src={record.avatar} alt="avatar" />
                )
            }
        },
        {
            title: "Role",
            render: (_, record) => <div>{record.role?.roleName}</div>,
        },
        ...(canUpdate || canDelete)
            ?
            [{
                title: "Action",
                render: (_: React.ReactNode, value: Account) => (
                    <div className="flex gap-[10px]">
                        {canUpdate && (
                            <div
                                onClick={() => {
                                    setUpdateAccount(value);
                                    setIsUpdateOpen(true);
                                }}
                                className="text-yellow-400 cursor-pointer"
                            >
                                {icons.edit}
                            </div>
                        )}
                        {canDelete && (
                            <Popconfirm
                                title="Delete the account"
                                description="Are you sure?"
                                onConfirm={() => handleDelete(value.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <div className="text-red-400 cursor-pointer">{icons.delete}</div>
                            </Popconfirm>
                        )}
                    </div>
                ),
            }]
            : []
    ];

    useEffect(() => {
        refetchData();
    }, []);

    return (
        <>
            {contextHolder}
            <div className="flex gap-[14px] drop-shadow-xs w-full h-full">
                <div className="flex  drop-shadow-xs flex-col flex-1 w-[100%] gap-[10px]">
                    <div className="w-full bg-white p-[20px] rounded-[8px]">
                        <Form layout="inline" form={searchForm} onFinish={handleSearch}>
                            <Form.Item label="Username" name="username">
                                <Input placeholder="Enter username" />
                            </Form.Item>
                            <Form.Item label="Full Name" name="fullName">
                                <Input placeholder="Enter full name" />
                            </Form.Item>
                            <Button
                                icon={icons.search}
                                type="primary"
                                htmlType="submit"
                                style={{ marginLeft: "auto" }}
                            >
                                Search
                            </Button>
                        </Form>
                    </div>
                    <ProTable<Account>
                        loading={isLoadingData}
                        columns={columns}
                        dataSource={accountsData}
                        rowKey="id"
                        search={false}
                        pagination={{
                            pageSizeOptions: [5, 10],
                            showSizeChanger: true,
                            defaultCurrent: 1,
                            defaultPageSize: 5,
                        }}
                        headerTitle="Account Table"
                        scroll={{ x: "max-content" }}
                        toolBarRender={() => {
                            if (canCreate)
                                return [
                                    <Button
                                        type="primary"
                                        key="save"
                                        onClick={() => {
                                            setIsNewOpen(true);
                                        }}
                                    >
                                        New Account
                                    </Button>,
                                ];
                            return [];
                        }}
                    />
                </div>
            </div>
            <NewAccount
                refetchData={refetchData}
                roleOptions={roleSelectOptions}
                isNewOpen={isNewOpen}
                setIsNewOpen={setIsNewOpen}
            />
            <UpdateAccount
                setUpdatedAccount={setUpdateAccount}
                roleOptions={roleSelectOptions}
                refetchData={refetchData}
                updatedAccount={updateAccount}
                setIsUpdateOpen={setIsUpdateOpen}
                isUpdateOpen={isUpdateOpen}
            />
        </>
    );
};

export default Accounts;
