/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select } from "antd";
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useCreateFlight } from "../../hooks/useFlights";
import useSelectOptions from "../../utils/selectOptions";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";

interface Props {
    isNewOpen: boolean;
    setIsNewOpen: (value: boolean) => void;
}
const MIN_FLIGHT_TIME = 300;
const MIN_STOP_TIME = 60;
const MAX_STOP_TIME = 100
const NewFlight = ({ isNewOpen, setIsNewOpen }: Props) => {
    const { planeSelectOptions, airportSelectOptions, seatSelectOptions } = useSelectOptions();
    const [form] = Form.useForm();
    const { mutate, isPending } = useCreateFlight();
    const [messageApi, contextHolder] = message.useMessage();
    const departureDate = Form.useWatch('departureDate', form);
    const arrivalDate = Form.useWatch('arrivalDate', form);
    const interAirports = Form.useWatch('interAirports', form);


    const handleCancel = () => setIsNewOpen(false);

    const handleNew = (values: any) => {
        console.log(values)
    };
    return (
        <>
            {contextHolder}
            <Modal
                okText="Create Flight"
                width={1200}
                title="New Flight"
                open={isNewOpen}
                onOk={() => form.submit()}
                onCancel={handleCancel}
                confirmLoading={isPending}
            >
                <Form
                    onValuesChange={(changedValues) => {
                        if (changedValues.arrivalDate || changedValues.departureDate) {
                            form.setFieldsValue({ interAirports: [] });
                        }
                        if (changedValues.departureDate) {
                            form.setFieldsValue({ arrivalDate: "" })
                        }
                    }}
                    layout="vertical"
                    form={form}
                    onFinish={handleNew}
                    style={{ display: "flex", gap: 20 }}
                >
                    <div style={{ width: '60%' }}>
                        <Form.Item label="Code" name="flightCode" rules={[{ required: true, message: "Please enter flight code" }]}>
                            <Input placeholder="Enter flight code" />
                        </Form.Item>

                        <Form.Item label="Plane" name="planeId" rules={[{ required: true, message: "Please select a plane" }]}>
                            <Select disabled={isPending} options={planeSelectOptions} placeholder="Select plane" />
                        </Form.Item>

                        <Form.Item label="Departure Airport" name="departureAirportId" rules={[{ required: true, message: "Please select a departure airport" }]}>
                            <Select disabled={isPending} options={airportSelectOptions} placeholder="Select departure airport" />
                        </Form.Item>

                        <Form.Item label="Arrival Airport" name="arrivalAirportId" rules={[{ required: true, message: "Please select an arrival airport" }]}>
                            <Select disabled={isPending} options={airportSelectOptions} placeholder="Select arrival airport" />
                        </Form.Item>

                        <div className="w-full flex justify-between gap-4">
                            <Form.Item
                                label="Departure Date"
                                name="departureDate"
                                rules={[{ required: true, message: 'Please select departure date and time' }]}
                            >
                                <DatePicker
                                    minDate={dayjs()}
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder="Select departure date and time"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Arrival Date"
                                name="arrivalDate"
                                rules={[
                                    { required: true, message: 'Please select arrival date and time' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const departure = getFieldValue('departureDate');
                                            if (!departure) return Promise.resolve();
                                            const diffMinutes = value.diff(departure, 'minute');
                                            if (diffMinutes < MIN_FLIGHT_TIME) {
                                                return Promise.reject(new Error('Flight duration must be at least 300 minutes (5 hours)'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                            >
                                <DatePicker
                                    disabled={!departureDate} // 👈 Chưa chọn ngày đi thì disable
                                    minDate={departureDate ? dayjs(departureDate).add(1, 'minute') : undefined}
                                    showTime={{ format: 'HH:mm' }}
                                    format="YYYY-MM-DD HH:mm"
                                    placeholder="Select arrival date and time"
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </div>

                        <div className="mb-[10px]">Intermediate Airports</div>
                        <Form.List
                            name="interAirports"
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        if (value && value.length > 3) {
                                            return Promise.reject(new Error('You can add up to 3 intermediate airports only.'));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }) => {
                                const currentInterAirports = form.getFieldValue("interAirports") || [];
                                const allFieldsFilled = currentInterAirports.every((item: { airportId: any; arrivalDate: any; departureDate: any; }) =>
                                    item &&
                                    item.airportId &&
                                    item.arrivalDate &&
                                    item.departureDate
                                );
                                return (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {fields.map(({ key, name, ...restField }, index) => {
                                            const prevDeparture = interAirports?.[index - 1]?.departureDate;
                                            return (
                                                <Row key={key} gutter={[16, 10]} align="middle">
                                                    <Col span={6}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'airportId']}
                                                            rules={[{ required: true, message: 'Select airport' }]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <Select
                                                                placeholder="Select inter airport"
                                                                disabled={isPending}
                                                                options={airportSelectOptions}
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    {/* ARRIVAL DATE */}
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'arrivalDate']}
                                                            rules={[{ required: true, message: 'Select stop date' }]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <DatePicker
                                                                showTime={{ format: 'HH:mm' }}
                                                                format="YYYY-MM-DD HH:mm"
                                                                style={{ width: '100%' }}
                                                                placeholder="Select stop date"
                                                                minDate={dayjs(prevDeparture || departureDate)}
                                                                maxDate={dayjs(arrivalDate)}
                                                                onChange={() => {
                                                                    const current = [...(form.getFieldValue("interAirports") || [])];

                                                                    // 1. Xóa departureDate của chính nó
                                                                    if (current[index]) {
                                                                        current[index].departureDate = undefined;
                                                                    }

                                                                    // 2. Xóa các phần tử n+1 trở đi
                                                                    const updated = current.slice(0, index + 1);

                                                                    // Cập nhật lại form
                                                                    form.setFieldsValue({ interAirports: updated });
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    {/* RE-DEPARTURE DATE */}
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'departureDate']}
                                                            rules={[
                                                                { required: true, message: 'Select re-departure date' },
                                                                ({ getFieldValue }) => ({
                                                                    validator(_, value) {
                                                                        const arrival = getFieldValue(['interAirports', name, 'arrivalDate']);
                                                                        if (!arrival) return Promise.resolve();
                                                                        const diffMinutes = value.diff(arrival, 'minute');
                                                                        if (diffMinutes < MIN_STOP_TIME || diffMinutes > MAX_STOP_TIME) {
                                                                            return Promise.reject(
                                                                                new Error(`Stop time must be between ${MIN_STOP_TIME} and ${MAX_STOP_TIME} minutes`)
                                                                            );
                                                                        }

                                                                        return Promise.resolve();
                                                                    },
                                                                }),
                                                            ]}
                                                            style={{ marginBottom: 0 }}
                                                        >
                                                            <DatePicker
                                                                showTime={{ format: 'HH:mm' }}
                                                                format="YYYY-MM-DD HH:mm"
                                                                style={{ width: '100%' }}
                                                                placeholder="Select re-departure date"
                                                                disabled={!form.getFieldValue(['interAirports', name, 'arrivalDate'])}
                                                                minDate={
                                                                    form.getFieldValue(['interAirports', name, 'arrivalDate'])
                                                                        ? dayjs(form.getFieldValue(['interAirports', name, 'arrivalDate'])).add(1, 'minute')
                                                                        : dayjs(departureDate)
                                                                }
                                                                maxDate={dayjs(arrivalDate)}
                                                                onChange={() => {
                                                                    const current = [...(form.getFieldValue("interAirports") || [])];
                                                                    // 2. Xóa các phần tử n+1 trở đi
                                                                    const updated = current.slice(0, index + 1);
                                                                    // Cập nhật lại form
                                                                    form.setFieldsValue({ interAirports: updated });
                                                                }}
                                                            />

                                                        </Form.Item>
                                                    </Col>

                                                    <Col span={2} style={{ textAlign: 'center' }}>
                                                        <CloseOutlined
                                                            onClick={() => remove(name)}
                                                            style={{ fontSize: 20, cursor: 'pointer' }}
                                                        />
                                                    </Col>

                                                    <Col span={24}>
                                                        <Form.Item {...restField} name={[name, 'note']} style={{ marginBottom: 0 }}>
                                                            <TextArea rows={3} placeholder="Note (optional)" />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            );
                                        })}
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => add()}
                                                block
                                                icon={<PlusOutlined />}
                                                disabled={
                                                    currentInterAirports.length >= 3 || !allFieldsFilled ||
                                                    !departureDate ||
                                                    !arrivalDate
                                                }
                                            >
                                                Add Intermediate Airport
                                            </Button>
                                        </Form.Item>
                                    </div>
                                )
                            }}
                        </Form.List>
                    </div>

                    <div className="w-[1px] bg-gray-300"></div>

                    <div className="flex-1">
                        <div className="mb-[10px]">Tickets</div>
                        <Form.List
                            name="seats"
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        if (!value || value.length < 1) {
                                            return Promise.reject(new Error('You must add at least 1 seat item.'));
                                        }
                                    },
                                },
                            ]}
                        >
                            {(fields, { add, remove }, { errors }) => (
                                <>
                                    {fields.map(({ key, name, ...restField }) => {
                                        return (
                                            <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                                                <Col span={11}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'seatId']}
                                                        rules={[{ required: true, message: 'Select a seat' }]}
                                                        style={{ marginBottom: 0 }}
                                                    >
                                                        <Select disabled={isPending} options={seatSelectOptions} placeholder="Select seat" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={11}>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'quantity']}
                                                        rules={[{ required: true, message: 'Enter quantity' }]}
                                                        style={{ marginBottom: 0 }}
                                                    >
                                                        <InputNumber defaultValue={100} placeholder="Enter quantity" addonAfter="%" style={{ width: "100%" }} />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={2} style={{ textAlign: 'center' }}>
                                                    <CloseOutlined onClick={() => remove(name)} style={{ fontSize: 20, cursor: 'pointer' }} />
                                                </Col>
                                            </Row>
                                        )
                                    }
                                    )}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                            Add Ticket
                                        </Button>
                                        <Form.ErrorList errors={errors} />
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>

                        <Form.Item
                            label="Original Price"
                            name="originalPrice"
                            rules={[{ required: true, message: "Enter the original price" }]}
                        >
                            <InputNumber min={0} placeholder="Enter original price" style={{ width: "100%" }} addonAfter="VND" />
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    );
};

export default NewFlight;
