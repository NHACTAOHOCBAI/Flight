import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, message, Spin } from 'antd';
import icons from '../../assets/icons';
import { Link, useNavigate } from 'react-router';
import { useLogin } from '../../hooks/useAuth';
import { useState } from 'react';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { getUserRoleFromToken } from '../../utils/decodeJwt';
import { login } from '../../redux/features/user/userSlide';

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const Login = () => {
    const dispath = useAppDispatch()
    const navigate = useNavigate();
    const { mutate, isPending } = useLogin();
    const [messageApi, contextHolder] = message.useMessage();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        mutate({
            username: values.username as string,
            password: values.password as string
        }, {
            onSuccess: async (data) => {
                setIsRedirecting(true);
                localStorage.setItem('accessToken', data.data);
                const tokenData = getUserRoleFromToken();
                console.log(tokenData)
                if (tokenData) {
                    dispath(login(tokenData));
                }
                setTimeout(() => {
                    navigate('/admin');
                }, 500);
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    return (
        <>
            {contextHolder}
            <div className=' w-lvw h-lvh flex items-center justify-center'>
                {isRedirecting ? <Spin size='large' /> :
                    <div className=' rounded-md bg-white p-[24px] drop-shadow-md flex gap-[20px]'>
                        <div className='w-[400px]'>
                            <h1 className='font-medium text-[24px] text-center text-blue-500 p-[24px]'>Wellcome to our website :))</h1>
                            <Form
                                layout="vertical"
                                name="basic"
                                initialValues={{ remember: true }}
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

                                <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
                                    <Checkbox disabled={isPending}>Remember me</Checkbox>
                                </Form.Item>

                                <Form.Item label={null}>
                                    <Button disabled={isPending} type="primary" htmlType="submit" style={{ width: '100%' }}>
                                        Sign in
                                    </Button>
                                </Form.Item>
                            </Form>
                            <div className='relative h-[50px] flex flex-row items-center justify-center'>
                                <div className='h-[1px] w-full bg-gray-200'></div>
                                <p className='absolute text-gray-800 text-[14px] bg-white  p-[5px]'>or Sign In with</p>
                            </div>
                            <Button disabled={isPending} style={{ width: '100%' }}>
                                {icons.google}Google
                            </Button>
                            <p className=' text-gray-800 text-[14px] mt-[20px]'>Don't have an account? <Link to={'/register'} style={{ color: "oklch(62.3% 0.214 259.815)", textDecoration: "underline" }}>Sign up here</Link></p>
                        </div>
                        {/* <img src="../../../public/registerImg.png" className='h-[500px] drop-shadow-lg' /> */}
                    </div>
                }

            </div>
        </>
    )
};

export default Login;