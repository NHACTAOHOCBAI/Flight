import { Form, Input, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { useUpdateTicket } from "../../hooks/useTickets";


interface Props {
    updatedTicket: Ticket;
    isUpdateOpen: boolean;
    setIsUpdateOpen: (value: boolean) => void;
    refetchData: () => Promise<void>;
    flightSelectOptions: {
        value: number;
        label: React.ReactNode;
    }[];
    seatSelectOptions: {
        value: number;
        label: React.ReactNode;
    }[];
}

const UpdateTicket = ({
    updatedTicket,
    isUpdateOpen,
    setIsUpdateOpen,
    refetchData,
    flightSelectOptions,
    seatSelectOptions
}: Props) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdateTicket();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = (values: TicketRequest) => {
        mutate(
            {
                id: updatedTicket.id,
                data: values,
            },
            {
                onSuccess: async () => {
                    await refetchData();
                    messageApi.success("Update ticket successfully");
                },
                onError: (error) => {
                    messageApi.error(error.message);
                },
                onSettled: () => {
                    setIsUpdateOpen(false);
                },
            }
        );
    };

    const handleCancel = () => {
        setIsUpdateOpen(false);
    };

    useEffect(() => {
        form.setFieldsValue({
            flightId: updatedTicket.flight?.id,
            seatId: updatedTicket.seat?.id,
            passengerName: updatedTicket.passengerName,
            passengerEmail: updatedTicket.passengerEmail,
            passengerPhone: updatedTicket.passengerPhone,
            passengerIDCard: updatedTicket.passengerIDCard,
        });
    }, [updatedTicket, form]);

    return (
        <>
            {contextHolder}
            <Modal
                title="Update Ticket"
                open={isUpdateOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                confirmLoading={isPending}
            >
                <Form form={form} layout="vertical" onFinish={handleOk}>
                    <Form.Item label="Flight" name="flightId" rules={[{ required: true }]}>
                        <Select

                            options={flightSelectOptions}
                            disabled
                            placeholder="Select a flight"
                        />
                    </Form.Item>
                    <Form.Item label="Seat" name="seatId" rules={[{ required: true }]}>
                        <Select
                            options={seatSelectOptions}
                            disabled
                            placeholder="Select a seat"
                        />
                    </Form.Item>
                    <Form.Item label="Passenger Name" name="passengerName" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Email" name="passengerEmail" rules={[{ required: true, type: "email" }]}>
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Phone Number" name="passengerPhone" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="ID Card" name="passengerIDCard" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateTicket;
