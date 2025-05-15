import { Button, Form, InputNumber } from "antd";
import type { FormProps } from "antd/lib";


export default function Setting() {
    type FieldType = {
        maxInterQuantity?: number,
        minFlightTime?: number,
        minStopTime?: number,
        maxStopTime?: number,
        latestBookingDays?: number,
        LatestCancelDays?: number,
    };
    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className="w-full bg-white drop-shadow-xs p-[20px] rounded-[8px]">
            <Form
                name="basic"
                layout="horizontal"
                style={{ width: "100%" }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Max Intermediate Airport Quantity"
                    name="maxInterQuantity"
                    rules={[{ required: true }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Min Flight Time"
                    name="minFlightTime"
                    rules={[{ required: true }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Min Stop Time"
                    name="minStopTime"
                    rules={[{ required: true }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Max Flight Time"
                    name="maxStopTime"
                    rules={[{ required: true }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Latest Booking Days"
                    name="latestBookingDays"
                    rules={[{ required: true }]}
                >
                    <InputNumber />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Latest Cancel Days"
                    name="LatestCancelDays"
                    rules={[{ required: true }]}
                >
                    <InputNumber />
                </Form.Item>

                <div className="2-full flex justify-end">
                    <Button type="primary">
                        Save
                    </Button>
                </div>
            </Form>
        </div>
    )
}
