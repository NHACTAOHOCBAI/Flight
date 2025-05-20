import { Form, Input, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { useUpdateAccount } from "../../hooks/useAccounts";

interface Props {
    updatedAccount: Account;
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
}: Props) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdateAccount();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = (value: AccountRequest) => {
        mutate(
            { id: updatedAccount.id, account: value },
            {
                onSuccess: async () => {
                    await refetchData();
                    messageApi.success("Update account successfully");
                },
                onError: (error) => {
                    messageApi.error(error.message);
                },
                onSettled: () => {
                    setIsUpdateOpen(false);
                },
            }
        );
    };

    const handleCancel = () => {
        setIsUpdateOpen(false);
    };

    useEffect(() => {
        form.setFieldsValue({
            ...updatedAccount,
            roleId: updatedAccount.role.id,
        });
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
                    <Form.Item name="username" label="Username">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="password" label="Password">
                        <Input.Password disabled={isPending} placeholder="Leave blank to keep current password" />
                    </Form.Item>
                    <Form.Item name="email" label="Email">
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item name="fullName" label="Full Name">
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item name="phone" label="Phone">
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item name="avatar" label="Avatar URL">
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item name="roleId" label="Role">
                        <Select disabled={isPending} options={roleOptions} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateAccount;
