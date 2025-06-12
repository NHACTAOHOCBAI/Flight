import { Drawer, Descriptions, Divider, Tag } from "antd";
import {
    EyeOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
interface Page {
    id: number;
    name: string;
    apiPath: string;
    method: string;
    module: string;
    color?: string;
    icon?: React.ReactNode;
}
interface Props {
    isDetailOpen: boolean;
    setIsDetailOpen: (value: boolean) => void;
    detailRole: Role;
}


const DetailRole = ({ isDetailOpen, setIsDetailOpen, detailRole }: Props) => {
    console.log(detailRole)
    // Lấy danh sách ID các page mà role hiện tại đang có
    const rolePageIds = new Set(detailRole.pages.map((p) => p.id));

    // Lọc theo hardcodedPagesByModule, chỉ giữ những page nào có trong role
    const filteredModules = Object.entries(hardcodedPagesByModule)
        .map(([module, pages]) => {
            const matchedPages = pages.filter((p) => rolePageIds.has(p.id));
            return matchedPages.length > 0 ? { module, pages: matchedPages } : null;
        })
        .filter(Boolean) as { module: string; pages: Page[] }[];

    return (
        <Drawer
            title="Detail Role"
            closable
            onClose={() => setIsDetailOpen(false)}
            open={isDetailOpen}
            width={700}
        >
            <Descriptions title="Role Info" bordered column={1}>
                <Descriptions.Item label="ID">{detailRole.id}</Descriptions.Item>
                <Descriptions.Item label="Role Name">{detailRole.roleName}</Descriptions.Item>
                <Descriptions.Item label="Description">
                    {detailRole.roleDescription || "No description"}
                </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Permissions</Divider>

            {filteredModules.map(({ module, pages }) => (
                <div key={module} style={{ marginBottom: 24 }}>
                    <h3 className="font-medium mb-[10px] text-blue-300">{module}</h3>
                    <div className="flex flex-col gap-[10px]">
                        {pages.map((page) => (
                            <div
                                key={page.id}
                            >
                                <Tag color={page.color} style={{ display: "flex", alignItems: "center", gap: 8, width: 200 }}>
                                    {page.icon}
                                    <p>{page.name}</p>
                                </Tag>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </Drawer>
    );
};
const hardcodedPagesByModule: Record<string, Page[]> = {
    "Account": [
        { id: 20, name: "View Account", apiPath: "/accounts/**", method: "GET", module: "Account", icon: <EyeOutlined />, color: "blue" },
        { id: 21, name: "Create Account", apiPath: "/accounts/**", method: "POST", module: "Account", icon: <PlusOutlined />, color: "green" },
        { id: 22, name: "Edit Account", apiPath: "/accounts/**", method: "PUT", module: "Account", icon: <EditOutlined />, color: "orange" },
        { id: 23, name: "Delete Account", apiPath: "/accounts/**", method: "DELETE", module: "Account", icon: <DeleteOutlined />, color: "red" },
        { id: 24, name: "Change Password", apiPath: "/accounts/**/change-password/**", method: "POST", module: "Account", icon: <EditOutlined />, color: "purple" },
    ],
    "Airline": [
        { id: 31, name: "Create Airline", apiPath: "/airlines/**", method: "POST", module: "Airline", icon: <PlusOutlined />, color: "green" },
        { id: 32, name: "Edit Airline", apiPath: "/airlines/**", method: "PUT", module: "Airline", icon: <EditOutlined />, color: "orange" },
        { id: 33, name: "Delete Airline", apiPath: "/airlines/**", method: "DELETE", module: "Airline", icon: <DeleteOutlined />, color: "red" },
    ],
    "Airport": [
        { id: 41, name: "Create Airport", apiPath: "/airports/**", method: "POST", module: "Airport", icon: <PlusOutlined />, color: "green" },
        { id: 42, name: "Edit Airport", apiPath: "/airports/**", method: "PUT", module: "Airport", icon: <EditOutlined />, color: "orange" },
        { id: 43, name: "Delete Airport", apiPath: "/airports/**", method: "DELETE", module: "Airport", icon: <DeleteOutlined />, color: "red" },
    ],
    "City": [
        { id: 51, name: "Create City", apiPath: "/cities/**", method: "POST", module: "City", icon: <PlusOutlined />, color: "green" },
        { id: 52, name: "Edit City", apiPath: "/cities/**", method: "PUT", module: "City", icon: <EditOutlined />, color: "orange" },
        { id: 53, name: "Delete City", apiPath: "/cities/**", method: "DELETE", module: "City", icon: <DeleteOutlined />, color: "red" },
    ],
    "Flight": [
        { id: 61, name: "Create Flight", apiPath: "/flights/**", method: "POST", module: "Flight", icon: <PlusOutlined />, color: "green" },
        { id: 62, name: "Edit Flight", apiPath: "/flights/**", method: "PUT", module: "Flight", icon: <EditOutlined />, color: "orange" },
        { id: 63, name: "Delete Flight", apiPath: "/flights/**", method: "DELETE", module: "Flight", icon: <DeleteOutlined />, color: "red" },
    ],
    "Plane": [
        { id: 71, name: "Create Plane", apiPath: "/planes/**", method: "POST", module: "Plane", icon: <PlusOutlined />, color: "green" },
        { id: 72, name: "Edit Plane", apiPath: "/planes/**", method: "PUT", module: "Plane", icon: <EditOutlined />, color: "orange" },
        { id: 73, name: "Delete Plane", apiPath: "/planes/**", method: "DELETE", module: "Plane", icon: <DeleteOutlined />, color: "red" },
    ],
    "Role": [
        { id: 80, name: "View Role", apiPath: "/roles/**", method: "GET", module: "Role", icon: <EyeOutlined />, color: "blue" },
        { id: 81, name: "Create Role", apiPath: "/roles/**", method: "POST", module: "Role", icon: <PlusOutlined />, color: "green" },
        { id: 82, name: "Edit Role", apiPath: "/roles/**", method: "PUT", module: "Role", icon: <EditOutlined />, color: "orange" },
        { id: 83, name: "Delete Role", apiPath: "/roles/**", method: "DELETE", module: "Role", icon: <DeleteOutlined />, color: "red" },
    ],
    "Seat": [
        { id: 91, name: "Create Seat", apiPath: "/seats/**", method: "POST", module: "Seat", icon: <PlusOutlined />, color: "green" },
        { id: 92, name: "Edit Seat", apiPath: "/seats/**", method: "PUT", module: "Seat", icon: <EditOutlined />, color: "orange" },
        { id: 93, name: "Delete Seat", apiPath: "/seats/**", method: "DELETE", module: "Seat", icon: <DeleteOutlined />, color: "red" },
    ],
    "Setting": [
        { id: 101, name: "Update Settings", apiPath: "/parameters/**", method: "PUT", module: "Setting", icon: <EditOutlined />, color: "orange" },
    ],
    "Ticket": [
        { id: 110, name: "View Ticket", apiPath: "/tickets/**", method: "GET", module: "Ticket", icon: <EyeOutlined />, color: "blue" },
        { id: 111, name: "Create Ticket", apiPath: "/tickets/**", method: "POST", module: "Ticket", icon: <PlusOutlined />, color: "green" },
        { id: 112, name: "Edit Ticket", apiPath: "/tickets/**", method: "PUT", module: "Ticket", icon: <EditOutlined />, color: "orange" },
        { id: 113, name: "Delete Ticket", apiPath: "/tickets/**", method: "DELETE", module: "Ticket", icon: <DeleteOutlined />, color: "red" },
        { id: 114, name: "Get Total Revenue", apiPath: "/tickets/revenue/**", method: "GET", module: "Ticket", icon: <EyeOutlined />, color: "purple" },
        { id: 115, name: "Get Booking Rate", apiPath: "/tickets/booking-rate/**", method: "GET", module: "Ticket", icon: <EyeOutlined />, color: "cyan" },
    ],
    "Report": [
        { id: 120, name: "Get Annual Revenue Report", apiPath: "/reports/annual-revenue/**", method: "GET", module: "Report", icon: <EyeOutlined />, color: "gold" },
        { id: 121, name: "Get Monthly Revenue Report", apiPath: "/reports/monthly-revenue/**/**", method: "GET", module: "Report", icon: <EyeOutlined />, color: "lime" },
    ],
};
export default DetailRole;
