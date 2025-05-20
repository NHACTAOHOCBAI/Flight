import { Form, Input, message, Modal, Select } from "antd";
import { useCreateAccount } from "../../hooks/useAccounts";

interface Props {
    refetchData: () => Promise<void>;
    roleOptions: { value: number; label: string }[];
    isNewOpen: boolean;
    setIsNewOpen: (value: boolean) => void;
}

const NewAccount = ({ refetchData, roleOptions, isNewOpen, setIsNewOpen }: Props) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useCreateAccount();
    const [messageApi, contextHolder] = message.useMessage();
    const handleOk = (value: AccountRequest) => {
        mutate({
            account: value,
        }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Create airline successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };
    const handleCancel = () => {
        setIsNewOpen(false);
        form.resetFields();
    };
    return (
        <>
            {contextHolder}
            <Modal
                title="Update Account"
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
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                        <Input disabled={isPending} />
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
                </Form>
            </Modal>
        </>
    );
};

export default NewAccount;
