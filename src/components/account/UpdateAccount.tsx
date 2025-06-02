import { Form, Input, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { useUpdateAccount } from "../../hooks/useAccounts";
import UploadImage from "../airline/test";
import type { UploadFile } from "antd/lib";

interface Props {
    updatedAccount: Account;
    setUpdatedAccount: (value: Account) => void
    isUpdateOpen: boolean;
    setIsUpdateOpen: (value: boolean) => void;
    refetchData: () => Promise<void>;
    roleOptions: { value: number; label: string }[];
}

const UpdateAccount = ({
    updatedAccount,
    isUpdateOpen,
    setIsUpdateOpen,
    refetchData,
    roleOptions,
    setUpdatedAccount
}: Props) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdateAccount();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = (value: AccountRequest) => {
        mutate({
            id: updatedAccount.id,
            account: value,
            ...(fileList && fileList.length > 0 && {
                logo: fileList[0].originFileObj as File,
            })
        },
            {
                onSuccess: async () => {
                    await refetchData();
                    messageApi.success("Update account successfully");
                    handleCancel();
                },
                onError: (error) => {
                    messageApi.error(error.message);
                }
            }
        );
    };

    const handleCancel = () => {
        setUpdatedAccount({
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
        })
        setFileList([])
        setIsUpdateOpen(false);
        form.resetFields();
    };

    useEffect(() => {
        form.setFieldsValue({
            ...updatedAccount,
            roleId: updatedAccount.role.id,
        });
        setFileList([
            {
                uid: '-1',
                name: 'avatar.jpg',
                status: 'done',
                url: updatedAccount.avatar
            },
        ])
    }, [updatedAccount, form]);

    return (
        <>
            {contextHolder}
            <Modal
                title="Update Account"
                open={isUpdateOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                confirmLoading={isPending}
            >
                <Form layout="vertical" form={form} onFinish={handleOk}>
                    <Form.Item name="id" label="Id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="username" label="Email" rules={[{ required: true }]}>
                        <Input disabled placeholder="Leave blank to keep current password" />
                    </Form.Item>
                    <Form.Item
                        name="fullName"
                        label="Full Name"
                    >
                        <Input disabled={isPending} />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        label="Phone"
                        rules={[
                            {
                                pattern: /^\d{10,11}$/,
                                message: 'Phone number must be 10 or 11 digits',
                            },
                        ]}
                    >
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item name="roleId" label="Role" rules={[{ required: true }]}>
                        <Select disabled={isPending} options={roleOptions} />
                    </Form.Item>
                    <div className="mb-[10px]">
                        <h3 className="mb-[10px]">Avatar<span className="text-gray-300">{" (optional)"}</span></h3>
                        <UploadImage
                            isPending={isPending}
                            fileList={fileList}
                            setFileList={setFileList}
                        />
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateAccount;
