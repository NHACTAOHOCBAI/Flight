/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { useRegister } from '../../hooks/useAuth';

type FieldType = {
    username: string;
    password: string;
    fullName: string;
    phone: string;
};

const Register = () => {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const { mutate, isPending } = useRegister();

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        mutate({
            account: {
                username: values.username,
                password: values.password,
                fullName: values.fullName,
                phone: values.phone
            }
        }, {
            onSuccess: () => {
                setIsRedirecting(true);
                messageApi.success("Register successfully!");
                navigate('/register/confirm');
            },
            onError: (error: any) => {
                const errorMsg = error?.response?.data?.message || "Register failed";
                messageApi.error(errorMsg);
            }
        });
    };

    return (
        <div className='w-lvw h-lvh flex items-center justify-center'>
            {contextHolder}
            <div className='rounded-md bg-white p-[24px] drop-shadow-md flex gap-[20px]'>

                <div className='w-[400px]'>
                    <h1 className='font-medium text-[24px] text-center text-blue-500 p-[24px]'>Please sign up here</h1>
                    <Form
                        layout="vertical"
                        name="register"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Email"
                            name="username"
                            rules={[
                                { required: true },
                                { type: 'email', message: 'Please enter a valid email address' },
                            ]}
                        >
                            <Input disabled={isPending || isRedirecting} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password disabled={isPending || isRedirecting} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Full name"
                            name="fullName"
                        >
                            <Input disabled={isPending || isRedirecting} />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Phone"
                            name="phone"
                        >
                            <Input disabled={isPending || isRedirecting} />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                style={{ width: '100%' }}
                                loading={isPending || isRedirecting}
                            >
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className='text-gray-800 text-[14px] mt-[20px]'>
                        Already have an account?{" "}
                        <Link
                            to={'/login'}
                            style={{ color: "oklch(62.3% 0.214 259.815)", textDecoration: "underline" }}
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
