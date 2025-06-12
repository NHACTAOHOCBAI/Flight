import { Form, Input, message, Modal, notification, Select } from "antd";
import { useCreateAccount } from "../../hooks/useAccounts";
import type { UploadFile } from "antd/lib";
import { useState } from "react";
import UploadImage from "../airline/test";

interface Props {
    refetchData: () => Promise<void>;
    roleOptions: { value: number; label: string }[];
    isNewOpen: boolean;
    setIsNewOpen: (value: boolean) => void;
}

const NewAccount = ({ refetchData, roleOptions, isNewOpen, setIsNewOpen }: Props) => {
    const [api, notiContextHolder] = notification.useNotification();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
    const { mutate, isPending } = useCreateAccount();
    const [messageApi, contextHolder] = message.useMessage();
    const openNotification = () => {
        api.success({
            message: 'Email verification',
            description:
                'We sent a verification link to your email. Please click it to active your account',
            duration: 0,
        });
    };

    const handleOk = (value: AccountRequest) => {
        mutate({
            account: value,
            ...(fileList && fileList.length > 0 && {
                avatar: fileList[0].originFileObj as File,
            })
        }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Create account successfully");
                handleCancel();
                openNotification()
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };
    const handleCancel = () => {
        setFileList([])
        setIsNewOpen(false);
        form.resetFields();
    };
    return (
        <>
            {notiContextHolder}
            {contextHolder}
            <Modal
                okText='Create'
                title="New Account"
                open={isNewOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                confirmLoading={isPending}
            >
                <Form layout="vertical" form={form} onFinish={handleOk}>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            { required: true },
                            { type: 'email', message: 'Please enter a valid email address' },
                        ]}
                    >
                        <Input disabled={isPending} />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Password is required' }]}
                    >
                        <Input.Password disabled={isPending} />
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

                    <Form.Item
                        name="roleId"
                        label="Role"
                        rules={[{ required: true, message: 'Role is required' }]}
                    >
                        <Select disabled={isPending} options={roleOptions} />
                    </Form.Item>

                    <div className="mb-[10px]">
                        <h3 className="mb-[10px]">
                            Avatar<span className="text-gray-300">{" (optional)"}</span>
                        </h3>
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
export default NewAccount;
