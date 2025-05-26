/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FormProps } from 'antd';
import { Button, Form, Input, message } from 'antd';
import icons from '../../assets/icons';
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
                // setTimeout(() => {
                //     navigate('/login');
                // }, 1000);
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
                <img src="../../../public/loginImg.png" className='h-[600px] drop-shadow-lg' />
                <div className='w-[400px]'>
                    <h1 className='font-medium text-[24px] text-center text-blue-500 p-[24px]'>Please sign up here, tung tung shahua!!!</h1>
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
                            rules={[{ required: true, message: 'Please input your username!' }]}
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
                            rules={[{ required: true, message: 'Please input your full name!' }]}
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
                                Create account
                            </Button>
                        </Form.Item>
                    </Form>
                    <div className='relative h-[50px] flex flex-row items-center justify-center'>
                        <div className='h-[1px] w-full bg-gray-200'></div>
                        <p className='absolute text-gray-800 text-[14px] bg-white  p-[5px]'>or Sign up with</p>
                    </div>
                    <Button style={{ width: '100%' }} disabled={isPending || isRedirecting}>
                        {icons.google}Google
                    </Button>
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
