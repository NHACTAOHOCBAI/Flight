import { Form, Input, message, Modal } from "antd";
import { useEffect } from "react";
import { useUpdateAirline } from "../../hooks/useAirlines";


interface Props {
    updatedAirline: Airline;
    isUpdateOpen: boolean;
    setIsUpdateOpen: (value: boolean) => void;
    refetchData: () => Promise<void>;
}

const UpdateAirline = ({ updatedAirline, isUpdateOpen, setIsUpdateOpen, refetchData }: Props) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdateAirline();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = (value: Airline) => {
        mutate({ id: updatedAirline.id, updateAirline: value }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Update airline successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
            onSettled: () => {
                setIsUpdateOpen(false);
            }
        });
    };

    const handleCancel = () => {
        setIsUpdateOpen(false);
    };

    useEffect(() => {
        form.setFieldsValue(updatedAirline);
    }, [updatedAirline, form]);

    return (
        <>
            {contextHolder}
            <Modal
                title="Update Airline"
                open={isUpdateOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                confirmLoading={isPending}
            >
                <Form layout="vertical" form={form} onFinish={handleOk}>
                    <Form.Item label="ID" name="id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Code" name="airlineCode" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Name" name="airlineName" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label={<div>Logo <span className="text-gray-400">(optional)</span></div>} name="logo">
                        <Input disabled={isPending} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateAirline;
