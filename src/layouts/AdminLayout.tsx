import { useEffect, useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Layout, Menu, theme } from 'antd';
import { Link, Outlet, useLocation } from 'react-router';
import icons from '../assets/icons';
import { getUserRoleFromToken } from '../utils/decodeJwt';
// import { useSelector } from 'react-redux';
// import type { RootState } from '../redux/app/store';
import { fetchAllRoles } from '../services/role';

const { Header, Sider, Content } = Layout;
// const roles: Role[] = [
//     {
//         id: 9,
//         roleName: "USER",
//         pages: [
//             {
//                 id: 1,
//                 pageName: "airlines"
//             },
//             {
//                 id: 2,
//                 pageName: "accounts"
//             },
//             {
//                 id: 3,
//                 pageName: "roles"
//             },
//         ]
//     }
// ]
const AdminLayout = () => {
    const { pathname } = useLocation();
    // const [roles, setRoles] = useState<Role[]>();
    // // const roles = useSelector((state: RootState) => state.role)
    // console.log(roles)
    const endpoints = pathname.split('/').pop() as string;
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    // buoc nay lay page tu account duoc luu trong context
    // const tokenData = getUserRoleFromToken();
    // const role = tokenData?.authorities?.[0]?.role ?? null;
    // console.log(role)
    // const currentRole = roles?.find((r: Role) => {
    //     console.log(`ROLE_${r.roleName.toUpperCase()}`)
    //     return `ROLE_${r.roleName.toUpperCase()}` === role
    // });
    // console.log(currentRole)
    // const permittedPages = currentRole?.pages.map((value) => value.pageName)
    // useEffect(() => {
    //     const fetchRoles = async () => {
    //         const res = await fetchAllRoles() as Role[]
    //         setRoles(res)
    //     }
    //     fetchRoles()
    // }, [])

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
    };

    // Temporary: allow all pages for demonstration, replace with real permittedPages logic as needed
    const permittedPages: string[] = Object.keys(labelMap);

    const menuItems = [
        {
            key: 'dashboard',
            icon: labelMap['dashboard'].icon,
            label: labelMap['dashboard'].label,
        },
        ...(permittedPages?.filter(p => p !== 'dashboard').map((value) => ({
            key: value,
            icon: labelMap[value].icon,
            label: labelMap[value].label
        })) || [])
    ];


    return (
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
                        padding: 14,
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;