import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, message, Spin } from 'antd';
import { Link, useNavigate } from 'react-router';
import { useLogin } from '../../hooks/useAuth';
import { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { login } from '../../redux/features/user/userSlide';
import { setParams } from '../../redux/features/params/paramsSlide';
import { getAllParamaters } from '../../services/parameter';
import { setRoles } from '../../redux/features/role/roleSlide';

type FieldType = {
    username?: string;
    password?: string;
    remember?: boolean;
};

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { mutate, isPending } = useLogin();
    const [messageApi, contextHolder] = message.useMessage();
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Lấy dữ liệu từ localStorage
    const rememberedUsername = localStorage.getItem('rememberedUsername') || '';
    const rememberedPassword = localStorage.getItem('rememberedPassword') || '';
    const remembered = localStorage.getItem('rememberMe') === 'true';

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        const { username, password, remember } = values;

        // Xử lý "Remember Me"
        if (remember) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('rememberedUsername', username || '');
            localStorage.setItem('rememberedPassword', password || '');
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberedPassword');
        }

        mutate(
            {
                username: username as string,
                password: password as string
            },
            {
                onSuccess: async (data) => {
                    localStorage.setItem("accessToken", data.data.accessToken)
                    setIsRedirecting(true);
                    const params = await getAllParamaters();
                    dispatch(login(data.data.account));
                    dispatch(setParams(params.data));
                    localStorage.setItem('permission', JSON.stringify(data.data.account.role));
                    dispatch(setRoles(data.data.account.role));
                    setTimeout(() => {
                        navigate('/admin/flights');
                    }, 500);
                },
                onError: (error) => {
                    messageApi.error(error.message);
                }
            }
        );
    };

    return (
        <>
            {contextHolder}
            <div className="w-lvw h-lvh flex items-center justify-center">
                {isRedirecting ? (
                    <Spin size="large" />
                ) : (
                    <div className="rounded-md bg-white p-[24px] drop-shadow-md flex gap-[20px]">
                        <div className="w-[400px]">
                            <h1 className="font-medium text-[24px] text-center text-blue-500 p-[24px]">
                                Welcome to our website :))
                            </h1>
                            <Form
                                layout="vertical"
                                name="basic"
                                initialValues={{
                                    username: rememberedUsername,
                                    password: rememberedPassword,
                                    remember: remembered
                                }}
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item<FieldType>
                                    label="Username"
                                    name="username"
                                    rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input disabled={isPending} />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: 'Please input your password!' }]}
                                >
                                    <Input.Password disabled={isPending} />
                                </Form.Item>

                                <Form.Item<FieldType> name="remember" valuePropName="checked">
                                    <Checkbox disabled={isPending}>Remember me</Checkbox>
                                </Form.Item>

                                <Form.Item>
                                    <Button
                                        disabled={isPending}
                                        type="primary"
                                        htmlType="submit"
                                        style={{ width: '100%' }}
                                    >
                                        Sign in
                                    </Button>
                                </Form.Item>
                            </Form>

                            <p className="text-gray-800 text-[14px] mt-[20px]">
                                Don't have an account?{' '}
                                <Link
                                    to={'/register'}
                                    style={{
                                        color: 'oklch(62.3% 0.214 259.815)',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Sign up here
                                </Link>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Login;
