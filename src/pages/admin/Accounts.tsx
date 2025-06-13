/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProTable } from "@ant-design/pro-components";
import type { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Avatar, Button, Input, Popconfirm, message } from "antd";
import icons from "../../assets/icons";

import { useDeleteAccount } from "../../hooks/useAccounts";
import { fetchAllAccounts } from "../../services/account";
import NewAccount from "../../components/account/NewAccount";
import UpdateAccount from "../../components/account/UpdateAccount";
import useSelectOptions from "../../utils/selectOptions";
import { checkPermission } from "../../utils/checkPermission";
import debounce from "lodash.debounce";
import { useCallback } from "react";

const Accounts = () => {
    const canCreate = checkPermission("Create Account");
    const canUpdate = checkPermission("Update Account");
    const canDelete = checkPermission("Delete Account");
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const { roleSelectOptions } = useSelectOptions();
    const [messageApi, contextHolder] = message.useMessage();
    const [accountsData, setAccountsData] = useState<Account[]>([]);
    const [isNewOpen, setIsNewOpen] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const filterRoles: {
        text: string,
        value: number
    }[] = roleSelectOptions.map((value) => {
        return {
            text: value.label,
            value: value.value
        }
    })
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
            pages: [],
            roleDescription: ""
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

    const columns: ProColumns<Account>[] = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Email",
            dataIndex: "username",
        },
        {
            title: "Full Name",
            render: (_, record) => {
                if (record.fullName)
                    return record.fullName
                return <div className="text-red-300">Not updated yet...</div>
            }
        },
        {
            title: "Phone",
            render: (_, record) => {
                if (record.phone)
                    return record.phone
                return <div className="text-red-300">Not updated yet...</div>
            }
        },
        {
            title: "Avatar",
            render: (_, record) => {
                if (record.avatar) {
                    return (
                        <img
                            style={{
                                objectFit: "cover",
                                width: 30,
                                height: 30,
                                borderWidth: 1,
                                borderRadius: 9999
                            }}
                            src={record.avatar}
                            alt="avatar"
                        />
                    );
                }

                const getInitial = (fullName: string) => {
                    if (!fullName) return "?";
                    const parts = fullName.trim().split(" ");
                    return parts[parts.length - 1]?.charAt(0).toUpperCase() || "?";
                };

                return (
                    <Avatar style={{ backgroundColor: "#87d068" }}>
                        {getInitial(record.fullName)}
                    </Avatar>
                );
            }
        },

        {
            title: "Role",
            render: (_, record) => <div>{record.role?.roleName}</div>,
            filters: filterRoles,
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => record.role.id === value
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

    // Tìm kiếm với debounce
    const debouncedSearch = useCallback(
        debounce(async (email: string, fullName: string) => {
            setIsLoadingData(true);
            const res = await fetchAllAccounts();
            const filtered = res.data.result.filter((acc: Account) => {
                return (
                    acc.username.toLowerCase().includes(email.toLowerCase()) &&
                    acc.fullName.toLowerCase().includes(fullName.toLowerCase())
                );
            });
            setAccountsData(filtered);
            setIsLoadingData(false);
        }, 500),
        []
    );


    useEffect(() => {
        refetchData();
    }, []);

    return (
        <>
            {contextHolder}
            <div className="flex gap-[14px] drop-shadow-xs w-full h-full">
                <div className="flex  drop-shadow-xs flex-col flex-1 w-[100%] gap-[10px]">
                    <div className="flex gap-[30px] drop-shadow-xs  bg-white p-[20px] rounded-[8px]">
                        <div className="flex gap-[10px] items-center">
                            <p>Email:</p>
                            <Input
                                addonBefore={icons.search}
                                value={email}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setEmail(val);
                                    debouncedSearch(val, fullName);
                                }}
                                placeholder="Enter Email"
                                style={{ width: 300 }}
                            />
                        </div>
                        <div className="flex gap-[10px] items-center">
                            <p>Full Name:</p>
                            <Input
                                addonBefore={icons.search}
                                value={fullName}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setFullName(val);
                                    debouncedSearch(email, val);
                                }}
                                placeholder="Enter Fullname"
                                style={{ width: 300 }}
                            />
                        </div>
                        <Button style={{ marginLeft: "auto" }} type="primary" onClick={() => { setEmail(""); setFullName(""); refetchData(); }}>
                            {icons.reset} Reset
                        </Button>
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
