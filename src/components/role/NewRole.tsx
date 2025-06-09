import { Button, Form, Input, Checkbox, message, Divider, Tag } from "antd";
import { useCreateRole } from "../../hooks/useRoles";
import { EyeOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
interface Page {
    id: number;
    name: string;
    apiPath: string;
    method: string;
    module: string;
    color?: string;
    icon?: React.ReactNode;
}
const NewRole = ({ refetchData }: { refetchData: () => Promise<void> }) => {
    const { mutate, isPending } = useCreateRole();
    const [messageApi, contextHolder] = message.useMessage();

    const handleNew = (value: { roleName: string; roleDescription: string, pages: number[] }) => {
        const allPages = Object.values(hardcodedPagesByModule).flat();
        const selectedEndpoints = allPages
            .filter((page) => value.pages.includes(page.id))
            .map((page) => ({
                method: page.method,
                apiPath: page.apiPath,
            }));
        const input = {
            roleName: value.roleName,
            roleDescription: value.roleDescription || "",
            pageInfos: selectedEndpoints,
        }
        mutate(input, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Create role successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };
    return (
        <>
            {contextHolder}
            <div className="bg-white drop-shadow-xs p-[24px] w-[50%] h-full rounded-[8px] overflow-y-auto">
                <div className="font-medium text-[16px] mb-[10px]">Create Role</div>
                <Form layout="vertical" onFinish={handleNew}>
                    <Form.Item label="Role Name" name="roleName" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Description" name="roleDescription" >
                        <TextArea rows={4} maxLength={100} />
                    </Form.Item>
                    <Form.Item label="Permission" name="pages" rules={[{ required: true }]}>
                        <Checkbox.Group style={{ width: "100%" }}>
                            <div className="flex flex-col overflow-y-auto pr-2">
                                {Object.entries(hardcodedPagesByModule).map(([module, pages]) => (
                                    <div key={module}>
                                        <Divider orientation="left" plain>
                                            {module}
                                        </Divider>
                                        <div className="flex gap-[5px]">
                                            {pages.map((page) => (
                                                <Checkbox key={page.id} value={page.id}>
                                                    <Tag icon={page.icon} color={page.color}>{page.name}</Tag>
                                                </Checkbox>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={isPending} style={{ width: "100%" }}>
                            Create Role
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};
const hardcodedPagesByModule: Record<string, Page[]> = {
    "Account": [
        { id: 20, name: "View Accounts", apiPath: "/accounts/**", method: "GET", module: "Account", icon: <EyeOutlined />, color: "blue" },
        { id: 21, name: "Create Account", apiPath: "/accounts/**", method: "POST", module: "Account", icon: <PlusOutlined />, color: "green" },
        { id: 22, name: "Edit Account", apiPath: "/accounts/**", method: "PUT", module: "Account", icon: <EditOutlined />, color: "orange" },
        { id: 23, name: "Delete Account", apiPath: "/accounts/**", method: "DELETE", module: "Account", icon: <DeleteOutlined />, color: "red" },
    ],
    "Airline": [
        { id: 30, name: "View Airlines", apiPath: "/airlines/**", method: "GET", module: "Airline", icon: <EyeOutlined />, color: "blue" },
        { id: 31, name: "Create Airline", apiPath: "/airlines/**", method: "POST", module: "Airline", icon: <PlusOutlined />, color: "green" },
        { id: 32, name: "Edit Airline", apiPath: "/airlines/**", method: "PUT", module: "Airline", icon: <EditOutlined />, color: "orange" },
        { id: 33, name: "Delete Airline", apiPath: "/airlines/**", method: "DELETE", module: "Airline", icon: <DeleteOutlined />, color: "red" },
    ],
    "Airport": [
        { id: 40, name: "View Airports", apiPath: "/airports/**", method: "GET", module: "Airport", icon: <EyeOutlined />, color: "blue" },
        { id: 41, name: "Create Airport", apiPath: "/airports/**", method: "POST", module: "Airport", icon: <PlusOutlined />, color: "green" },
        { id: 42, name: "Edit Airport", apiPath: "/airports/**", method: "PUT", module: "Airport", icon: <EditOutlined />, color: "orange" },
        { id: 43, name: "Delete Airport", apiPath: "/airports/**", method: "DELETE", module: "Airport", icon: <DeleteOutlined />, color: "red" },
    ],
    "City": [
        { id: 50, name: "View Cities", apiPath: "/cities/**", method: "GET", module: "City", icon: <EyeOutlined />, color: "blue" },
        { id: 51, name: "Create City", apiPath: "/cities/**", method: "POST", module: "City", icon: <PlusOutlined />, color: "green" },
        { id: 52, name: "Edit City", apiPath: "/cities/**", method: "PUT", module: "City", icon: <EditOutlined />, color: "orange" },
        { id: 53, name: "Delete City", apiPath: "/cities/**", method: "DELETE", module: "City", icon: <DeleteOutlined />, color: "red" },
    ],
    "Flight": [
        { id: 60, name: "View Flights", apiPath: "/flights/**", method: "GET", module: "Flight", icon: <EyeOutlined />, color: "blue" },
        { id: 61, name: "Create Flight", apiPath: "/flights/**", method: "POST", module: "Flight", icon: <PlusOutlined />, color: "green" },
        { id: 62, name: "Edit Flight", apiPath: "/flights/**", method: "PUT", module: "Flight", icon: <EditOutlined />, color: "orange" },
        { id: 63, name: "Delete Flight", apiPath: "/flights/**", method: "DELETE", module: "Flight", icon: <DeleteOutlined />, color: "red" },
    ],
    "Plane": [
        { id: 70, name: "View Planes", apiPath: "/planes/**", method: "GET", module: "Plane", icon: <EyeOutlined />, color: "blue" },
        { id: 71, name: "Create Plane", apiPath: "/planes/**", method: "POST", module: "Plane", icon: <PlusOutlined />, color: "green" },
        { id: 72, name: "Edit Plane", apiPath: "/planes/**", method: "PUT", module: "Plane", icon: <EditOutlined />, color: "orange" },
        { id: 73, name: "Delete Plane", apiPath: "/planes/**", method: "DELETE", module: "Plane", icon: <DeleteOutlined />, color: "red" },
    ],
    "Role": [
        { id: 80, name: "View Roles", apiPath: "/roles/**", method: "GET", module: "Role Management", icon: <EyeOutlined />, color: "blue" },
        { id: 81, name: "Create Role", apiPath: "/roles/**", method: "POST", module: "Role Management", icon: <PlusOutlined />, color: "green" },
        { id: 82, name: "Edit Role", apiPath: "/roles/**", method: "PUT", module: "Role Management", icon: <EditOutlined />, color: "orange" },
        { id: 83, name: "Delete Role", apiPath: "/roles/**", method: "DELETE", module: "Role Management", icon: <DeleteOutlined />, color: "red" },
    ],
    "Seat": [
        { id: 90, name: "View Seats", apiPath: "/seats/**", method: "GET", module: "Seat", icon: <EyeOutlined />, color: "blue" },
        { id: 91, name: "Create Seat", apiPath: "/seats/**", method: "POST", module: "Seat", icon: <PlusOutlined />, color: "green" },
        { id: 92, name: "Edit Seat", apiPath: "/seats/**", method: "PUT", module: "Seat", icon: <EditOutlined />, color: "orange" },
        { id: 93, name: "Delete Seat", apiPath: "/seats/**", method: "DELETE", module: "Seat", icon: <DeleteOutlined />, color: "red" },
    ],
    "Setting": [
        { id: 100, name: "View Settings", apiPath: "/parameters/**", method: "GET", module: "Setting", icon: <EyeOutlined />, color: "blue" },
        { id: 101, name: "Update Settings", apiPath: "/parameters/**", method: "PUT", module: "Setting", icon: <EditOutlined />, color: "orange" },
    ],
    "Ticket": [
        { id: 110, name: "View Tickets", apiPath: "/tickets/**", method: "GET", module: "Ticket", icon: <EyeOutlined />, color: "blue" },
        { id: 111, name: "Create Ticket", apiPath: "/tickets/**", method: "POST", module: "Ticket", icon: <PlusOutlined />, color: "green" },
        { id: 112, name: "Edit Ticket", apiPath: "/tickets/**", method: "PUT", module: "Ticket", icon: <EditOutlined />, color: "orange" },
        { id: 113, name: "Delete Ticket", apiPath: "/tickets/**", method: "DELETE", module: "Ticket", icon: <DeleteOutlined />, color: "red" },
    ],
};
export default NewRole;
