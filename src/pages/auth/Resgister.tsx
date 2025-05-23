import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import icons from '../../assets/icons';
import { Link } from 'react-router';

type FieldType = {
    username: string;
    password: string;
    fullName: string;
    phone: string;
    remember?: string;
};

const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const Register = () => {
    return (
        <div className=' w-lvw h-lvh flex items-center justify-center'>
            <div className=' rounded-md bg-white p-[24px] drop-shadow-md flex gap-[20px]'>
                <img src="../../../public/loginImg.png" className='h-[600px] drop-shadow-lg' />
                <div className='w-[400px] '>
                    <h1 className='font-medium text-[24px] text-center text-blue-500 p-[24px]'>Please sign up here, tung tung shahua!!!</h1>
                    <Form
                        layout="vertical"
                        name="basic"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item<FieldType>
                            label="Email"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Full name"
                            name="fullName"
                            rules={[{ required: true, message: 'Please input your full name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item<FieldType>
                            label="Phone"
                            name="phone"
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label={null}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                                Create account
                            </Button>
                        </Form.Item>
                    </Form>
                    <div className='relative h-[50px] flex flex-row items-center justify-center'>
                        <div className='h-[1px] w-full bg-gray-200'></div>
                        <p className='absolute text-gray-800 text-[14px] bg-white  p-[5px]'>or Sign up with</p>
                    </div>
                    <Button style={{ width: '100%' }}>
                        {icons.google}Google
                    </Button>
                    <p className=' text-gray-800 text-[14px] mt-[20px]'>Already have an account? <Link to={'/login'} style={{ color: "oklch(62.3% 0.214 259.815)", textDecoration: "underline" }}>Login</Link></p>
                </div>
            </div>
        </div>

    )
};

export default Register;