import { Form, Input, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { useUpdatePlane } from "../../hooks/usePlanes";

interface Props {
    updatedPlane: Plane;
    isUpdateOpen: boolean;
    setIsUpdateOpen: (value: boolean) => void;
    refetchData: () => Promise<void>;
    airlineSelectOptions: {
        value: number;
        label: string;
    }[]
}

const UpdatePlane = ({ updatedPlane, isUpdateOpen, setIsUpdateOpen, refetchData, airlineSelectOptions }: Props) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdatePlane();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = (value: { planeCode: string; planeName: string; airlineId: number; }) => {
        mutate({ id: updatedPlane.id, updatePlane: value }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Update plane successfully");
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
        form.setFieldsValue({
            id: updatedPlane.id,
            planeCode: updatedPlane.planeCode,
            planeName: updatedPlane.planeName,
            airlineId: updatedPlane.airline.id
        });
    }, [updatedPlane, form]);

    return (
        <>
            {contextHolder}
            <Modal
                title="Update Plane"
                open={isUpdateOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
            // confirmLoading={isPending}
            >
                <Form layout="vertical" form={form} onFinish={handleOk}>
                    <Form.Item label="ID" name="id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Code" name="planeCode" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Name" name="planeName" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Airline" name="airlineId" rules={[{ required: true }]}>
                        <Select disabled={isPending} options={airlineSelectOptions} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdatePlane;
