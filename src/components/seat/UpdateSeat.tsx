import { Form, Input, InputNumber, message, Modal } from "antd";
import { useEffect } from "react";
import { useUpdateSeat } from "../../hooks/useSeats";


interface Props {
    updatedSeat: Seat;
    isUpdateOpen: boolean;
    setIsUpdateOpen: (value: boolean) => void;
    refetchData: () => Promise<void>;
}

const UpdateSeat = ({ updatedSeat, isUpdateOpen, setIsUpdateOpen, refetchData }: Props) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdateSeat();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = (value: Seat) => {
        mutate({ id: updatedSeat.id, updateSeat: value }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Update seat successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
            onSettled: () => {
                setIsUpdateOpen(false);
            }
        });
    };

    useEffect(() => {
        form.setFieldsValue(updatedSeat);
    }, [updatedSeat, form]);

    return (
        <>
            {contextHolder}
            <Modal
                title="Update Seat"
                open={isUpdateOpen}
                onCancel={() => setIsUpdateOpen(false)}
                onOk={() => form.submit()}
                okText="Update"
                confirmLoading={isPending}
            >
                <Form layout="vertical" form={form} onFinish={handleOk}>
                    <Form.Item label="ID" name="id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Code" name="seatCode" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Name" name="seatName" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Price" name="price" rules={[{ required: true }]}>
                        <InputNumber addonAfter="%" disabled={isPending} style={{ width: "100%" }} />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea rows={3} disabled={isPending} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateSeat;
