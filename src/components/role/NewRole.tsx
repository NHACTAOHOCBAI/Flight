import { Button, Form, Input, Checkbox, message, Divider, Tag } from "antd";
import { useCreateRole } from "../../hooks/useRoles";
import { useEffect, useState } from "react";
import { fetchPages } from "../../services/page";
import { EyeOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
interface Page {
    id: number;
    name: string;
    apiPath: string;
    method: string;
    module: string;
}

const getActionTag = (method: string) => {
    switch (method.toUpperCase()) {
        case "GET":
            return <Tag icon={<EyeOutlined />} color="blue">View</Tag>;
        case "POST":
            return <Tag icon={<PlusOutlined />} color="green">Create</Tag>;
        case "PUT":
        case "PATCH":
            return <Tag icon={<EditOutlined />} color="orange">Update</Tag>;
        case "DELETE":
            return <Tag icon={<DeleteOutlined />} color="red">Delete</Tag>;
        default:
            return <Tag>{method}</Tag>;
    }
};

const NewRole = ({ refetchData }: { refetchData: () => Promise<void> }) => {
    const { mutate, isPending } = useCreateRole();
    const [pagesByModule, setPagesByModule] = useState<Record<string, Page[]>>({});
    const [messageApi, contextHolder] = message.useMessage();

    const handleNew = (value: { roleName: string; pages: number[] }) => {
        mutate(value, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Create role successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
        });
    };

    useEffect(() => {
        const loadPages = async () => {
            try {
                const res: Page[] = await fetchPages();

                // Group pages by module
                const grouped: Record<string, Page[]> = {};
                res.forEach((page) => {
                    if (!grouped[page.module]) {
                        grouped[page.module] = [];
                    }
                    grouped[page.module].push(page);
                });

                setPagesByModule(grouped);
            } catch {
                messageApi.error("Failed to fetch pages");
            }
        };

        loadPages();
    }, []);

    return (
        <>
            {contextHolder}
            <div className="bg-white drop-shadow-xs p-[24px] w-[50%] h-full rounded-[8px] overflow-y-auto">
                <div className="font-medium text-[16px] mb-[10px]">Create Role</div>
                <Form layout="vertical" onFinish={handleNew}>
                    <Form.Item label="Role Name" name="roleName" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Pages" name="pages" rules={[{ required: true }]}>
                        <Checkbox.Group style={{ width: "100%" }}>
                            <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-2">
                                {Object.entries(pagesByModule).map(([module, pages]) => (
                                    <div key={module}>
                                        <Divider orientation="left" plain>
                                            {module}
                                        </Divider>
                                        {pages.map((page) => (
                                            <Checkbox key={page.id} value={page.id}>
                                                {getActionTag(page.method)} {getFriendlyLabel(page)}
                                            </Checkbox>
                                        ))}
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
const getFriendlyLabel = (page: Page) => {
    const method = page.method.toUpperCase();
    const path = page.apiPath.toLowerCase();

    // Map technical entity names to readable ones
    const entityMap: Record<string, string> = {
        seats: "Seat",
        airlines: "Airline",
        airports: "Airport",
        cities: "City",
        planes: "Plane",
        roles: "Role",
        pages: "Page",
        users: "User",
        tickets: "Ticket",
    };

    // Extract main entity from path, like "seats", "airlines"
    const parts = path.split("/").filter(Boolean);
    const base = parts[0]?.replace(/{.*}/, "") || "";
    const entity = entityMap[base] || base;

    switch (method) {
        case "GET":
            return path.includes("{") ? `View ${entity}` : `List ${entity}s`;
        case "POST":
            return `Create ${entity}`;
        case "PUT":
        case "PATCH":
            return `Update ${entity}`;
        case "DELETE":
            return `Delete ${entity}`;
        default:
            return `${method} ${entity}`;
    }
};

export default NewRole;
