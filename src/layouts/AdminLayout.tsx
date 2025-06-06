import { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, message, Popover, Spin, theme } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import icons from '../assets/icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/app/store';
import { getCurrentUser, logoutAPI } from '../services/auth';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { login, logout } from '../redux/features/user/userSlide';

const { Header, Sider, Content } = Layout;
const AdminLayout = () => {
    const navigator = useNavigate();
    const dispath = useAppDispatch()
    const [messageApi, contextHolder] = message.useMessage();
    const [isPendingLogout, setIsPendingLogout] = useState(false)
    const handleLogout = async () => {
        setIsPendingLogout(true)
        try {
            await logoutAPI();
            navigator('/login')
            messageApi.success("Logout successfully");
            localStorage.removeItem('accessToken')
            dispath(logout());
        }
        catch {
            messageApi.error("Logout failed");
        }
        setIsPendingLogout(false)
    }
    const myAccount = useSelector((state: RootState) => state.user)
    const { pathname } = useLocation();
    const endpoints = pathname.split('/').pop() as string;
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    useEffect(() => {
        const fetchUserInf = async () => {
            const response = await getCurrentUser();
            console.log(response)
            dispath(login(response));
        }
        fetchUserInf()
    }, [])
    const labelMap: Record<string, { label: React.ReactNode; icon: React.ReactNode }> = {
        dashboard: { label: <Link to="/admin">Dashboard</Link>, icon: icons.dashboard },
        accounts: { label: <Link to="/admin/accounts">Account</Link>, icon: icons.account },
        airlines: { label: <Link to="/admin/airlines">Airline</Link>, icon: icons.airline },
        airports: { label: <Link to="/admin/airports">Airport</Link>, icon: icons.airport },
        cities: { label: <Link to="/admin/cities">City</Link>, icon: icons.city },
        flights: { label: <Link to="/admin/flights">Flight</Link>, icon: icons.flight },
        planes: { label: <Link to="/admin/planes">Plane</Link>, icon: icons.plane },
        roles: { label: <Link to="/admin/roles">Role</Link>, icon: icons.role },
        seats: { label: <Link to="/admin/seats">Seat</Link>, icon: icons.seat },
        setting: { label: <Link to="/admin/setting">Setting</Link>, icon: icons.setting },
        tickets: { label: <Link to="/admin/tickets">Ticket</Link>, icon: icons.ticket },
        profile: { label: <Link to="/admin/profile">Profile</Link>, icon: icons.profile },
    };

    // Temporary: allow all pages for demonstration, replace with real permittedPages logic as needed
    const permittedPages: string[] = Object.keys(labelMap);

    const menuItems = [
        {
            key: '',
            icon: labelMap['dashboard'].icon,
            label: labelMap['dashboard'].label,
        },
        ...(permittedPages?.filter(p => p !== 'dashboard' && p !== 'profile').map((value) => ({
            key: value,
            icon: labelMap[value].icon,
            label: labelMap[value].label
        })) || []),
        {
            key: 'profile',
            icon: labelMap['profile'].icon,
            label: labelMap['profile'].label,
        },
    ];

    const content = () => {
        return (
            <div className='flex  flex-col gap-[10px]'>
                <Button onClick={() => navigator('/admin/profile')}>My profile</Button>
                <Button onClick={handleLogout}>Log out</Button>
            </div>
        )
    }
    return (
        <>
            {contextHolder}
            {isPendingLogout ?
                <div className='h-dvh w-dvw flex justify-center items-center'>
                    <Spin size="large" />
                </div>
                :
                <Layout style={{ height: '100%', minHeight: '100vh' }}>
                    <Sider
                        trigger={null} collapsible collapsed={collapsed}
                        style={{
                            backgroundColor: colorBgContainer,
                            boxShadow: " 0 4px 4px 0 rgba(0, 0, 0, 0.1)"
                        }}>
                        <div className="demo-logo-vertical" />
                        <Menu
                            theme="light"
                            mode="inline"
                            selectedKeys={[endpoints]}
                            items={menuItems}
                        />
                    </Sider>
                    <Layout>
                        <Header style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: 0,
                            background: colorBgContainer,
                            boxShadow: " 0 1px 1px 0 rgba(0, 0, 0, 0.1)",
                            paddingRight: 20
                        }}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <Popover content={content}>
                                <div className='flex items-center ml-auto'>
                                    <Avatar
                                        style={{
                                            marginRight: 20,
                                            backgroundColor: "oklch(80.9% 0.105 251.813)"
                                        }}
                                        src={<img src={myAccount?.user?.avatar ?? undefined} alt="avatar" />} />
                                    <div className=' text-blue-500'>Hi, {myAccount?.user?.fullName}</div>
                                </div>
                            </Popover>
                        </Header>
                        <Content
                            style={{
                                padding: 14,
                                minHeight: 280,
                            }}
                        >
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            }

        </>
    );
};

export default AdminLayout;