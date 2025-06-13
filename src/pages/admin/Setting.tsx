import { Button, Form, InputNumber, message, Spin } from "antd";
import type { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import { getAllParamaters, updateParameter } from "../../services/parameter";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setParams } from "../../redux/features/params/paramsSlide";
import { checkPermission } from "../../utils/checkPermission";


export default function Setting() {
    const canUpdate = checkPermission("Update Parameter");
    const [isPending, setIsPending] = useState(false);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const dispath = useAppDispatch()
    const refetchParameters = async () => {
        setIsPending(true);
        const response = await getAllParamaters();
        dispath(setParams(response.data))
        form.setFieldsValue({
            maxInterQuantity: response.data.maxInterQuantity,
            minFlightTime: response.data.minFlightTime,
            minStopTime: response.data.minStopTime,
            maxStopTime: response.data.maxStopTime,
            latestBookingDay: response.data.latestBookingDay,
            latestCancelDay: response.data.latestCancelDay,
        });
        setIsPending(false);
    }
    const onFinish: FormProps<Parameter>['onFinish'] = async (values) => {
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
            {
                isPending ? <div className="w-full h-full flex justify-center items-center">
                    <Spin />
                </div>
                    :
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
                            <Form.Item<Parameter>
                                label="Max Intermediate Airport Quantity"
                                name="maxInterQuantity"
                                rules={[{ required: true }]}
                            >
                                <InputNumber disabled={!canUpdate} />
                            </Form.Item>

                            <Form.Item<Parameter>
                                label="Min Flight Time (minutes)"
                                name="minFlightTime"
                                rules={[{ required: true }]}
                            >
                                <InputNumber disabled={!canUpdate} />
                            </Form.Item>

                            <Form.Item<Parameter>
                                label="Min Stop Time (minutes)"
                                name="minStopTime"
                                rules={[{ required: true }]}
                            >
                                <InputNumber disabled={!canUpdate} />
                            </Form.Item>

                            <Form.Item<Parameter>
                                label="Max Stop Time (minutes)"
                                name="maxStopTime"
                                rules={[{ required: true }]}
                            >
                                <InputNumber disabled={!canUpdate} />
                            </Form.Item>

                            <Form.Item<Parameter>
                                label="Latest Booking Time (days)"
                                name="latestBookingDay"
                                rules={[{ required: true }]}
                            >
                                <InputNumber disabled={!canUpdate} />
                            </Form.Item>

                            <Form.Item<Parameter>
                                label="Latest Cancel Time (days)"
                                name="latestCancelDay"
                                rules={[{ required: true }]}
                            >
                                <InputNumber disabled={!canUpdate} />
                            </Form.Item>
                            {
                                canUpdate &&
                                <div className="2-full flex gap-[10px] justify-end">
                                    <Button onClick={() => refetchParameters()}>
                                        Reset
                                    </Button>
                                    <Button type="primary" onClick={() => form.submit()}>
                                        Save
                                    </Button>
                                </div>
                            }
                        </Form>
                    </div>
            }
        </>
    )
}
