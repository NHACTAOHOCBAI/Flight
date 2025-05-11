import { Form, Input, message, Modal } from "antd"
import { useEffect } from "react";
import { useUpdateCity } from "../../hooks/useCities";

interface Props {
    updatedCity: City,
    isUpdateOpen: boolean,
    setIsUpdateOpen: (value: boolean) => void
    refetchData: () => Promise<void>
}

const UpdateCity = ({ updatedCity, isUpdateOpen, setIsUpdateOpen, refetchData }: Props) => {
    const [form] = Form.useForm();
    const { mutate, isPending } = useUpdateCity();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = (value: City) => {
        mutate({ id: updatedCity.id, updateCity: value }, {
            onSuccess: async () => {
                await refetchData();
                messageApi.success("Update city successfully");
            },
            onError: (error) => {
                messageApi.error(error.message);
            },
            onSettled: () => {
                setIsUpdateOpen(false);
            }
        })
    };

    const handleCancel = () => {
        setIsUpdateOpen(false);
    };

    useEffect(() => {
        form.setFieldsValue({
            id: updatedCity.id,
            cityCode: updatedCity.cityCode,
            cityName: updatedCity.cityName
        })
    }, [updatedCity, form])
    return (
        <>
            {contextHolder}
            <Modal
                title="Update City"
                closable={{ 'aria-label': 'Custom Close Button' }}
                okText="Update"
                open={isUpdateOpen}
                onCancel={handleCancel}
                loading={isPending}
                onOk={() => form.submit()}
            >
                <Form
                    layout={"vertical"}
                    form={form}
                    onFinish={handleOk}
                >

                    <Form.Item label="ID"
                        name="id">
                        <Input disabled />
                    </Form.Item>

                    <Form.Item label="Code"
                        name="cityCode"
                        rules={[{ required: true }]}>
                        <Input disabled={isPending} placeholder="please input city code" />
                    </Form.Item>

                    <Form.Item label="City"
                        name="cityName"
                        rules={[{ required: true }]}>
                        <Input disabled={isPending} placeholder="please input city name" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
export default UpdateCity