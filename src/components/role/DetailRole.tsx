/* eslint-disable @typescript-eslint/no-explicit-any */
import { Drawer, Descriptions, Divider, Tag } from "antd";
import {
    EyeOutlined,
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import type { ReactNode } from "react";
import { permissionMap } from "../../utils/checkPermission";

interface Page {
    id: number;
    name: string;
    apiPath: string;
    method: string;
    module: string;
}

interface Role {
    id: number;
    roleName: string;
    roleDescription: string;
    pages: Page[];
}

interface Props {
    isDetailOpen: boolean;
    setIsDetailOpen: (value: boolean) => void;
    detailRole: Role;
}



const getPermissionIconAndColor = (name: string): { icon: ReactNode; color: string } => {
    if (name.includes("View") || name.includes("Get")) {
        return { icon: <EyeOutlined />, color: "blue" };
    } else if (name.includes("Create")) {
        return { icon: <PlusOutlined />, color: "green" };
    } else if (name.includes("Edit") || name.includes("Update")) {
        return { icon: <EditOutlined />, color: "orange" };
    } else if (name.includes("Delete")) {
        return { icon: <DeleteOutlined />, color: "red" };
    } else if (name.includes("Change Password")) {
        return { icon: <EditOutlined />, color: "purple" };
    }
    return { icon: null, color: "default" };
};

const DetailRole = ({ isDetailOpen, setIsDetailOpen, detailRole }: Props) => {
    // Nhóm các page theo module
    const groupedPages = detailRole.pages.reduce((acc, page) => {
        const key = `${page.method}_${page.apiPath}`;
        const permissionName = permissionMap[key] || page.name;
        const module = page.module || "Other";
        if (!acc[module]) {
            acc[module] = [];
        }
        acc[module].push({ ...page, name: permissionName });
        return acc;
    }, {} as Record<string, Page[]>);

    // Sắp xếp module và pages cho giao diện nhất quán
    const sortedModules = Object.entries(groupedPages)
        .sort(([moduleA], [moduleB]) => moduleA.localeCompare(moduleB))
        .map(([module, pages]) => ({
            module,
            pages: pages.sort((a, b) => a.name.localeCompare(b.name)),
        }));

    return (
        <Drawer
            title="Role Details"
            closable
            onClose={() => setIsDetailOpen(false)}
            open={isDetailOpen}
            width={700}
        >
            <Descriptions title="Role Information" bordered column={1}>
                <Descriptions.Item label="ID">{detailRole.id}</Descriptions.Item>
                <Descriptions.Item label="Role Name">{detailRole.roleName}</Descriptions.Item>
                <Descriptions.Item label="Description">
                    {detailRole.roleDescription || "No description provided"}
                </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Permissions</Divider>

            {sortedModules.length === 0 ? (
                <p className="text-gray-500">No permissions assigned to this role.</p>
            ) : (
                sortedModules.map(({ module, pages }) => (
                    <div key={module} style={{ marginBottom: 24 }}>
                        <h3 className="font-medium mb-[10px] text-blue-500">{module}</h3>
                        <div className="flex  gap-[10px] flex-wrap">
                            {pages.map((page) => {
                                const { icon, color } = getPermissionIconAndColor(page.name);
                                return (
                                    <Tag
                                        key={page.id}
                                        color={color}
                                        style={{ display: "flex", alignItems: "center", gap: 8, width: "fit-content" }}
                                    >
                                        {icon}
                                        <span>{page.name}</span>
                                    </Tag>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </Drawer>
    );
};

export default DetailRole;