import { Button, Form, InputNumber, message, Spin } from "antd";
import type { FormProps } from "antd/lib";
import { useEffect, useState } from "react";
import { getAllParamaters, updateParameter } from "../../services/parameter";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setParams } from "../../redux/features/params/paramsSlide";
import { checkPermission } from "../../utils/checkPermission";
import icons from "../../assets/icons";


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
            refundRate: response.data.refundRate
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
                                rules={[
                                    { required: true, message: 'Please enter the maximum number of intermediate airports' },
                                    { type: 'integer', message: 'Must be an integer' },
                                    { validator: (_, value) => value >= 0 ? Promise.resolve() : Promise.reject('Value must be non-negative') }
                                ]}
                            >
                                <InputNumber min={0} disabled={!canUpdate} />
                            </Form.Item>

                            <Form.Item<Parameter>
                                label="Min Flight Time (minutes)"
                                name="minFlightTime"
                                rules={[
                                    { required: true, message: 'Please enter the minimum flight time' },
                                    { type: 'integer', message: 'Must be an integer' },
                                    { validator: (_, value) => value >= 0 ? Promise.resolve() : Promise.reject('Time must be non-negative') }
                                ]}
                            >
                                <InputNumber min={0} disabled={!canUpdate} />
                            </Form.Item>

                            <Form.Item<Parameter>
                                label="Min Stop Time (minutes)"
                                name="minStopTime"
                                rules={[
                                    { required: true, message: 'Please enter the minimum stop time' },
                                    { type: 'integer', message: 'Must be an integer' },
                                    {
                                        validator: async (_, value) => {
                                            const maxStopTime = form.getFieldValue('maxStopTime');
                                            if (value >= 0 && (maxStopTime === undefined || value < maxStopTime)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Min stop time must be non-negative and less than max stop time');
                                        }
                                    }
                                ]}
                            >
                                <InputNumber min={0} disabled={!canUpdate} />
                            </Form.Item>

                            <Form.Item<Parameter>
                                label="Max Stop Time (minutes)"
                                name="maxStopTime"
                                rules={[
                                    { required: true, message: 'Please enter the maximum stop time' },
                                    { type: 'integer', message: 'Must be an integer' },
                                    {
                                        validator: async (_, value) => {
                                            const minStopTime = form.getFieldValue('minStopTime');
                                            if (value >= 0 && (minStopTime === undefined || value > minStopTime)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Max stop time must be non-negative and greater than min stop time');
                                        }
                                    }
                                ]}
                            >
                                <InputNumber min={0} disabled={!canUpdate} />
                            </Form.Item>

                            <Form.Item<Parameter>
                                label="Latest Booking Time (days)"
                                name="latestBookingDay"
                                rules={[
                                    { required: true, message: 'Please enter the latest booking time' },
                                    { type: 'integer', message: 'Must be an integer' },
                                    { validator: (_, value) => value >= 0 ? Promise.resolve() : Promise.reject('Time must be non-negative') }
                                ]}
                            >
                                <InputNumber min={0} disabled={!canUpdate} />
                            </Form.Item>

                            <Form.Item<Parameter>
                                label="Latest Cancel Time (days)"
                                name="latestCancelDay"
                                rules={[
                                    { required: true, message: 'Please enter the latest cancellation time' },
                                    { type: 'integer', message: 'Must be an integer' },
                                    {
                                        validator: async (_, value) => {
                                            const latestBookingDay = form.getFieldValue('latestBookingDay');
                                            if (value >= 0 && (latestBookingDay === undefined || value <= latestBookingDay)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Cancellation time must be non-negative and not exceed booking time');
                                        }
                                    }
                                ]}
                            >
                                <InputNumber min={0} disabled={!canUpdate} />
                            </Form.Item>

                            <Form.Item<Parameter>
                                label="Refund percentage (%)"
                                name="refundRate"
                                rules={[
                                    { required: true, message: 'Please enter the refund percentage' },
                                    { validator: (_, value) => value >= 0 && value <= 100 ? Promise.resolve() : Promise.reject('Percentage must be between 0 and 100') }
                                ]}
                            >
                                <InputNumber min={0} disabled={!canUpdate} />
                            </Form.Item>

                            {canUpdate && (
                                <div className="2-full flex gap-[10px] justify-end">
                                    <Button onClick={() => refetchParameters()}>
                                        {icons.reset} Reset
                                    </Button>
                                    <Button type="primary" onClick={() => form.submit()}>
                                        Update
                                    </Button>
                                </div>
                            )}
                        </Form>
                    </div>
            }
        </>
    )
}
