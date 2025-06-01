import { Form, Input, message, Modal, Select } from "antd";
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
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [form] = Form.useForm();
    const { mutate, isPending } = useCreateAccount();
    const [messageApi, contextHolder] = message.useMessage();
    const handleOk = (value: AccountRequest) => {
        mutate({
            account: value,
            ...(fileList && fileList.length > 0 && {
                logo: fileList[0].originFileObj as File,
            })
        }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Create account successfully");
                handleCancel();
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
                    <Form.Item name="username" label="Username" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true }]}>
                        <Input.Password disabled={isPending} />
                    </Form.Item>
                    <Form.Item name="fullName" label="Full Name" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
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

export default NewAccount;
