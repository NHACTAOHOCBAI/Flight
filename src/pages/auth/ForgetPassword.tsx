/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Form, Input, message } from "antd";
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import { forgotPassword } from "../../services/auth";
import { useNavigate } from "react-router";

const ForgetPassword = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const [messageApi, contextHolder] = message.useMessage();
    const onFinish = async (values: { email: string }) => {
        setLoading(true);
        try {
            await forgotPassword(values.email)
            messageApi.success(`Password reset link sent to ${values.email}`);
            navigate('/reset-password')
        }
        catch (err: any) {
            messageApi.error(err.message);
        }
        setLoading(false);
    };

    return (
        <>
            {contextHolder}
            <div className="min-h-screen flex items-center justify-center  p-4">
                <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                    <h1 className="font-medium text-[24px] text-center text-blue-500 p-[24px]">
                        Forgot Password
                    </h1>
                    <Form
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Email is not valid" },
                            ]}
                        >
                            <Input
                                prefix={<CiMail />}
                                placeholder="Enter your email"
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
                                Send Reset Link
                            </Button>
                        </Form.Item>

                    </Form>
                </div>
            </div>
        </>
    );
};

export default ForgetPassword;
