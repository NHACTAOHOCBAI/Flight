import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Login from './Login';
import Resgister from './Resgister';

const onChange = (key: string) => {
    console.log(key);
};

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Login',
        children: <Login />,
    },
    {
        key: '2',
        label: 'Sign up',
        children: <Resgister />,
    },
];

const Auth = () => (
    <div className='h-dvh bg-white flex justify-center items-center'>
        <div className='w-[40%] bg-white p-[24px] rounded-[10px] drop-shadow-md'>
            <h1 className='font-medium text-[24px]'>Welcome to our website</h1>
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
    </div>
)

export default Auth;