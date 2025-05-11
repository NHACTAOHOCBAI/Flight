import { Form, Input, Modal } from "antd"
import { useEffect, useState } from "react";

interface Props {
    updatedCity: City,
    isUpdateOpen: boolean,
    setIsUpdateOpen: (value: boolean) => void
}

const UpdateCity = ({ updatedCity, isUpdateOpen, setIsUpdateOpen }: Props) => {
    const [form] = Form.useForm();
    const [isSubmitUpdate, setIsSubmitUpdate] = useState(false)
    const handleOk = () => {
        setIsUpdateOpen(false);
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
        <Modal
            title="Update City"
            closable={{ 'aria-label': 'Custom Close Button' }}
            okText="Update"
            open={isUpdateOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            loading={isSubmitUpdate}
        >
            <Form
                layout={"vertical"}
                form={form}
            >

                <Form.Item label="ID"
                    name="id">
                    <Input disabled />
                </Form.Item>

                <Form.Item label="Code"
                    name="cityCode"
                    rules={[{ required: true }]}>
                    <Input placeholder="please input city code" />
                </Form.Item>

                <Form.Item label="City"
                    name="cityName"
                    rules={[{ required: true }]}>
                    <Input placeholder="please input city name" />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default UpdateCity