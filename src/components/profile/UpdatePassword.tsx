
import { Form, Input, message, Modal } from 'antd';
import { useState } from 'react';
import { updatePassword } from '../../services/profile';
interface Props {
    fetchUserInf: () => Promise<void>
    isModalOpen: boolean
    setIsModalOpen: (value: boolean) => void
}
const UpdatePassword = ({ isModalOpen, setIsModalOpen, fetchUserInf }: Props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [isPending, setIsPending] = useState(false)
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };
    const handleChangePassword = async (value: { oldPassword: string, newPassword: string }) => {
        try {
            setIsPending(false)
            await updatePassword(value);
            await fetchUserInf()
            messageApi.success("Update profile successfully");
            handleCancel()
        }
        catch (error) {
            if (error && typeof error === "object" && "message" in error) {
                messageApi.error((error as { message: string }).message);
            } else {
                messageApi.error("An error occurred while changing password");
            }
        }
        setIsPending(false)
    }
    const [form] = Form.useForm();
    return (
        <>
            {contextHolder}
            <Modal
                loading={isPending}
                title="Change Password"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={handleCancel}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleChangePassword}
                >
                    <Form.Item
                        name="oldPassword"
                        label="Old Password"
                        rules={[{ required: true, message: 'Please enter your old password' }]}
                    >
                        <Input.Password disabled={isPending} />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[{ required: true, message: 'Please enter a new password' }]}
                    >
                        <Input.Password disabled={isPending} />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Please confirm your new password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password disabled={isPending} />
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
};

export default UpdatePassword;