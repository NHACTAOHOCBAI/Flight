import { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router';
import icons from '../assets/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    // buoc nay lay page tu account duoc luu trong context
    const permittedPages = [
        'dashboard',
        'cities',
        'airports',
        'airlines',
        'planes',
        'flights',
        'tickets',
        'seats',
        'roles',
        'accounts',
        'setting',
    ];

    //
    const labelMap: Record<string, { label: React.ReactNode; icon: React.ReactNode }> = {
        dashboard: { label: <Link to="/admin/dashboard">Dashboard</Link>, icon: icons.dashboard },
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
    };

    const menuItems = permittedPages.map((value, index) => {
        return ({
            key: index,
            icon: labelMap[value].icon,
            label: labelMap[value].label
        })
    })

    return (
        <Layout style={{ height: '100vh' }}>
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
                    defaultSelectedKeys={['1']}
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
                    <Avatar
                        style={{
                            marginLeft: 'auto',
                            marginRight: 20,
                            backgroundColor: "oklch(80.9% 0.105 251.813)"
                        }}
                        src={<img src={"https://i1.sndcdn.com/artworks-PLgC53YqkzWnTZqP-yBrw4g-t500x500.jpg"} alt="avatar" />} />
                    <div className=' text-blue-500'>Hi, Phuc Nguyen</div>
                </Header>
                <Content
                    style={{
                        margin: '16px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;