/* eslint-disable @typescript-eslint/no-explicit-any */
// components/role/UpdateRole.tsx
import { Form, Input, Modal, Select, message } from "antd";
import { useEffect, useState } from "react";
import { useUpdateRole } from "../../hooks/useRoles";
import { fetchPages } from "../../services/page";

const UpdateRole = ({ updatedRole, isUpdateOpen, setIsUpdateOpen, refetchData }: any) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdateRole();
    const [pages, setPages] = useState<{ value: number, label: string }[]>([]);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        form.setFieldsValue({
            id: updatedRole.id,
            roleName: updatedRole.roleName,
            pages: updatedRole.pages.map((p: { id: number }) => p.id),
        });
    }, [updatedRole, form]);

    useEffect(() => {
        fetchPages().then(res => {
            setPages(res.data.map((p: any) => ({ value: p.id, label: p.pageName })));
        });
    }, []);

    const handleOk = (value: any) => {
        mutate({ id: updatedRole.id, updateRole: value }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Update role successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
            onSettled: () => {
                setIsUpdateOpen(false);
            },
        });
    };

    return (
        <>
            {contextHolder}
            <Modal title="Update Role" open={isUpdateOpen} onCancel={() => setIsUpdateOpen(false)} onOk={() => form.submit()}>
                <Form layout="vertical" form={form} onFinish={handleOk}>
                    <Form.Item label="ID" name="id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Role Name" name="roleName" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Pages" name="pages" rules={[{ required: true }]}>
                        <Select mode="multiple" disabled={isPending} options={pages} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateRole;
