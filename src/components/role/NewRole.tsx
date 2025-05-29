/* eslint-disable @typescript-eslint/no-explicit-any */
// components/role/NewRole.tsx
import { Button, Form, Input, Select, message } from "antd";
import { useCreateRole } from "../../hooks/useRoles";
import { useEffect, useState } from "react";
import { fetchPages } from "../../services/page";

const NewRole = ({ refetchData }: { refetchData: () => Promise<void> }) => {
    const { mutate, isPending } = useCreateRole();
    const [pages, setPages] = useState<{ value: number, label: string }[]>([]);
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
        fetchPages().then(res => {
            setPages(res.map((p: any) => ({ value: p.id, label: p.pageName })));
        });
    }, []);

    return (
        <>
            {contextHolder}
            <div className="bg-white  drop-shadow-xs p-[24px] w-[40%] h-full rounded-[8px]">
                <div className="font-medium text-[16px] mb-[10px]">Create Role</div>
                <Form layout="vertical" onFinish={handleNew}>
                    <Form.Item label="Role Name" name="roleName" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Pages" name="pages" rules={[{ required: true }]}>
                        <Select
                            mode="multiple"
                            disabled={isPending}
                            options={pages}
                            placeholder="Select pages"
                        />
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

export default NewRole;
