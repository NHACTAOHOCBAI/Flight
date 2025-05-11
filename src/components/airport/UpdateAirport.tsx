import { Form, Input, message, Modal, Select } from "antd";
import { useEffect } from "react";
import { useUpdateAirport } from "../../hooks/useAiports";


interface Props {
    updatedAirport: Airport;
    isUpdateOpen: boolean;
    setIsUpdateOpen: (value: boolean) => void;
    refetchData: () => Promise<void>;
    citySelectOptions: {
        value: number,
        label: React.ReactNode
    }[]
}

const UpdateAirport = ({ updatedAirport, isUpdateOpen, setIsUpdateOpen, refetchData, citySelectOptions }: Props) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdateAirport();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = (value: { airportCode: string; airportName: string; cityId: number; }) => {
        mutate({ id: updatedAirport.id, updateAirport: value }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Update airport successfully");
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
            id: updatedAirport.id,
            airportCode: updatedAirport.airportCode,
            airportName: updatedAirport.airportName,
            cityId: updatedAirport.city.id
        });
    }, [updatedAirport, form]);

    return (
        <>
            {contextHolder}
            <Modal
                title="Update Airport"
                open={isUpdateOpen}
                onCancel={handleCancel}
                onOk={() => form.submit()}
                confirmLoading={isPending}
            >
                <Form layout="vertical" form={form} onFinish={handleOk}>
                    <Form.Item label="ID" name="id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Code" name="airportCode" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Name" name="airportName" rules={[{ required: true }]}>
                        <Input disabled={isPending} />
                    </Form.Item>
                    <Form.Item label="Located At" name="cityId" rules={[{ required: true }]}>
                        <Select disabled={isPending} options={citySelectOptions} placeholder="Enter airport name" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default UpdateAirport;
