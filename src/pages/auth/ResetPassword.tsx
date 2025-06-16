/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import { resetPassword } from "../../services/auth";
import { useNavigate } from "react-router";
import icons from "../../assets/icons";

const ResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const onFinish = async (values: { token: string, newPassword: string }) => {
        setLoading(true);
        try {
            await resetPassword(values.token, values.newPassword)
            message.success(`Update new password successfully`);
            navigate('/login')
        }
        catch (err: any) {
            message.error(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center  p-4">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <h1 className="font-medium text-[24px] text-center text-blue-500 p-[24px]">
                    Reset Password
                </h1>
                <Form
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Token"
                        name="token"
                        rules={
                            [{ required: true, message: "Please enter token" },]
                        }
                    >
                        <Input
                            placeholder="Enter token"
                            disabled={loading}
                        />
                    </Form.Item>

                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={
                            [{ required: true, message: "Please enter new password" },]
                        }
                    >
                        <Input
                            placeholder="Enter new password"
                            disabled={loading}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Send New Password
                        </Button>
                    </Form.Item>
                </Form>
                <div className="flex gap-[5px] items-center cursor-pointer text-blue-500" onClick={() => navigate("/login")}><div>{icons.arrow}</div> <span className="text-[14px]">Go back log in</span></div>
            </div>
        </div>
    );
};

export default ResetPassword;
