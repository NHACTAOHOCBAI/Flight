import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import MyProfile from '../../components/profile/Profile';
import History from '../../components/profile/History';
const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'My Profile',
        children: <MyProfile />
    },
    {
        key: '2',
        label: 'History',
        children: <History />
    },
];

const Profile: React.FC = () => <Tabs defaultActiveKey="2" items={items} />;

export default Profile;