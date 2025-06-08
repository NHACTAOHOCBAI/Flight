import { Button, Form, InputNumber, message } from "antd";
import type { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import { updateParameter } from "../../services/parameter";

type FieldType = {
    maxInterQuantity?: number,
    minFlightTime?: number,
    minStopTime?: number,
    maxStopTime?: number,
    latestBookingDays?: number,
    LatestCancelDays?: number,
};
export default function Setting() {
    const [isPending, setIsPending] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const refetchParameters = async () => {
        const response = await updateParameter({});
        form.setFieldsValue({
            maxInterQuantity: response.data.maxInterQuantity,
            minFlightTime: response.data.minFlightTime,
            minStopTime: response.data.minStopTime,
            maxStopTime: response.data.maxStopTime,
            latestBookingDays: response.data.latestBookingDays,
            LatestCancelDays: response.data.LatestCancelDays,
        });
    }
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try {
            setIsPending(true);
            await updateParameter(values)
            await refetchParameters();
            messageApi.success("Update paramaters successfully");
        }
        catch (error) {
            if (error && typeof error === "object" && "message" in error) {
                messageApi.error((error as { message: string }).message);
            } else {
                messageApi.error("An error occurred while updating profile");
            }
        }
        setIsPending(false);
    };
    useEffect(() => {
        refetchParameters()
    }, [])
    return (
        <>
            {contextHolder}
            <div className="w-full bg-white drop-shadow-xs p-[20px] rounded-[8px]">
                <Form
                    form={form}
                    name="basic"
                    layout="horizontal"
                    style={{ width: "100%" }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
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
                        <InputNumber disabled={isPending} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Max Flight Time"
                        name="maxStopTime"
                        rules={[{ required: true }]}
                    >
                        <InputNumber disabled={isPending} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Latest Booking Days"
                        name="latestBookingDays"
                        rules={[{ required: true }]}
                    >
                        <InputNumber disabled={isPending} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Latest Cancel Days"
                        name="LatestCancelDays"
                        rules={[{ required: true }]}
                    >
                        <InputNumber disabled={isPending} />
                    </Form.Item>

                    <div className="2-full flex justify-end">
                        <Button type="primary" onClick={() => form.submit()}>
                            Save
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    )
}
